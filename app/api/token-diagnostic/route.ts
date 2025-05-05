import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if the token exists
    const token = process.env.BLOB_READ_WRITE_TOKEN

    if (!token) {
      return NextResponse.json({
        success: false,
        error: "BLOB_READ_WRITE_TOKEN is not defined",
        tokenExists: false,
        environment: process.env.NODE_ENV || "unknown",
      })
    }

    // Analyze the token format
    const tokenParts = token.split("_")
    let tokenInfo = {
      format: "unknown",
      type: "unknown",
      storeId: "unknown",
      length: token.length,
      firstChars: token.substring(0, 10) + "...",
      lastChars: "..." + token.substring(token.length - 5),
    }

    if (tokenParts.length >= 4) {
      tokenInfo = {
        ...tokenInfo,
        format: `${tokenParts[0]}_${tokenParts[1]}`,
        type: tokenParts[2],
        storeId: tokenParts[3],
      }
    }

    // Test the token with a simple request to the Vercel Blob API
    try {
      const response = await fetch("https://blob.vercel-storage.com/list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        return NextResponse.json({
          success: true,
          tokenExists: true,
          tokenInfo,
          environment: process.env.NODE_ENV || "unknown",
          verified: true,
          status: response.status,
          statusText: response.statusText,
        })
      } else {
        const errorText = await response.text()
        return NextResponse.json({
          success: false,
          error: `API error: ${response.status} ${errorText}`,
          tokenExists: true,
          tokenInfo,
          environment: process.env.NODE_ENV || "unknown",
          verified: false,
          status: response.status,
          statusText: response.statusText,
        })
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify token",
        tokenExists: true,
        tokenInfo,
        environment: process.env.NODE_ENV || "unknown",
        verified: false,
      })
    }
  } catch (error) {
    console.error("Error checking token:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to check token",
        environment: process.env.NODE_ENV || "unknown",
      },
      { status: 500 },
    )
  }
}
