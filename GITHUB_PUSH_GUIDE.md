# GitHub Push & Security Guide

This guide provides step-by-step instructions to safely initialize, commit, and push this backend repository to **GitHub** without exposing sensitive environment variables, API secrets, database credentials, or private keys.

---

## 1. Security Architecture & Pre-Push Protection

The repository is pre-configured with a hardened `.gitignore` ensuring that sensitive configuration files are never tracked by Git.

### Strictly Ignored (Never Committed):
* **`.env`** and **`.env.*`** (All local environment files containing real secrets)
* **`*.pem`** and **`*.key`** (Cryptographic keys and private certificates)
* **`node_modules/`** (Dependencies)
* **`dist/`**, **`build/`**, **`coverage/`** (Build artifacts and test coverage)
* **`scratch/`** and **`tmp/`** (Temporary scripts and local test files)

### Safely Committed:
* **`.env.example`** and **`.env.production.example`** (Sanitized templates with dummy placeholder values)
* Complete clean microservice codebase (`services/`, `packages/`, `infra/`, `apps/`)
* Configuration files (`package.json`, `jest.config.cjs`, `docker-compose.yml`, Prisma schemas)
* Architecture documentation and API testing guides (`docs/`, `RUN_GUIDE.md`, `README.md`)

---

## 2. Step-by-Step GitHub Push Instructions

Run the following commands in PowerShell from the project root directory:

### Step 1 — Navigate to Project Root
```powershell
cd "c:\Users\The Mighty King\Desktop\E-Commerce\ecommerce-platform"
```

### Step 2 — Initialize Git
```powershell
git init
```

### Step 3 — Verify `.env` is Ignored
Run this check to confirm that your `.env` file will NOT be tracked:
```powershell
git check-ignore -v .env
```
*Expected output:*
```text
.gitignore:17:.env    .env
```

### Step 4 — Stage All Clean Files
```powershell
git add .
```

### Step 5 — Verify Staged Files Before Committing
```powershell
git status
```
*Confirmation check:* Make sure `.env` is **NOT** listed under `Changes to be committed`. Only `.env.example`, code, and documentation should appear in green.

### Step 6 — Commit the Codebase
```powershell
git commit -m "feat: production-ready e-commerce microservices platform"
```

### Step 7 — Set Branch to `main`
```powershell
git branch -M main
```

### Step 8 — Link to Your GitHub Repository
1. Go to [GitHub.com](https://github.com) and click **New Repository**.
2. Name your repository (e.g. `ecommerce-platform`).
3. Choose **Private** (recommended) or **Public**.
4. Leave "Add a README file", ".gitignore", and "license" **unchecked**.
5. Copy your repository URL, then run:

```powershell
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
```
*(Replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_REPOSITORY_NAME>` with your actual GitHub username and repository name).*

### Step 9 — Push to GitHub
```powershell
git push -u origin main
```

---

## 3. Post-Push Verification

Once the push finishes:
1. Open your repository at `https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>`.
2. Verify that:
   - `.env.example` is present.
   - `.env` is **ABSENT**.
3. Your codebase is now safely backed up on GitHub with zero credential leakage.

---

## 4. How to Deploy from GitHub onto a New Machine / Server

When cloning this project on another machine or production server:
```powershell
git clone https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
cd ecommerce-platform
npm install
```

Set up environment variables on the new machine:
1. Create local `.env` from template:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Open `.env` and fill in the production secrets and database URLs.
3. Start the entire Docker stack:
   ```powershell
   docker compose --env-file .env -f infra/docker-compose.yml up -d
   ```
