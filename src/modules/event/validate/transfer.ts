import { EventType } from '@common/types/account';

const transferSchema = {
  type: 'object',
  properties: {
    type: { enum: [EventType.TRANSFER] },
    origin: { type: 'string', minLength: 1, maxLength: 32 },
    destination: { type: 'string', minLength: 1, maxLength: 32 },
    amount: { type: 'number' },
  },
  required: ['type', 'origin', 'destination', 'amount'],
};

export { transferSchema };
