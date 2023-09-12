import { EventType } from '@common/types/account';

const depositSchema = {
  type: 'object',
  properties: {
    type: { enum: [EventType.DEPOSIT] },
    destination: { type: 'string', minLength: 1, maxLength: 32 },
    amount: { type: 'number' },
  },
  required: ['type', 'destination', 'amount'],
};

export { depositSchema };
