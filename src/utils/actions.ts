const API_URL = "http://localhost:8000";
export async function analyzeImage({ imageUrl }: { imageUrl: string }) {
  try {
    const response = await fetch(`${API_URL}/image_understanding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt: "What is this image?",
      }),
    });

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
