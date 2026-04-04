from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AgroConnect Transport AI")

class TransportParams(BaseModel):
    distance_km: float
    weight_kg: float
    road_condition_index: float  # 1.0 (Tarred) to 3.0 (Dirt/Muddy)

@app.post("/api/ai/estimate-transport")
def estimate_cost(req: TransportParams):
    base_rate_fcfa = 100  # 100 FCFA per km base
    weight_surcharge = req.weight_kg * 15 # 15 FCFA per additional kg
    
    # Road condition acts as a multiplier penalty
    cost_fcfa = (req.distance_km * base_rate_fcfa * req.road_condition_index) + weight_surcharge
    
    return {
        "status": "success",
        "estimated_cost_fcfa": round(cost_fcfa, 2),
        "currency": "XAF",
        "model_used": "v1.0_mock_cameroon_roads"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
