# Sequence Diagram

```mermaid
sequenceDiagram
    participant Frontend as Frontend
    participant API as Backend API (NestJS)
    participant Gemini as Gemini
    participant DB as Database (PostgreSQL)
    participant Engine as AI Engine (Node.js)

    Frontend->>API: GET /api/v1/events/:id/concierge/messages
    
    Note over API: Find Matches Flow
    API->>API: Validate request
    API->>DB: Create user message
    API->>DB: Get user message histories

    loop For each result function call
        API->>Gemini: Get tool based on the query
        Gemini-->>API: Return selected tool
        API->>API: Execute function based on the selected tool
        API->>DB: Save tool in message to DB
        API->>API: Get the final result from tool execution
        API->>Engine: POST /api/v1/engine/scores
        Engine->>API: Return score and reason
        API->>DB: Save scores to messages in DB
        API->>API: Append result to message histories
    end
    
    DB->>API: Return matches and reply
    
    API-->>Frontend: 200 OK { matches: [...] }
```

# Usage of AI (Gemini, ChatGPT, Perplexity)
- Suggest best folder structure
- Suggest the tech stack such as ORM, pgvector
- Fix lint
- Debugging
- Fix any error flow
- Suggest best code flow
- Help me with test
- Help create migrations
- Optimize prompts
