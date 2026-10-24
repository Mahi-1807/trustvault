// Automated Automated Security Assertion Suite
const assert = require('assert');

// Mock Document Engine State
const documents = [
  {
    id: "doc-101",
    title: "Q3 Salary Sheet.pdf",
    owner: "alice",
    grants: ["alice", "bob"]
  }
];

function canAccessDocument(userId, docId) {
  const doc = documents.find(d => d.id === docId);
  if (!doc) return false;
  return doc.grants.includes(userId);
}

console.log("Running TrustVault Security Test Suite...\n");

// TEST 1: Authorized access works
assert.strictEqual(canAccessDocument('alice', 'doc-101'), true, "Owner should have access");
assert.strictEqual(canAccessDocument('bob', 'doc-101'), true, "Explicitly granted user should have access");
console.log("✓ TEST 1 PASSED: Authorized grants function properly.");

// TEST 2: Unauthorized user blocked (IDOR Protection)
assert.strictEqual(canAccessDocument('eve', 'doc-101'), false, "Unauthorized user must NOT have access");
console.log("✓ TEST 2 PASSED: Eve (unauthorized) cannot read Alice's document.");

// TEST 3: Revocation takes effect immediately
documents[0].grants = documents[0].grants.filter(u => u !== 'bob');
assert.strictEqual(canAccessDocument('bob', 'doc-101'), false, "Revoked user must lose access immediately");
console.log("✓ TEST 3 PASSED: Access revocation takes effect immediately.");

console.log("\nALL SECURITY TESTS PASSED SUCCESSFULLY!");