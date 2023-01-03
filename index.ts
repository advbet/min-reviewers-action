import * as core from "@actions/core";
import * as github from "@actions/github";

interface ILabel {
  name: string;
}

interface IPull {
  requested_reviewers: [];
  labels: ILabel[];
}

interface IPullContext {
  owner: string;
  repo: string;
  pull_number: number;
}

async function requirementPassed(
  octokit: ReturnType<typeof github.getOctokit>,
  pullContext: IPullContext,
  pull: IPull,
  minReviewers: any
): Promise<boolean> {
  const { data: reviews } = await octokit.rest.pulls.listReviews({
    ...pullContext,
    per_page: 100,
  });

  if (reviews.length === 0) {
    core.info("No reviews found");
    return false;
  }

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
  core.info(`Approved reviews: ${approvedReviews.length}`);

  if (minReviewers === "all") {
    core.debug(`Pull request reviewers: ${pull.requested_reviewers.length}`);

    // some reviewers have not reviewed
    if (pull.requested_reviewers.length > 0) {
      return false;
    }

    // some reviewers do not approve
    if (!latestReviews.every((review) => review.state.toLowerCase() === "approved")) {
      return false;
    }
  }

  return approvedReviews.length >= minReviewers;
}

function getMinReviewers(labels: ILabel[]): string | number {
  const pattern = /min-(?<number>\d|all)-reviewers/;

  for (const label of labels) {
    const m = label.name.match(pattern);
    if (m !== null) {
      const g = m.groups || {};
      return g.number || 0;
    }
  }

  return 0;
}

async function main(): Promise<void> {
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

  const { data: pull }: any = await octokit.rest.pulls.get({ ...pullContext });

  const minReviewers = getMinReviewers(pull.labels);
  core.info(`Min reviewers: ${minReviewers}`);

  if (minReviewers === 0) {
    core.info("Label matching pattern not found");
    return;
  }

  if (!(await requirementPassed(octokit, pullContext, pull, minReviewers))) {
    core.setFailed("Minimal requirement not met");
  }

  core.info("Done.");
}

async function run(): Promise<void> {
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

  const { data: pull }: any = await octokit.rest.pulls.get({ ...pullContext });

  const minReviewers = getMinReviewers(pull.labels);
  core.info(`Min reviewers: ${minReviewers}`);

  if (minReviewers === 0) {
    core.info("Label matching pattern not found");
    return;
  }

  if (!(await requirementPassed(octokit, pullContext, pull, minReviewers))) {
    core.setFailed("Minimal requirement not met");
  }

  core.info("Done.");
}

run()
  .then(() => {
    core.info("Done.");
  })
  .catch((e) => {
    core.error(e.message);
  });
