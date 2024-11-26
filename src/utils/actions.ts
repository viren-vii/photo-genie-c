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

export async function colorPalette({ imageUrl }: { imageUrl: string }) {
  try {
    const response = await fetch(`${API_URL}/image_understanding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt:
          "Extract two color palettes (light and dark theme) from this image. Return ONLY a JSON object with this exact format:\n\n" +
          "Example output:\n" +
          "{" +
          '"light": {' +
          '"text": "#110e0d",' +
          '"background": "#fdfdfc",' +
          '"primary": "#ff4d00",' +
          '"secondary": "#ffccbd",' +
          '"accent": "#ff8861"' +
          "}," +
          '"dark": {' +
          '"text": "#ebe9fc",' +
          '"background": "#010104",' +
          '"primary": "#3a31d8",' +
          '"secondary": "#020024",' +
          '"accent": "#0600c2"' +
          "}}\n\n" +
          "Requirements:\n" +
          "1. Light theme: Use light background with dark text\n" +
          "2. Dark theme: Use dark background with light text\n" +
          "3. Ensure high contrast between text and background colors\n" +
          "4. Use colors from the image for primary/secondary/accent\n" +
          "5. Return raw JSON only, no markdown or backticks\n" +
          "6. No need to keep accent, primary, secondary colors same for both themes. Update all of the colors for both themes and maintain consistent visual identity across themes, but adjust saturation and brightness to suit the light or dark theme.",
      }),
    });

    const data = await response.json();
    const cleanJson = data.text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getCaptions({ imageUrl }: { imageUrl: string }) {
  try {
    const response = await fetch(`${API_URL}/image_understanding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt:
          "Generate caption for this image. Give only caption, no other text.",
      }),
    });

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
