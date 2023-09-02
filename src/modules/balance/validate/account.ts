
const accountIdSchema = {
    querystring: {
        type: 'object',
        properties: {
          account_id: { type: 'string', minLength: 1, maxLength: 32 },
        },
        required: ['account_id'],
    }
}

export { accountIdSchema }