export const tools = [
  {
    functionDeclarations: [
      {
        name: 'search_attendees',
        description: 'Search attendees based on intent',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'User intent',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'score_match',
        description: 'Score match between two attendees',
        parameters: {
          type: 'object',
          properties: {
            source_attendee: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
              },
              required: ['id'],
            },
            candidate: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
              },
              required: ['id'],
            },
          },
          required: ['source_attendee', 'candidate'],
        },
      },
      {
        name: 'draft_intro_message',
        description: 'Generate intro message',
        parameters: {
          type: 'object',
          properties: {
            from: { type: 'string' },
            to: { type: 'string' },
            context: { type: 'string' },
          },
          required: ['from', 'to'],
        },
      },
    ],
  },
];
