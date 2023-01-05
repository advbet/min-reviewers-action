export type ApprovalsAll = "all";

export interface Label {
  name: string;
}

export interface PullContext {
  owner: string;
  repo: string;
  pull_number: number;
}

export interface Review {
  state: string;
  user: {
    id: number;
  } | null;
}
