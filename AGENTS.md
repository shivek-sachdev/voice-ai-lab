# AGENTS.md

## Cursor Cloud specific instructions

### Repository state

This repo is the **Voice Agent Development Sandbox** (see `README.md`). As of this
environment setup it is an empty scaffold: it contains only `README.md`, `LICENSE`,
and this file. There is **no application code, no dependency manifest, no services,
and no lint/test/build/run scripts yet**. There is nothing to build, run, or test
until voice-agent code is added.

### Available toolchains (preinstalled in the VM)

- Node.js v22 with `npm`, `pnpm`, and `yarn`
- Python 3.12 with `pip3`
- Go 1.22
- `docker` is NOT installed; `uv` is NOT installed.

### Update script behavior

The startup update script is intentionally a **guarded no-op** today. It only
installs dependencies if a manifest appears later:

- If `package.json` exists, it installs Node deps using whichever lockfile is
  present (`pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `package-lock.json` → npm),
  otherwise `npm install`.
- If `requirements.txt` exists, it runs `pip3 install -r requirements.txt`.

When you add a new product, prefer one of those conventional manifests so the
startup script picks deps up automatically. If you introduce a different stack
(e.g. `pyproject.toml` managed by `uv`, or Go modules), update the startup update
script accordingly and document the run/lint/test/build commands here.
