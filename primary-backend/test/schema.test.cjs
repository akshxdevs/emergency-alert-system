const test = require("node:test");
const assert = require("node:assert/strict");

const {
  SigninSchema,
  LoginSchema,
  GoogleSignupSchema,
} = require("../dist/types/index.js");

test("SigninSchema accepts a valid signup payload", () => {
  const payload = {
    email: "officer@example.com",
    password: "strong-password",
    role: "POLICE",
    name: "Officer Jane",
  };

  assert.deepEqual(SigninSchema.parse(payload), payload);
});

test("LoginSchema rejects short passwords", () => {
  const result = LoginSchema.safeParse({
    email: "user@example.com",
    password: "123",
  });

  assert.equal(result.success, false);
});

test("GoogleSignupSchema requires a supported role", () => {
  const result = GoogleSignupSchema.safeParse({
    email: "user@example.com",
    name: "Alex",
    role: "ADMIN",
  });

  assert.equal(result.success, false);
});
