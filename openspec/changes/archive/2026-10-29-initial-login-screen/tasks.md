# Tasks

## 1. Project foundation

- [x] 1.1 Add the Vite React/TypeScript, Tailwind, and Tauri 2 scaffolds; verify dependency installation and project file structure.
- [x] 1.2 Document dependency installation and launch commands in README; verify commands against package scripts.

## 2. Reference implementation

- [x] 2.1 Prepare the landscape asset from the supplied reference; verify it contains only the artwork region.
- [x] 2.2 Build reusable branding, steps, integration, and security components; verify all reference text and visual placeholders render.
- [x] 2.3 Style the screen at reference dimensions and for narrower desktop windows; verify a rendered capture against the reference.

## 3. Integration validation

- [x] 3.1 Run frontend and Tauri builds, launch the desktop application, and verify the window opens with the onboarding screen.
- [x] 3.2 Validate the OpenSpec change and verify all task boxes reflect completed work.

## 4. Background revision

- [x] 4.1 Use `public/assets/background.png` across the onboarding screen and remove the cropped landscape layers; verify the image appears behind both sections.
- [x] 4.2 Compare a rendered capture at 1536×1024 and a narrower desktop size, adjust image placement and text readability, and verify frontend build and OpenSpec validation succeed.

## 5. Native window revision

- [x] 5.1 Enable native Tauri window decorations and remove the custom drag permission; verify the Tauri configuration builds.
- [x] 5.2 Remove the fabricated title bar and inset frame so onboarding fills the webview; verify a rendered capture has no in-app window controls or outer frame at desktop and narrow sizes.
- [x] 5.3 Build and launch the Tauri application, verify the native window appears, and validate the OpenSpec change with all tasks complete.
