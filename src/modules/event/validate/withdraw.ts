import { EventType } from '@common/types/account';

const withdrawSchema = {
  type: 'object',
  properties: {
    type: { enum: [EventType.WITHDRAW] },
    origin: { type: 'string', minLength: 1, maxLength: 32 },
    amount: { type: 'number' },
  },
  required: ['type', 'origin', 'amount'],
};

export { withdrawSchema };
