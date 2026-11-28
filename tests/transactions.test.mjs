import test from "node:test";
import assert from "node:assert/strict";
import { filterTransactions } from "../src/utils/transactions.ts";

const now = new Date(2026, 10, 25, 12);
const filters = {
  type: "all", category: [], provider: [], status: [], search: "",
  period: "This month", from: "", to: "",
};
const transaction = (id, type, category, status = "Completed") => ({
  id, transactionId: id, label: type, type, category, status,
  date: now, amount: 20, credits: 0, creditsApplied: 0, pendingCredits: 0,
  billIds: [], billPublicIds: [], provider: "Example Provider",
});
const rows = [
  transaction("bill", "Bill Payment", "Bill Transactions"),
  transaction("purchase", "Credits Purchased", "Credit Transactions"),
  transaction("promo", "Promo Credits Recieved", "Credit Transactions", "Pending"),
];
const ids = (changes) => filterTransactions(rows, [], { ...filters, ...changes }, now).map((row) => row.id);

test("specific types support multiple selections and legacy spellings", () => {
  assert.deepEqual(ids({ transactionTypes: ["Bill Payment", "Promo Credits Received"] }), ["bill", "promo"]);
  assert.deepEqual(ids({ transactionTypes: ["Credits Returned"] }), []);
});

test("type selection combines with the active tab, status, search, and date range", () => {
  const transactionTypes = ["Bill Payment", "Credits Purchased", "Promo Credits Received"];
  assert.deepEqual(ids({ transactionTypes, type: "credit", status: ["Completed"] }), ["purchase"]);
  assert.deepEqual(ids({ transactionTypes, search: "promo" }), ["promo"]);
  assert.deepEqual(ids({ transactionTypes, period: "Last month" }), []);
});

test("clearing types restores results and existing provider filtering stays available", () => {
  assert.deepEqual(ids({ transactionTypes: [] }), ["bill", "promo", "purchase"]);
  assert.deepEqual(ids({}), ["bill", "promo", "purchase"]);
  assert.deepEqual(ids({ provider: ["Another Provider"] }), []);
  assert.deepEqual(ids({ provider: ["Example Provider"] }), ["bill", "promo", "purchase"]);
});

test("amount ranges include their endpoints and combine with existing filters", () => {
  const amounts = [0, 500, 500.5, 501, 1000, 1001, 1500, 1501, 2000, 2001, 3000, 3001, 4000, 4001];
  const data = amounts.map(amount => ({ ...transaction(String(amount), "Bill Payment", "Bill Transactions"), amount }));
  const filtered = changes => filterTransactions(data, [], { ...filters, ...changes }, now).map(row => row.amount).sort((a,b) => a-b);
  for (const [range, expected] of [["0-500", [0,500]], ["501-1000", [501,1000]], ["1001-1500", [1001,1500]], ["1501-2000", [1501,2000]], ["2001-3000", [2001,3000]], ["3001-4000", [3001,4000]]]) assert.deepEqual(filtered({ amountRanges: [range] }), expected);
  assert.deepEqual(filtered({ amountRanges: ["custom"], minAmount: "500.50", maxAmount: "1001" }), [500.5,501,1000,1001]);
  assert.deepEqual(filtered({ amountRanges: ["custom"], minAmount: "1000", maxAmount: "500" }), []);
  assert.deepEqual(filtered({ amountRanges: ["custom"], minAmount: "", maxAmount: "500" }), []);
  assert.deepEqual(filtered({ amountRanges: ["0-500"], type: "credit" }), []);
});

test("multiple amount ranges form a union and clearing them restores all amounts", () => {
  const amounts = [0, 500, 501, 1000, 1001, 1500, 1501, 2000, 3500, 4001];
  const data = amounts.map(amount => ({ ...transaction(String(amount), "Bill Payment", "Bill Transactions"), amount }));
  const filtered = changes => filterTransactions(data, [], { ...filters, ...changes }, now).map(row => row.amount).sort((a,b) => a-b);
  assert.deepEqual(filtered({ amountRanges: ["0-500", "1001-1500"] }), [0,500,1001,1500]);
  assert.deepEqual(filtered({ amountRanges: ["0-500", "custom"], minAmount: "3500", maxAmount: "4001" }), [0,500,3500,4001]);
  assert.deepEqual(filtered({ amountRanges: ["0-500", "custom"], minAmount: "", maxAmount: "4001" }), []);
  assert.deepEqual(filtered({ amountRanges: [] }), amounts);
});
