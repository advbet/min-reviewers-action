"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const min_reviewers_1 = require("../src/min-reviewers");
(0, globals_1.test)("valid 1 reviewer label", () => {
    const labels = [{ name: "min-1-reviewers" }];
    (0, globals_1.expect)((0, min_reviewers_1.getMinReviewers)(labels)).toBe(1);
});
(0, globals_1.test)("invalid 1 reviewer label", () => {
    const labels = [{ name: "min-1-reviewer" }];
    (0, globals_1.expect)((0, min_reviewers_1.getMinReviewers)(labels)).toBe(0);
});
(0, globals_1.test)("multiple valid labels only first is taken", () => {
    const labels = [{ name: "min-1-reviewers" }, { name: "min-2-reviewers" }];
    (0, globals_1.expect)((0, min_reviewers_1.getMinReviewers)(labels)).toBe(1);
});
(0, globals_1.test)("valid all label", () => {
    const labels = [{ name: "min-all-reviewers" }];
    (0, globals_1.expect)((0, min_reviewers_1.getMinReviewers)(labels)).toBe("all");
});
(0, globals_1.test)("labels over 9 not supported", () => {
    const labels = [{ name: "min-10-reviewers" }];
    (0, globals_1.expect)((0, min_reviewers_1.getMinReviewers)(labels)).toBe(0);
});
(0, globals_1.test)("requirement not passed 1 review, but 2 required", () => {
    const reviews = [
        {
            user: { id: 1 },
            state: "APPROVED",
        },
    ];
    (0, globals_1.expect)((0, min_reviewers_1.requirementPassed)(reviews, 2, 2)).toBe(false);
});
(0, globals_1.test)("requirement passed 2 reviews, 2 required", () => {
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
    (0, globals_1.expect)((0, min_reviewers_1.requirementPassed)(reviews, 2, 2)).toBe(true);
});
(0, globals_1.test)("requirement not passed 2 reviews from same user, 2 required", () => {
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
    (0, globals_1.expect)((0, min_reviewers_1.requirementPassed)(reviews, 2, 2)).toBe(false);
});
(0, globals_1.test)("requirement not passed 2 reviews, 2 still assigned, all required", () => {
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
    (0, globals_1.expect)((0, min_reviewers_1.requirementPassed)(reviews, 2, 'all')).toBe(false);
});
(0, globals_1.test)("requirement not passed 1 approved, 1 dismissed, 2 required", () => {
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
    (0, globals_1.expect)((0, min_reviewers_1.requirementPassed)(reviews, 2, 2)).toBe(false);
});
