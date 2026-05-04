use std::path::Path;
use tauri::Manager;

fn main_window(app: &tauri::AppHandle) -> tauri::WebviewWindow {
    app.get_webview_window("main").unwrap()
}

#[tauri::command]
pub async fn pick_directory(app: tauri::AppHandle) -> Option<String> {
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
pub fn create_project_file(name: &str, path: &str, config: serde_json::Value) -> Result<(), String> {
    let project_file = Path::new(path).join(format!("{}.crochet", name));

    if project_file.exists() {
        return Err(format!("A project named '{}', already exists in that directory.", name));
    }

    let content = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;

    std::fs::write(project_file, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn open_project_file(app: tauri::AppHandle) -> Result<Option<String>, String> {
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

#[tauri::command]
pub fn read_yarn_file(path: &str) -> Result<Vec<String>, String> {
    use std::fs::File;
    use std::io::{BufRead, BufReader};
    let file = File::open(path).map_err(|e| e.to_string())?;
    let lines = BufReader::new(file)
        .lines()
        .collect::<Result<Vec<_>, _>>()
        .map_err(|err| err.to_string())?;
    Ok(lines)
}