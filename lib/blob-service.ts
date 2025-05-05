import { list, put, del } from "@vercel/blob"

export type BlobImage = {
  uploadedAt?: any
  url: string
  pathname: string
  // size: number
  // uploadedAt: Date
}

// Helper to get the token without quotes
function getToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN environment variable is not defined")
  }
  // Remove quotes if they exist
  return token.replace(/^["']|["']$/g, "")
}

// These functions should ONLY be called from server components or API routes
export async function getAllImages(): Promise<BlobImage[]> {
  try {

    const token = getToken()

    // Use the SDK with explicit token
    const { blobs } = await list({ token })


    return blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: new Date(blob.uploadedAt),
    }))
  } catch (error) {
    console.error("Error fetching images:", error)
    throw error
  }
}

export async function uploadImage(file: File): Promise<BlobImage> {
  try {

    // Check file size - limit to 4MB to avoid issues
    const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the limit of 4MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`)
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      throw new Error(`Invalid file type: ${file.type}. Only image files are allowed.`)
    }

    const token = getToken()

    // Use the SDK with explicit token and multipart for larger files
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
      token,
      multipart: file.size > 1024 * 1024, // Use multipart for files larger than 1MB
    })


    return {
      url: blob.url,
      pathname: blob.pathname,
    }
  } catch (error) {
    console.error("Error uploading image:", error)

    // Try to extract more meaningful error messages
    let errorMessage = "Failed to upload image"
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === "string") {
      errorMessage = error
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message)
    }

    throw new Error(errorMessage)
  }
}

export async function deleteImage(pathname: string): Promise<void> {
  try {

    const token = getToken()

    // Use the SDK with explicit token
    await del(pathname, { token })

  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}
