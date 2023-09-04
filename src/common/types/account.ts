export enum EventType {
  OPEN = 'OPEN',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
  DEPOSIT = 'deposit',
}

export type Account = {
  accountNumber: string;
  balance: number;
  events: Operation[];
};

export type Operation = {
  trackerId: string;
  type: EventType;
  origin?: string;
  destination?: string;
  amount: number;
  date: Date;
};
