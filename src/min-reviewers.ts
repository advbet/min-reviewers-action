import { ILabel, IPullContext, IReview } from "./types";
import * as core from "@actions/core";
import * as github from "@actions/github";

export function getMinReviewers(labels: ILabel[]): string | number {
  const pattern = /min-(?<number>\d|all)-reviewers/;

  for (const label of labels) {
    const m = label.name.match(pattern);
    if (!m) {
      continue;
    }

    const { groups = {} } = m;
    const { number = "0" } = groups;
    return number === "all" ? number : parseInt(number, 10);
  }

  return 0;
}

export function requirementPassed(
  reviews: IReview[],
  requestedReviewers: number,
  minReviewers: number | string
): boolean {
  const latestReviews = reviews
    .reverse()
    .filter((review) => review.state.toLowerCase() !== "commented")
    .filter((review, index, array) => {
      // https://dev.to/kannndev/filter-an-array-for-unique-values-in-javascript-1ion
      return array.findIndex((x) => review.user?.id === x.user?.id) === index;
    });

  const approvedReviews = latestReviews.filter(
    (review) => review.state.toLowerCase() === "approved"
  );
  core.info(`Approved reviews: ${approvedReviews.length}. Required: ${minReviewers}`);

  if (minReviewers === "all") {
    core.debug(`Pull request reviewers: ${requestedReviewers}`);

    // some reviewers have not reviewed
    if (requestedReviewers > 0) {
      return false;
    }

    // some reviewers do not approve
    if (!latestReviews.every((review) => review.state.toLowerCase() === "approved")) {
      return false;
    }
  }

  return approvedReviews.length >= minReviewers;
}

export async function run(): Promise<void> {
  const token: string = core.getInput("GITHUB_TOKEN", { required: true });

  if (token === "") {
    throw new Error("No GITHUB_TOKEN found in input");
  }

  const octokit = github.getOctokit(token);
  const context = github.context;

  if (context.payload.pull_request == null) {
    throw new Error("No pull request found in payload");
  }

  const pullContext: IPullContext = {
    ...context.repo,
    pull_number: context.payload.pull_request.number,
  };

  const { data: pull } = await octokit.rest.pulls.get({ ...pullContext });

  const minReviewers = getMinReviewers(pull.labels);
  core.info(`Min reviewers: ${minReviewers}`);

  if (minReviewers === 0) {
    core.info("Label matching pattern not found");
    return;
  }

  const { data: reviews } = await octokit.rest.pulls.listReviews({
    ...pullContext,
    per_page: 100,
  });

  if (reviews.length === 0) {
    core.setFailed("No reviews found");
  }

  const requestedReviewers = pull.requested_reviewers ?? [];
  if (!requirementPassed(reviews, requestedReviewers.length, minReviewers)) {
    core.setFailed("Minimal requirement not met");
  }

  core.info("Done.");
}
