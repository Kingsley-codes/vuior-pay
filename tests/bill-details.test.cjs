const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
function load(name) {
  const source = fs.readFileSync(path.join(__dirname, "../src/utils", name + ".ts"), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, Date, Number });
  return exports;
}
const { billCreditInfo } = load("billCredits");
const { normalizeBillFrequency, validAutopayFrequency } = load("billFrequency");

test("unpaid estimates cover all reward tiers and overdue or invalid bills", () => {
  const now = new Date("2026-10-07T12:00:00Z");
  for (const [days, expected] of [[15, 15], [8, 10], [4, 5], [1, 2], [0, 0], [-1, 0]]) {
    assert.equal(billCreditInfo({ amount: 100, dueDate: new Date(now.getTime() + days * 86400000).toISOString() }, now).amount, expected);
  }
  assert.equal(billCreditInfo({ amount: 100, dueDate: "invalid" }, now).amount, 0);
  assert.equal(billCreditInfo({ amount: -100, dueDate: "2027-01-01" }, now).amount, 0);
});

test("pending and earned credits use saved payment rewards, regardless of today's date", () => {
  const bill = { status: "in review", amount: 999, dueDate: "2020-01-01", earlyPaymentReward: { credits: 12.34, status: "pending" } };
  assert.equal(billCreditInfo(bill).amount, 12.34);
  assert.equal(billCreditInfo(bill).label, "Credits after approval");
  assert.equal(billCreditInfo({ ...bill, status: "paid", earlyPaymentReward: { credits: 12.34, status: "granted" } }).label, "Credits earned");
  assert.equal(billCreditInfo({ ...bill, status: "paid", earlyPaymentReward: null }).amount, 0);
  assert.equal(billCreditInfo({ ...bill, earlyPaymentReward: { credits: 100, status: "rejected" } }).amount, 0);
});

test("autopay rejects one-time and unselected values while manual bills default to one-time", () => {
  assert.equal(normalizeBillFrequency(null), "one-time");
  assert.equal(normalizeBillFrequency("Monthly"), "monthly");
  assert.equal(normalizeBillFrequency("quaterly"), "quarterly");
  for (const frequency of ["", "one-time", "daily"]) assert.equal(validAutopayFrequency(true, frequency), false);
  for (const frequency of ["weekly", "biweekly", "monthly", "quarterly", "six months", "yearly"]) assert.equal(validAutopayFrequency(true, frequency), true);
  assert.equal(validAutopayFrequency(false, "one-time"), true);
});

const { withBillConfirmation, DuplicateBillError } = load("billDuplicates");
test("cancelling a duplicate leaves the existing bill untouched and never retries the save", async () => {
  let writes = 0;
  const result = await withBillConfirmation(async () => { writes++; throw new DuplicateBillError("Exists", { id: "existing", revision: "v1" }, true); }, async () => false);
  assert.equal(result, null);
  assert.equal(writes, 1);
});
test("continuing resubmits only with the reviewed existing bill ID and revision", async () => {
  const attempts = [];
  const result = await withBillConfirmation(async (confirmation) => {
    attempts.push(confirmation);
    if (!confirmation) throw new DuplicateBillError("Exists", { id: "existing", revision: "v1" }, true);
    return "updated";
  }, async () => true);
  assert.equal(result, "updated");
  assert.equal(attempts.length, 2);
  assert.equal(attempts[1].id, "existing");
  assert.equal(attempts[1].revision, "v1");
});
test("a non-replaceable bill never asks for permission to overwrite it", async () => {
  let prompted = false;
  await assert.rejects(withBillConfirmation(async () => { throw new DuplicateBillError("Already being paid", { id: "existing", revision: "v1" }, false); }, async () => { prompted = true; return true; }), /Already being paid/);
  assert.equal(prompted, false);
});
