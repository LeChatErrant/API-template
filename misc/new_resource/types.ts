export interface Option {
  value?: boolean;
  desc: string;
  default: boolean;
}

export type Options = {
  tests: Option;
};
