import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if the token exists (don't expose the actual token)
    const tokenExists = !!process.env.BLOB_READ_WRITE_TOKEN

    return NextResponse.json({
      success: true,
      tokenExists,
      nodeEnv: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error("Error checking token:", error)
    return NextResponse.json({ success: false, error: "Failed to check token" }, { status: 500 })
  }
}
