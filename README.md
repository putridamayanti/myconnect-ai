# MyConnect AI

MyConnect AI is an AI-powered networking concierge platform designed to help event attendees find meaningful connections through semantic search and AI-driven matchmaking.

## Architecture

```mermaid
sequenceDiagram
    participant Frontend as Frontend
    participant API as Backend API (NestJS)
    participant Gemini as Gemini
    participant DB as Database (PostgreSQL)
    participant Engine as AI Engine (Python/FastAPI)

    Frontend->>API: POST /api/v1/events/:id/concierge/messages
    
    Note over API: Find Matches Flow
    API->>API: Validate request
    API->>DB: Create user message
    API->>DB: Get user message histories

    loop For each tool call
        API->>Gemini: Generate with tools (search_attendees, etc.)
        Gemini-->>API: Return function call
        API->>API: Execute tool logic
        API->>DB: Record tool call
        
        opt Matchmaking
            API->>Engine: POST /api/v1/engine/scores
            Engine->>API: Return compatibility scores
        end
        
        API->>API: Append results to history
    end
    
    API-->>Frontend: 200 OK { reply, matches, meta }
```

## Getting Started

### Prerequisites

- **Node.js**: v18+ (for Backend)
- **npm**: v9+
- **Python**: v3.10+ (for AI Engine)
- **PostgreSQL**: v14+ with `pgvector` extension

### Database Setup

1. Ensure PostgreSQL is running.
2. Create a database for the project.
3. Install the `pgvector` extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

### Backend Setup (NestJS)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` (or copy from the provided configuration):
   ```bash
   PORT=5100
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   GEMINI_API_KEY=your_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   ENGINE_API_URL=http://localhost:8000/api/v1/engine
   ```
4. Run migrations:
   ```bash
   npm run migration:run
   ```
5. Run specific migration:
   ```bash
   npx typeorm migration:run -d <path-to-datasource-file>
   ```

### AI Engine Setup (Python/FastAPI)

1. Navigate to the `engine` directory:
   ```bash
   cd engine
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key
   API_VERSION=1.0.0
   ```

## Running the Project

### Start the Backend
```bash
cd backend
npm run start:dev
```

### Start the AI Engine
```bash
cd engine
uvicorn main:app --reload
```

## Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## AI Usage & Best Practices
This project leverages AI for various development tasks:
- **Architecture Design**: Suggested folder structures and tech stack (ORM, pgvector).
- **Code Assistance**: Linting, debugging, and flow optimization.
- **Testing**: Assisted in creating E2E test suites for concierge services.
- **Prompt Engineering**: Optimized system prompts for the AI Concierge.
- **Documentation**: Assisted in managing documentation.

## What I am most proud of:
I am most proud that the submission is a real end-to-end system, not just a demo flow. It has a clear backend structure, stores every concierge step so the conversation can continue later, and uses actual structured tool-calling instead of a brittle prompt-only approach. I also like that the code is organized in a way that makes the AI part understandable, testable, and easy to review.

## Biggest trade-off:
The biggest trade-off I made was keeping the scope focused instead of trying to build everything. I chose to spend time on the core concierge flow, persistence, and tests, and left out extra polish like more advanced infra or extra nice-to-haves. That meant the project is smaller than a full production system, but it is cleaner, more reliable, and better aligned with the main thing the task is trying to evaluate.
