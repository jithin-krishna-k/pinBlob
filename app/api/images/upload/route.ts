import { type NextRequest, NextResponse } from "next/server"
import { uploadImage } from "@/lib/blob-service"

export async function POST(request: NextRequest) {
  try {

    // Set a reasonable size limit for the request
    const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB

    try {
      const formData = await request.formData()
      const file = formData.get("file") as File

      if (!file) {
        return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `File size exceeds the limit of 4MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
          },
          { status: 400 },
        )
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid file type: ${file.type}. Only image files are allowed.`,
          },
          { status: 400 },
        )
      }

      const result = await uploadImage(file)

      return NextResponse.json({ success: true, data: result })
    } catch (formError) {
      console.error("Error processing form data:", formError)
      return NextResponse.json(
        {
          success: false,
          error: formError instanceof Error ? formError.message : "Failed to process form data",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("API route error uploading image:", error)

    // Return a more detailed error message
    const errorMessage = error instanceof Error ? error.message : "Failed to upload image"
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
