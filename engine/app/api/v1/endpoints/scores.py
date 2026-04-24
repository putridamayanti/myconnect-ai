from fastapi import APIRouter
from fastapi.params import Body

from app.schemas.score_schema import CalculateScoreRequest, CalculateScoreResponse
from google import genai

router = APIRouter()

@router.post('', tags=['scores'])
async def calculate_score(
        req: CalculateScoreRequest = Body(...),
):
    score = 0
    shared = []

    if req.candidate.looking_for.find(req.source.looking_for) != -1:
        score += 25
        shared.append(req.candidate.looking_for)

    if req.source.looking_for.find(req.candidate.looking_for) != -1:
        score += 20
        shared.append(req.source.looking_for)


    overlap_count = 0

    for item in req.candidate.skills:
        count = req.candidate.skills.count(item)
        overlap_count += count
        shared.append(item)


    if overlap_count > 0:
        score += overlap_count * 10

    prompt = ("Explain why these two attendees are a good match."
              "Source: {{source}}"
              "Candidate: {{candidate}}"
              "Shared: {{shared}}"
              "Keep it concise (2-3 sentences).")

    prompt = prompt.replace("{{source}}", str(req.source))
    prompt = prompt.replace("{{candidate}}", str(req.candidate))
    prompt = prompt.replace("{{shared}}", ",".join(shared))

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-flash-preview", contents=prompt
    )
    print(response.text)

    return CalculateScoreResponse(
        score=score,
        reason=response.text
    )
