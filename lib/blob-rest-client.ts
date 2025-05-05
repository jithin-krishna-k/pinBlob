// Direct implementation using Vercel Blob REST API instead of the SDK

export type BlobImage = {
    url: string
    pathname: string
    size: number
    uploadedAt: Date
}

// Helper to get the token
function getToken(): string {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
        throw new Error("BLOB_READ_WRITE_TOKEN environment variable is not defined")
    }
    return token
}

// List all blobs
export async function listBlobs(): Promise<BlobImage[]> {
    try {

        const token = getToken()

        // Construct the URL for the Vercel Blob API
        // This is a generic endpoint that should work for any Vercel Blob store
        const response = await fetch("https://blob.vercel-storage.com/list", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Blob API error:", response.status, errorText)
            throw new Error(`Blob API error: ${response.status} ${errorText}`)
        }

        const data = await response.json()

        return data.blobs.map((blob: any) => ({
            url: blob.url,
            pathname: blob.pathname,
            size: blob.size,
            uploadedAt: new Date(blob.uploadedAt),
        }))
    } catch (error) {
        console.error("Error listing blobs:", error)
        throw error
    }
}

// Upload a blob
export async function uploadBlob(file: File): Promise<BlobImage> {
    try {
        const token = getToken()

        // Step 1: Get a presigned URL for upload
        const presignedResponse = await fetch("https://blob.vercel-storage.com/presigned-upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filename: file.name,
                contentType: file.type,
                access: "public",
                addRandomSuffix: true,
            }),
        })

        if (!presignedResponse.ok) {
            const errorText = await presignedResponse.text()
            throw new Error(`Failed to get presigned URL: ${errorText}`)
        }

        const presignedData = await presignedResponse.json()

        // Step 2: Upload the file to the presigned URL
        const uploadResponse = await fetch(presignedData.uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
        })

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text()
            throw new Error(`Failed to upload file: ${errorText}`)
        }

        // Step 3: Return the blob information
        return {
            url: presignedData.url,
            pathname: presignedData.pathname,
            size: file.size,
            uploadedAt: new Date(),
        }
    } catch (error) {
        console.error("Error uploading blob:", error)
        throw error
    }
}

// Delete a blob
export async function deleteBlob(pathname: string): Promise<void> {
    try {
        const token = getToken()

        const response = await fetch("https://blob.vercel-storage.com/delete", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pathname,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to delete blob: ${errorText}`)
        }
    } catch (error) {
        console.error("Error deleting blob:", error)
        throw error
    }
}
