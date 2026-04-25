# MyConnect Architecture

## Why I chose this stack

**Gemini**: I chose Gemini because it is free for testing, and it is already good enough for this challenge. I do not need the most advanced model here. I just need something that can follow the tool flow and produce useful results.

**pgvector**:For search, I would use pgvector because it keeps the embeddings in the same database, so the setup stays simpler.

## How agent state is persisted and resumed
The concierge should not depend on memory in the server process. Instead, I save everything in the database so the conversation can continue later.

For each event and attendee, I store:

- every user message,
- every assistant reply,
- every tool call,
- every tool result.

When a new message comes in, the API loads the saved conversation from the database and continues from there. That means if the server restarts or the app is deployed again, the chat does not get lost.

So the basic flow is:

- user sends a message,
- save it in the database,
- call the LLM,
- save tool calls and tool results,
- save the final answer,
- return it to the user.

This is the easiest and safest way to make the agent stateful.

## How I would scale this to 10k concurrent attendees
If many people use the concierge at the same time, the first thing I would do is keep the API stateless. That way I can run many copies of the NestJS app behind a load balancer.

I would also make sure the database has good indexes on:

- event ID,
- attendee ID,
- message ID,
- tool call ID,
- created time.

For the concierge itself, I would keep the search step small. I would first find a limited set of likely matches, then score only those candidates. That keeps the LLM work lighter and faster.

If usage grows a lot, I would:
- cache repeated searches,
- queue non-urgent jobs like embeddings refresh,
- add rate limits for LLM calls,
- and archive old conversation data if needed.

So in short: keep the app stateless, keep the database indexed, and avoid doing too much work on every request.

## How I would handle PII and data protection
I am not an expert on legal/privacy wording, so I would keep this simple and practical. For this take-home, I would explain it in simple terms: “I try not to collect extra personal data, I do not log private data, and I only send the minimum needed to the model.”