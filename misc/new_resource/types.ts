export interface Option {
  value?: boolean;
  desc: string;
  default: boolean;
}

export type Options = { [name: string]: Option};
