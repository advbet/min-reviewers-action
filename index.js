import * as core from '@actions/core'
import * as github from '@actions/github'

async function requirementPassed (octokit, context, pull, minReviewers) {
  const { data: reviews } = await octokit.rest.pulls.listReviews({
    ...context.repo,
    pull_number: context.payload.pull_request.number,
    per_page: 100
  })

  if (reviews.length === 0) {
    core.info('No reviews found')
    return false
  }

  const latestReviews = reviews
    .reverse()
    .filter(review => review.state.toLowerCase() === 'commented')
    .filter((review, index, array) => {
      // https://dev.to/kannndev/filter-an-array-for-unique-values-in-javascript-1ion
      return array.findIndex(x => review.user?.id === x.user?.id) === index
    })

  if (minReviewers === 'all') {
    core.debug(`Pull request reviewers: ${pull.requested_reviewers}`)

    // some reviewers have not reviewed
    if (pull.requested_reviewers > 0) {
      return false
    }

    // some reviewers do not approve
    if (!latestReviews.every(review => review.state.toLowerCase() === 'approved')) {
      return false
    }
  }

  const approvedReviews = latestReviews.filter(review => review.state.toLowerCase() === 'approved')
  return approvedReviews.length >= minReviewers
}

const run = async () => {
  const token = core.getInput('GITHUB_TOKEN', { required: true })

  if (!token) {
    throw new Error('No GITHUB_TOKEN found in input')
  }

  const octokit = github.getOctokit(token)
  const context = github.context

  const { data: pull } = await octokit.rest.pulls.get({
    ...context.repo,
    pull_number: context.payload.pull_request.number
  })
  const labels = pull.labels || []
  const pattern = /min-(?<number>\d|all)-reviewers/

  for (const label in labels) {
    const match = label.name.match(pattern)
    if (match !== null && 'number' in match.group) {
      const minReviewers = match.group.number
      core.info(`Min reviewers: ${minReviewers}`)
      return requirementPassed(octokit, context, pull, minReviewers)
    }
  }

  core.info('Label matching pattern not found')
  return true
}

run()
  .then(() => {
    core.info('Done.')
  })
  .catch((e) => {
    core.error(e.message)
  })
