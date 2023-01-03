"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core = require("@actions/core");
var github = require("@actions/github");
function requirementPassed(octokit, pullContext, pull, minReviewers) {
    return __awaiter(this, void 0, void 0, function () {
        var reviews, latestReviews, approvedReviews;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.rest.pulls.listReviews(__assign(__assign({}, pullContext), { per_page: 100 }))];
                case 1:
                    reviews = (_a.sent()).data;
                    if (reviews.length === 0) {
                        core.info("No reviews found");
                        return [2 /*return*/, false];
                    }
                    latestReviews = reviews
                        .reverse()
                        .filter(function (review) { return review.state.toLowerCase() !== "commented"; })
                        .filter(function (review, index, array) {
                        // https://dev.to/kannndev/filter-an-array-for-unique-values-in-javascript-1ion
                        return array.findIndex(function (x) { var _a, _b; return ((_a = review.user) === null || _a === void 0 ? void 0 : _a.id) === ((_b = x.user) === null || _b === void 0 ? void 0 : _b.id); }) === index;
                    });
                    approvedReviews = latestReviews.filter(function (review) { return review.state.toLowerCase() === "approved"; });
                    core.info("Approved reviews: ".concat(approvedReviews.length));
                    if (minReviewers === "all") {
                        core.debug("Pull request reviewers: ".concat(pull.requested_reviewers.length));
                        // some reviewers have not reviewed
                        if (pull.requested_reviewers.length > 0) {
                            return [2 /*return*/, false];
                        }
                        // some reviewers do not approve
                        if (!latestReviews.every(function (review) { return review.state.toLowerCase() === "approved"; })) {
                            return [2 /*return*/, false];
                        }
                    }
                    return [2 /*return*/, approvedReviews.length >= minReviewers];
            }
        });
    });
}
function getMinReviewers(labels) {
    var pattern = /min-(?<number>\d|all)-reviewers/;
    for (var _i = 0, labels_1 = labels; _i < labels_1.length; _i++) {
        var label = labels_1[_i];
        var m = label.name.match(pattern);
        if (m !== null) {
            var g = m.groups || {};
            return g.number || 0;
        }
    }
    return 0;
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var token, octokit, context, pullContext, pull, minReviewers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = core.getInput("GITHUB_TOKEN", { required: true });
                    if (token === "") {
                        throw new Error("No GITHUB_TOKEN found in input");
                    }
                    octokit = github.getOctokit(token);
                    context = github.context;
                    if (context.payload.pull_request == null) {
                        throw new Error("No pull request found in payload");
                    }
                    pullContext = __assign(__assign({}, context.repo), { pull_number: context.payload.pull_request.number });
                    return [4 /*yield*/, octokit.rest.pulls.get(__assign({}, pullContext))];
                case 1:
                    pull = (_a.sent()).data;
                    minReviewers = getMinReviewers(pull.labels);
                    core.info("Min reviewers: ".concat(minReviewers));
                    if (minReviewers === 0) {
                        core.info("Label matching pattern not found");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, requirementPassed(octokit, pullContext, pull, minReviewers)];
                case 2:
                    if (!(_a.sent())) {
                        core.setFailed("Minimal requirement not met");
                    }
                    core.info("Done.");
                    return [2 /*return*/];
            }
        });
    });
}
run()
    .then(function () {
    core.info("Done.");
})["catch"](function (e) {
    core.error(e.message);
});
