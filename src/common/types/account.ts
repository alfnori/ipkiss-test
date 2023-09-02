export type Account = {
  identifier: string;
  amount: number;
  events: Operation[];
};

export type Operation = {
  type: string;
  originIdentifier: string;
  destinyIdentifier: string;
  amount: number;
};
