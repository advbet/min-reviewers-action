export interface ILabel {
  name: string;
}

export interface IPull {
  requested_reviewers?: [] | null;
  labels: ILabel[];
}

export interface IPullContext {
  owner: string;
  repo: string;
  pull_number: number;
}

export interface IReview {
  state: string;
  user: {
    id: number;
  } | null;
}
