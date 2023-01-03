import { expect, test } from "@jest/globals";
import { getMinReviewers, requirementPassed } from "../src/min-reviewers";

test("valid 1 reviewer label", () => {
  const labels = [{ name: "min-1-reviewers" }];
  expect(getMinReviewers(labels)).toBe(1);
});

test("invalid 1 reviewer label", () => {
  const labels = [{ name: "min-1-reviewer" }];
  expect(getMinReviewers(labels)).toBe(0);
});

test("multiple valid labels only first is taken", () => {
  const labels = [{ name: "min-1-reviewers" }, { name: "min-2-reviewers" }];
  expect(getMinReviewers(labels)).toBe(1);
});

test("valid all label", () => {
  const labels = [{ name: "min-all-reviewers" }];
  expect(getMinReviewers(labels)).toBe("all");
});

test("labels over 9 not supported", () => {
  const labels = [{ name: "min-10-reviewers" }];
  expect(getMinReviewers(labels)).toBe(0);
});

test("requirement not passed 1 review, but 2 required", () => {
  const reviews = [
    {
      user: { id: 1 },
      state: "APPROVED",
    },
  ];
  expect(requirementPassed(reviews, 2, 2)).toBe(false);
});

test("requirement passed 2 reviews, 2 required", () => {
  const reviews = [
    {
      user: { id: 1 },
      state: "APPROVED",
    },
    {
      user: { id: 2 },
      state: "APPROVED",
    },
  ];
  expect(requirementPassed(reviews, 2, 2)).toBe(true);
});

test("requirement not passed 2 reviews from same user, 2 required", () => {
  const reviews = [
    {
      user: { id: 1 },
      state: "APPROVED",
    },
    {
      user: { id: 1 },
      state: "APPROVED",
    },
  ];
  expect(requirementPassed(reviews, 2, 2)).toBe(false);
});

test("requirement not passed 2 reviews, 2 still assigned, all required", () => {
  const reviews = [
    {
      user: { id: 1 },
      state: "APPROVED",
    },
    {
      user: { id: 2 },
      state: "APPROVED",
    },
  ];
  expect(requirementPassed(reviews, 2, 'all')).toBe(false);
});

test("requirement not passed 1 approved, 1 dismissed, 2 required", () => {
  const reviews = [
    {
      user: { id: 1 },
      state: "APPROVED",
    },
    {
      user: { id: 2 },
      state: "DISMISSED",
    },
  ];
  expect(requirementPassed(reviews, 2, 2)).toBe(false);
});
