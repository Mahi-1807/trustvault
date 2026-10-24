# AI Prompts & Engineering History (PROMPTS.md)

### Entry 1: Auth Model Architecture (2026-10-15)
- **Prompt**: "Create an access control model for document sharing."
- **AI Output**: Proposed client-side checks based on role claims stored in JWT.
- **Flaw**: Stale JWT claims allow access after owner revokes permission.
- **Fix**: Updated architecture to perform real-time database permission lookups on every fetch request.

### Entry 2: Audit Ledger Integrity (2026-10-16)
- **Prompt**: "Build an audit log array."
- **AI Output**: Standard array append operation without integrity proof.
- **Flaw**: Logs could be overwritten or altered in memory without detection.
- **Fix**: Implemented sequential HMAC hash chaining where each entry signs the hash of the preceding entry.