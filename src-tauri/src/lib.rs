pub mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::project::read_yarn_file,
            commands::project::pick_directory,
            commands::project::create_project_file,
            commands::project::open_project_file,
            commands::file_tree::get_file_node,
            commands::file_tree::get_file_node_children,
            commands::file_tree::rename_file_node,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
