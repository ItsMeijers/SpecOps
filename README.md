# SpecOps

SpecOps is a very opinionated one way workflow desktop application for specification-driven agentic development.

## Prerequisites

- Node.js 20 or newer and npm
- Rust and Cargo
- [Tauri 2 system prerequisites](https://v2.tauri.app/start/prerequisites/) for your operating system

## Run

```sh
npm install
npm run tauri dev
```

To build a desktop bundle:

```sh
npm run tauri build
```

To inspect the frontend alone, run `npm run dev` and open `http://127.0.0.1:1420`. `npm run build` checks TypeScript and produces the frontend in `dist/`.

The visual references are `designs/login-screen.png` and `designs/main-dashboard.png`. Change plans and requirements are in `openspec/changes/initial-login-screen/` and `openspec/changes/main-dashboard/`.
