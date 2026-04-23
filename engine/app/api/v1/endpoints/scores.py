from fastapi import APIRouter
from fastapi.params import Body

from app.schemas.score_schema import CalculateScoreRequest

router = APIRouter()

@router.post('/', tags=['scores'])
async def calculate_score(
        req: CalculateScoreRequest = Body(...),
):
    score = 0

    if req.candidate.looking_for.find(req.source.looking_for) != -1:
        score += 25

    if req.source.looking_for.find(req.candidate.looking_for) != -1:
        score += 20


    overlap_count = 0

    for item in req.candidate.skills:
        count = req.candidate.skills.count(item)
        overlap_count += count


    if overlap_count > 0:
        score += overlap_count * 10

    return {'score': score}
