# TrustVault — Secure Document Platform

TrustVault is a zero-trust document sharing platform built to guarantee that unauthorized users cannot reach sensitive files through any vector, backed by a cryptographic tamper-evident audit ledger.

## Core Features
1. **Multi-Role Authentication**: Administrator, Document Owner, and Viewer roles.
2. **Strict Server-Side Enforcement**: Permissions checked on every read/download request.
3. **Instant Access Revocation**: Immediate access termination upon permission removal.
4. **Cryptographic Audit Ledger**: Immutable, HMAC-chained event audit log.
5. **Interactive Attack Sandbox**: Live verification of system defense against common attack vectors.

## How to Run Locally

```bash
# Clone repository
git clone [https://github.com/YOUR_USERNAME/trustvault.git](https://github.com/YOUR_USERNAME/trustvault.git)
cd trustvault

# Run security test suite
npm test