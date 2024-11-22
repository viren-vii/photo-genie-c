from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import vertexai
from vertexai.generative_models import GenerativeModel, Part

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Vertex AI
PROJECT_ID = "photogeniec-442422"
vertexai.init(project=PROJECT_ID, location="us-central1")
model = GenerativeModel("gemini-1.5-flash-002")

class ImageRequest(BaseModel):
    image_url: str
    prompt: str = "What is this image?"

@app.post("/image_understanding")
async def understand_image(request: ImageRequest):
    try:
        # Create image part from URL
        image_part = Part.from_uri(
            request.image_url,
            mime_type="image/jpeg"  # You might want to make this dynamic based on the image type
        )
        
        # Generate content
        response = model.generate_content([image_part, request.prompt])
        
        return {
            "success": True,
            "text": response.text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

