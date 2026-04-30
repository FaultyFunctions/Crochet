use serde::{Serialize};
use tauri::Manager;
use std::path::Path;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FileNode {
    name: String,
    path: String,
    is_dir: bool,
    children: Option<Vec<FileNode>>
}

fn main_window(app: &tauri::AppHandle) -> tauri::WebviewWindow {
    app.get_webview_window("main").unwrap()
}

#[tauri::command]
async fn pick_directory(app: tauri::AppHandle) -> Option<String> {
    use tauri_plugin_dialog::DialogExt;

    let window = main_window(&app);
    let (tx, rx) = std::sync::mpsc::channel();

    app.dialog()
        .file()
        .set_title("Select Folder")
        .set_parent(&window)
        .pick_folder(move |folder| tx.send(folder).unwrap());

    rx.recv().unwrap().map(|p| p.to_string())
}

#[tauri::command]
fn create_project_file(name: &str, path: &str, config: serde_json::Value) -> Result<(), String> {
    let project_file = Path::new(path).join(format!("{}.crochet", name));

    if project_file.exists() {
        return Err(format!("A project named '{}', already exists in that directory.", name));
    }

    let content = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;

    std::fs::write(project_file, content).map_err(|e| e.to_string())?;
    Ok(())
}

// Provides top-level directories and files from the given path
#[tauri::command]
fn get_sorted_directory_contents(path: &str) -> Result<Vec<FileNode>, String> {
    use std::fs;

    let mut entries: Vec<FileNode> = fs::read_dir(path)
        .map_err(|e| e.to_string())?
        .filter_map(|e| e.ok())
        .map(|entry| {
            let meta = entry.metadata().map_err(|e| e.to_string())?;
            let is_dir = meta.is_dir();
            let entry_path = entry.path().to_string_lossy().to_string();
            let name = entry.file_name().to_string_lossy().to_string();
            let children = if is_dir { Some(vec![]) } else { None };
            Ok(FileNode { name, path: entry_path, is_dir, children })
        })
        .collect::<Result<Vec<_>, String>>()?;

    entries.sort_by(|a, b| {
        b.is_dir.cmp(&a.is_dir).then(a.name.to_lowercase().cmp(&b.name.to_lowercase()))
    });

    Ok(entries)
}

#[tauri::command]
async fn open_project_file(app: tauri::AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;

    let window = main_window(&app);
    let (tx, rx) = std::sync::mpsc::channel();
    
    app.dialog()
        .file()
        .set_title("Open Project File")
        .add_filter("Crochet Project", &["crochet"])
        .set_parent(&window)
        .pick_file(move |file| {
            tx.send(file).unwrap();
        });
    
    let file = rx.recv().unwrap();
    
    match file {
        None => Ok(None),
        Some(path) => {
            let contents = std::fs::read_to_string(path.to_string())
                .map_err(|e| e.to_string())?;
            Ok(Some(contents))
        }
    }
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
            pick_directory,
            create_project_file,
            open_project_file,
            get_sorted_directory_contents,
            move_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
