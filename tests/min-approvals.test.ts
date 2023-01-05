import { expect, test } from "@jest/globals";
import * as core from "@actions/core";
import { getMinApprovals, Labels, requirementPassed, Reviews } from "../src/min-approvals";

jest.spyOn(core, "info").mockImplementation(() => {
  return;
});
jest.spyOn(core, "debug").mockImplementation(() => {
  return;
});

describe("testing labels parsing", () => {
  test("valid 1 approval", () => {
    const labels = [{ name: "min-1-approvals" }];
    expect(getMinApprovals(labels as Labels)).toBe(1);
  });

  test("invalid 1 approval", () => {
    const labels = [{ name: "min-1-approval" }];
    expect(getMinApprovals(labels as Labels)).toBe(0);
  });

  test("multiple valid labels only first is taken", () => {
    const labels = [{ name: "min-1-approvals" }, { name: "min-2-approvals" }];
    expect(getMinApprovals(labels as Labels)).toBe(1);
  });

  test("valid all label", () => {
    const labels = [{ name: "min-all-approvals" }];
    expect(getMinApprovals(labels as Labels)).toBe("all");
  });

  test("labels over 9 supported", () => {
    const labels = [{ name: "min-999-approvals" }];
    expect(getMinApprovals(labels as Labels)).toBe(999);
  });
});

describe("testing requirement passing", () => {
  test("not passed: 1 approval, but 2 required", () => {
    const reviews = [
      {
        user: { id: 1 },
        state: "APPROVED"
      }
    ];
    expect(requirementPassed(reviews as Reviews, 2, 2)).toBe(false);
  });

  test("passed: 2 approvals, 2 required", () => {
    const reviews = [
      {
        user: { id: 1 },
        state: "APPROVED"
      },
      {
        user: { id: 2 },
        state: "APPROVED"
      }
    ];
    expect(requirementPassed(reviews as Reviews, 2, 2)).toBe(true);
  });

  test("not passed: 2 approvals from same user, 2 required", () => {
    const reviews = [
      {
        user: { id: 1 },
        state: "APPROVED"
      },
      {
        user: { id: 1 },
        state: "APPROVED"
      }
    ];
    expect(requirementPassed(reviews as Reviews, 2, 2)).toBe(false);
  });

  test("not passed: 2 approvals, 2 still assigned, all required", () => {
    const reviews = [
      {
        user: { id: 1 },
        state: "APPROVED"
      },
      {
        user: { id: 2 },
        state: "APPROVED"
      }
    ];
    expect(requirementPassed(reviews as Reviews, 2, "all")).toBe(false);
  });

  test("not passed: 1 approval, 1 dismissed, 2 required", () => {
    const reviews = [
      {
        user: { id: 1 },
        state: "APPROVED"
      },
      {
        user: { id: 2 },
        state: "DISMISSED"
      }
    ];
    expect(requirementPassed(reviews as Reviews, 2, 2)).toBe(false);
  });
});
