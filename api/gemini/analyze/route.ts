import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { image, styles } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    // Convert data URL to base64
    const base64Data = image.split(",")[1]
    const mimeType = image.split(";")[0].split(":")[1]

    const styleText = styles.length > 0 ? styles.join(", ") : "professional furniture photography"

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Analyze this furniture photo and create a transformation prompt. Include these style tags: ${styleText}. The prompt should be 3-4 sentences maximum, mention the uploaded image with 'make this' or 'turn this' or similar language, and focus on professional furniture photography enhancement.`,
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.3,
      },
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const prompt =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Transform this furniture photo into a professional, high-quality product image with enhanced lighting and clean background."

    return NextResponse.json({ prompt })
  } catch (error) {
    console.error("Gemini API error:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
