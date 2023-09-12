export type AccountIdDTO = {
  account_id: string;
};

export type EventOperationDTO = {
  type: string;
  origin: string;
  destination: string;
  amount: number;
};

export type DepositOperationDTO = Omit<EventOperationDTO, 'type' | 'origin'>;
export type WithdrawOperationDTO = Omit<EventOperationDTO, 'type' | 'destination'>;
export type TransferOperationDTO = Omit<EventOperationDTO, 'type'>;

export type OriginEventDTO = {
  origin: {
    id: string;
    balance: number;
  };
};

export type DestinationEventDTO = {
  destination: {
    id: string;
    balance: number;
  };
};

export type TransferEventDTO = OriginEventDTO & DestinationEventDTO;
