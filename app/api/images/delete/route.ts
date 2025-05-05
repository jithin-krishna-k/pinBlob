import { type NextRequest, NextResponse } from "next/server"
import { deleteImage } from "@/lib/blob-service"

export async function POST(request: NextRequest) {
  try {

    const { pathname } = await request.json()

    if (!pathname) {
      return NextResponse.json({ success: false, error: "No pathname provided" }, { status: 400 })
    }

    await deleteImage(pathname)

    return NextResponse.json({ success: true })
  } catch (error) {
    // Return a more detailed error message
    const errorMessage = error instanceof Error ? error.message : "Failed to delete image"
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
