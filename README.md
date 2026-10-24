# TrustVault — Secure Document Platform

TrustVault is a zero-trust document sharing platform built to guarantee that unauthorized users cannot reach sensitive files through any vector, backed by a cryptographic tamper-evident audit ledger.

## Core Features
1. **Multi-Role Authentication**: Administrator, Document Owner, and Viewer roles.
2. **Strict Server-Side Enforcement**: Permissions checked on every read/download request.
3. **Instant Access Revocation**: Immediate access termination upon permission removal.
4. **Cryptographic Audit Ledger**: Immutable, HMAC-chained event audit log.
5. **Interactive Attack Sandbox**: Live verification of system defense against common attack vectors.

## 🚀 Live Links
- **Production Deployment**: https://trustvault-swart-gamma.vercel.app
- **GitHub Repository**: https://github.com/Mahi-1807/trustvault

  ---

## 👥 Demo Test Personas
Use the built-in role switcher in the browser to test access control across different user personas:
- **Alice (Document Owner)**: Full control to upload, view, share, and revoke access.
- **Bob (Authorized User)**: Can view documents shared by Alice; blocked from unauthorized documents.
- **Eve (Unauthorized User)**: Attempts to access restricted files are blocked and logged.
- **Admin (Security Auditor)**: Has view access to the cryptographic audit trail and security logs.

---

1. Run Automated Security Assertion Tests
bash
npm install
npm test

2 . Run the Web Application Locally
Bash
npx serve

Alternatively, open index.html using VS Code Live Server or python -m http.server 8000.

📋 Problems Solved
Granular Access Enforcement: Enforces strict persona-based access permissions.

IDOR & Tampering Defense: Prevents parameter tampering by verifying access permissions per request.

Cryptographic Audit Trail: Computes HMAC-chained hashes linking audit logs to detect any log tampering.

Instant Revocation: Terminates user access immediately upon revocation without session lag.

⚠️ Known Limitations & Future Roadmap
In-Memory Storage: Current state uses browser localStorage for rapid demonstration; clearing browser cache resets state to default seed data.

Client-Side Cryptography: HMAC chaining and authorization checks run via the Web Crypto API client-side and will be shifted to a Node.js/Database backend in production.
