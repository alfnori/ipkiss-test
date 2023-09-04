import { Account, EventType } from './account';

export type AccountDTO = {
  accountNumber: string;
  balance?: number;
};

export type OperationDTO = {
  type: EventType;
  amount: number;
  origin?: string;
  destination?: string;
};

export type EventDTO = {
  date: Date;
  type: EventType;
  origin: Account;
  destination: Account;
  amount: number;
};

export type DepositDTO = {
  destination: string;
  amount: number;
  date: Date;
};

export type WithdrawDTO = {
  origin: string;
  amount: number;
  date: Date;
};

export type TransferDTO = {
  origin: string;
  destination: string;
  amount: number;
  date: Date;
};

export type IntervalDTO = {
  startDate: Date;
  endDate: Date;
};

export type OriginEventDT0 = {
  origin: {
    id: string;
    balance: number;
  };
};

export type DestinationEventDT0 = {
  destination: {
    id: string;
    balance: number;
  };
};
