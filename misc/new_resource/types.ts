export interface Option {
  value?: boolean;
  desc: string;
  default: boolean;
}

export type Options = {
  database_model: Option;
  tests: Option;
};
