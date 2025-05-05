import { NextResponse } from "next/server"
import { getAllImages } from "@/lib/blob-service"

export async function GET() {
  try {

    // Check if token has quotes and log (don't log the actual token)
    const token = process.env.BLOB_READ_WRITE_TOKEN || ""
    const hasQuotes = token.startsWith('"') || token.startsWith("'") || token.endsWith('"') || token.endsWith("'")

    const images = await getAllImages()

    return NextResponse.json({ success: true, data: images })
  } catch (error) {

    // Return a more detailed error message
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch images"
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: "Make sure BLOB_READ_WRITE_TOKEN is properly set in your environment variables without quotes.",
      },
      { status: 500 },
    )
  }
}
