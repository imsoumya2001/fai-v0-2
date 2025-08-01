import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, styles, originalPrompt } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    const styleText = styles.length > 0 ? styles.join(", ") : "cinematic movement"

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Create a cinematic video prompt for this furniture image. The original enhancement was: "${originalPrompt}". Include these video styles: ${styleText}. Create a 2-3 sentence prompt focusing on camera movement and cinematic quality for furniture showcase video. Keep it concise and professional.`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.4,
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
      "Cinematic dolly-in movement showcasing the furniture with professional lighting and smooth camera motion."

    return NextResponse.json({ prompt })
  } catch (error) {
    console.error("Gemini video prompt API error:", error)
    return NextResponse.json({ error: "Failed to generate video prompt" }, { status: 500 })
  }
}
