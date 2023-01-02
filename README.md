# Min reviewers GitHub Action

Sets minimum number of reviewers through PR labels. Label pattern `min-{number}-reviewers`. For all reviewers to
approve use `min-all-reviewers`.

## Usage

```yml
name: Min reviewers

on:
  pull_request:
    types: [labeled, unlabeled]

jobs:
  approved-by:
    runs-on: ubuntu-latest

    steps:
      - uses: advbet/min-reviewers-action@v1
```
