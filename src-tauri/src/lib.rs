mod github_auth;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            github_auth::github_auth_status,
            github_auth::github_auth_start
        ])
        .run(tauri::generate_context!())
        .expect("error while running SpecOps");
}
