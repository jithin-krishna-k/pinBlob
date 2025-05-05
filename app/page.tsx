'use client'

import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { Header } from "@/components/header"
import { MasonryGrid } from "@/components/masonry-grid"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"
import type { BlobImage } from "@/lib/blob-service"

export default function Home() {
  const [images, setImages] = useState<BlobImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [tokenDiagnostic, setTokenDiagnostic] = useState<any>(null)
  const [diagnosticLoading, setDiagnosticLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if admin from cookie
  useEffect(() => {
    const admin = Cookies.get("admin-auth")

    setIsAdmin(admin === "true")
  }, [])

  // Run token diagnostic
  useEffect(() => {
    async function runDiagnostic() {
      try {
        setDiagnosticLoading(true)
        const response = await fetch("/api/verify-token")
        const data = await response.json()
        setTokenDiagnostic(data)
      } catch (error) {
        console.error("Error running token diagnostic:", error)
      } finally {
        setDiagnosticLoading(false)
      }
    }

    runDiagnostic()
  }, [])

  // Fetch images
  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/images")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `API error: ${response.status}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch images")
        }

        const processedImages = result.data.map((img: any) => ({
          ...img,
          uploadedAt: new Date(img.uploadedAt),
        }))

        setImages(processedImages)
      } catch (error) {
        console.error("Error fetching images:", error)
        setError(error instanceof Error ? error.message : "Failed to load images")
      } finally {
        setLoading(false)
      }
    }

    if (tokenDiagnostic && (tokenDiagnostic.verified || tokenDiagnostic.tokenInfo?.hadQuotes)) {
      fetchImages()
    } else if (tokenDiagnostic && !tokenDiagnostic.verified) {
      setLoading(false)
      setError("BLOB_READ_WRITE_TOKEN is not valid or has incorrect permissions")
    }
  }, [tokenDiagnostic])

  const handleRefresh = async () => {
    try {
      setDiagnosticLoading(true)
      const response = await fetch("/api/verify-token")
      const data = await response.json()
      setTokenDiagnostic(data)
      setDiagnosticLoading(false)

      if (data.verified) {
        try {
          setLoading(true)
          setError(null)

          const imagesResponse = await fetch("/api/images")

          if (!imagesResponse.ok) {
            const errorData = await imagesResponse.json()
            throw new Error(errorData.error || `API error: ${imagesResponse.status}`)
          }

          const result = await imagesResponse.json()
          if (!result.success) {
            throw new Error(result.error || "Failed to fetch images")
          }

          const processedImages = result.data.map((img: any) => ({
            ...img,
            uploadedAt: new Date(img.uploadedAt),
          }))

          setImages(processedImages)
        } catch (error) {
          console.error("Error fetching images:", error)
          setError(error instanceof Error ? error.message : "Failed to load images")
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
        setError("BLOB_READ_WRITE_TOKEN is not valid or has incorrect permissions")
      }
    } catch (error) {
      console.error("Error running token diagnostic:", error)
      setDiagnosticLoading(false)
      setLoading(false)
      setError("Failed to verify token")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onUploadComplete={handleRefresh} showUploadButton={isAdmin} isAdmin={true}
        adminAvatarUrl="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?t=st=1746470312~exp=1746473912~hmac=ac808727f3093dd34447ff5ace090df2ed8ecf765d773bfcf08ecb8e093647ae&w=740" />
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState
            message={error}
            details={errorDetails}
            onRetry={handleRefresh}
            tokenDiagnostic={tokenDiagnostic}
          />
        ) : images.length === 0 ? (
          <EmptyState onUpload={() => { }} />
        ) : (
          <MasonryGrid images={images} onImageDeleted={handleRefresh} />
        )}
      </main>
    </div>
  )
}
