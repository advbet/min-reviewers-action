# Min reviewers GitHub Action

FIXME

## Usage

```yml
name: Min reviewers

on:
  pull_request_review:
    types: [submitted, dismissed]

jobs:
  approved-by:
    runs-on: ubuntu-latest

    steps:
      - uses: advbet/min-reviewers-action@v1
```
