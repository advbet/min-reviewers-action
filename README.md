# Min approvals GitHub Action

Sets minimum number of approvals through PR labels. Label pattern `min-{number}-approvals`. For all reviewers to
approve use `min-all-approvals`.

## Usage

```yml
name: Min approvals

on:
  pull_request:
    types: [labeled, unlabeled]

jobs:
  approved-by:
    runs-on: ubuntu-latest

    steps:
      - uses: advbet/min-approvals-action@v1
```
