export interface ILabel {
  name: string;
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
