use serde::Serialize;
use std::path::Path;

const ALLOWED_EXTS: &[&str] = &["chatter", "yarn"];

fn is_allowed_file(path: &std::path::Path) -> bool {
    path.extension()
        .and_then(|e| e.to_str())
        .map(|ext| ALLOWED_EXTS.iter().any(|a| a.eq_ignore_ascii_case(ext)))
        .unwrap_or(false)
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ExplorerNodeInitialData {
    pub path: String,
    pub name: String,
    pub is_directory: bool,
}

#[tauri::command]
pub async fn get_explorer_node(path: String) -> Result<ExplorerNodeInitialData, String> {
    let metadata = tokio::fs::metadata(&path)
        .await
        .map_err(|e| e.to_string())?;
    let name = Path::new(&path)
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("")
        .to_string();
    Ok(ExplorerNodeInitialData {
        path,
        name,
        is_directory: metadata.is_dir(),
    })
}

#[tauri::command]
pub async fn get_explorer_node_children(path: String) -> Result<Vec<ExplorerNodeInitialData>, String> {
    let p = Path::new(&path);
    if !p.is_dir() {
        return Ok(vec![]);
    }

    let mut entries = tokio::fs::read_dir(p).await.map_err(|e| e.to_string())?;
    let mut nodes = Vec::new();

    while let Some(entry) = entries.next_entry().await.map_err(|e| e.to_string())? {
        let entry_path = entry.path();
        let metadata = entry.metadata().await.map_err(|e| e.to_string())?;
        let is_directory = metadata.is_dir();

        // Filter: keep folders + allowed file extensions only
        if !is_directory && !is_allowed_file(&entry_path) {
            continue;
        }

        let name = entry_path
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("")
            .to_string();

        nodes.push(ExplorerNodeInitialData {
            path: entry_path.to_string_lossy().to_string(),
            name,
            is_directory,
        });
    }

    // Folders first, then alphabetical
    nodes.sort_by(|a, b| match (a.is_directory, b.is_directory) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
    });

    Ok(nodes)
}

#[tauri::command]
pub async fn rename_explorer_node(old_path: String, new_path: String) -> Result<(), String> {
    tokio::fs::rename(&old_path, &new_path)
        .await
        .map_err(|e| e.to_string())
}
