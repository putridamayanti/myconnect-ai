# MyConnect AI Walkthrough

Welcome to the official walkthrough for **MyConnect AI**! In this guide, we'll walk through a live demonstration of how our AI-powered networking concierge helps event attendees find their perfect professional matches.

Imagine you are attending a major Tech Conference. The room is full of people, but you're looking for something specific. Let's see how MyConnect AI makes that search effortless.

---

## Setup
Before we start the demo, ensure the following services are running:
1. **Backend (NestJS)**: `npm run start:dev` on port `5100`.
2. **AI Engine (FastAPI)**: `uvicorn main:app --reload` on port `8000`.

For this demo, we'll use **Alicia Jane**, a Senior Backend Engineer who's looking for an AI startup to join as a technical co-founder.

---

## Inquiry
Open your API client (like Postman or Insomnia) and send a request to the Concierge.

**Endpoint:** `POST /api/v1/events/6246fb18-cee1-4400-96ee-84bc96f7ce92/concierge/messages`

**Payload:**
```json
{
  "attendee_id": "249155d5-5099-40d9-b7b6-b346435f5533",
  "message": "I want to find AI startups looking for technical co-founders. Who should I talk to?"
}
```

---

## AI at Work
As soon as you hit send, the AI Concierge (powered by Google Gemini) starts its multi-step reasoning process:

1. **Semantic Search**: The AI identifies that you're looking for people. It automatically calls the `search_attendees` tool.
2. **Vector Retrieval**: The system searches through thousands of attendees using `pgvector` to find profiles that match "AI startup", "founder", and "looking for co-founder".
3. **Matchmaking Logic**: The AI doesn't just stop at a keyword match. It sends the top candidates to our **AI Engine** (`/api/v1/engine/scores`) to calculate a compatibility score based on skills, goals, and bios.
4. **Tool Orchestration**: You'll see the AI executing multiple tools in a loop to refine the results until it finds the top 3 matches.

---

## Result
The AI returns a polished, personalized response:

### Reply
> "I've found 3 great matches for you! Based on your background in Node.js and AI integrations, you should definitely talk to **Sarah Lim**. She is the founder of LedgerAI and is specifically looking for a backend co-founder with NestJS experience."

### Matches
The response includes a `matches` array with detailed profiles and their compatibility scores:
- **Sarah Lim** (Score: 95) - *Perfect Skill Match*
- **Michael Tan** (Score: 82) - *Investor interested in AI*
- **Budi Santoso** (Score: 78) - *CTO at ClimateTech*

### Metadata
You can also see the `meta` object showing which tools the AI used to arrive at this conclusion:
```json
"meta": {
  "used_tools": ["search_attendees", "score_match", "draft_intro_message"],
  "total_matches": 3
}
```

---

## Breaking the Ice
Now that you've found a match, you need a way to reach out. Ask the concierge:
> "Can you help me write an intro message to Sarah Lim?"

The AI will call the `draft_intro_message` tool, looking at both Alicia's and Sarah's profiles to write a non-generic, high-converting message:

> "Hi Sarah! I'm Alicia, a backend engineer with extensive experience in NestJS and AI. I saw that LedgerAI is looking for a technical co-founder. I'm very interested in your mission to automate finance tools and would love to chat about how my background could help scale your platform."

---

## Conclusion
That's the power of **MyConnect AI**. We've turned a room full of strangers into a curated list of high-value opportunities, all through a simple conversation.

