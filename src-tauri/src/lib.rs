use serde::{Serialize, Deserialize};
use std::path::Path;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FileNode {
    name: String,
    path: String,
    is_dir: bool,
    children: Option<Vec<FileNode>>
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ProjectConfig {
    name: String,
    project_version: u32,
    project_directory: String,
    script_type: String,
}

impl ProjectConfig {
    pub const PROJECT_VERSION: u32 = 1;
}

#[tauri::command]
fn select_directory(app: tauri::AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;

    let folder = app
        .dialog()
        .file()
        .set_title("Select Folder")
        .blocking_pick_folder();

    Ok(folder.map(|p| p.to_string()))
}

#[tauri::command]
fn create_project_file(name: &str, path: &str, script_type: &str) -> Result<(), String> {
    let project_file = Path::new(path).join(format!("{}.crochet", name));

    if project_file.exists() {
        return Err(format!("A project named '{}', already exists in that directory.", name));
    }

    let config = ProjectConfig {
        name: name.to_string(),
        project_version: ProjectConfig::PROJECT_VERSION,
        project_directory: path.to_string(),
        script_type: script_type.to_string()
    };

    let content = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;

    std::fs::write(project_file, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn open_project(app: tauri::AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;

    let file = app
        .dialog()
        .file()
        .set_title("Open Project File")
        .add_filter("Crochet Project", &["crochet"])
        .blocking_pick_file();

    Ok(file.map(|p| p.to_string()))
}

// Provides directories and files from the given path
#[tauri::command]
fn read_directory(path: &str) -> Result<Vec<FileNode>, String> {
    use std::fs;

    let mut entries: Vec<FileNode> = fs::read_dir(path)
        .map_err(|e| e.to_string())?
        .filter_map(|e| e.ok())
        .filter_map(|entry| {
            let meta = entry.metadata().ok()?;
            let is_dir = meta.is_dir();
            let entry_path = entry.path().to_string_lossy().to_string();
            let name = entry.file_name().to_string_lossy().to_string();

            // Only add .yarn files
            if !is_dir && !name.ends_with(".yarn") {
                return None;
            }

            // Recursively read children if it's a directory
            let children = if is_dir {
                Some(read_directory(&entry_path).unwrap_or_default())
            } else {
                None
            };

            Some(Ok(FileNode { name, path: entry_path, is_dir, children }))
        })
        .collect::<Result<Vec<_>, String>>()?;

    entries.sort_by(|a, b| {
        b.is_dir.cmp(&a.is_dir).then(a.name.to_lowercase().cmp(&b.name.to_lowercase()))
    });

    Ok(entries)
}

// Update files on move
#[tauri::command]
fn move_path(source: &str, destination: &str) -> Result<(), String> {
    use std::path::Path;

    let source_path = Path::new(source);
    let file_name = source_path.file_name().ok_or("Invalid source path")?;
    let dest_path = Path::new(destination).join(file_name);

    if dest_path.exists() {
        return Err(format!("'{}' already exists in the destination.", file_name.to_string_lossy()));
    }

    std::fs::rename(source, dest_path).map_err(|e| e.to_string())
}

#[tauri::command]
fn read_yarn_file(path: &str) -> Result<Vec<String>, String> {
    use std::fs::File;
    use std::io::{BufRead, BufReader};
    let file = File::open(path).map_err(|e| e.to_string())?;
    let lines = BufReader::new(file)
        .lines()
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(lines)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            read_yarn_file,
            select_directory,
            create_project_file,
            open_project,
            read_directory,
            move_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
