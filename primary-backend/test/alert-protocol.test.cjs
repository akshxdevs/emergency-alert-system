const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseUpgradeRequestUrl,
  isValidAlertPriority,
  isValidStatusReport,
} = require("../dist/lib/alert-protocol.js");

test("parseUpgradeRequestUrl extracts user id and role", () => {
  assert.deepEqual(parseUpgradeRequestUrl("/user-123/?POLICE"), {
    userId: "user-123",
    userRole: "POLICE",
  });
});

test("parseUpgradeRequestUrl rejects malformed upgrade urls", () => {
  assert.equal(parseUpgradeRequestUrl(undefined), null);
  assert.equal(parseUpgradeRequestUrl("/user-123"), null);
  assert.equal(parseUpgradeRequestUrl("/?POLICE"), null);
});

test("isValidAlertPriority validates allowed priorities", () => {
  assert.equal(isValidAlertPriority("HIGH"), true);
  assert.equal(isValidAlertPriority("CRITICAL"), false);
});

test("isValidStatusReport validates allowed statuses", () => {
  assert.equal(isValidStatusReport("IN_PROCESS"), true);
  assert.equal(isValidStatusReport("REPORT"), false);
});
