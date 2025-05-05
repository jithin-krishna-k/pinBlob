"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { MasonryGrid } from "@/components/masonry-grid"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"
import type { BlobImage } from "@/lib/blob-service"
import { getImagesAction } from "@/app/actions"

type ClientPageProps = {
  initialData: {
    success: boolean
    data?: BlobImage[]
    error?: string
  }
}

export function ClientPage({ initialData }: ClientPageProps) {
  const [images, setImages] = useState<BlobImage[]>(initialData.success && initialData.data ? initialData.data : [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialData.success ? null : initialData.error || null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const refreshImages = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getImagesAction()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch images")
      }

      setImages(result.data || [])
    } catch (err) {
      console.error("Error refreshing images:", err)
      setError(err instanceof Error ? err.message : "Failed to load images")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    refreshImages()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onUploadComplete={handleRefresh} />

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={handleRefresh} />
        ) : images.length === 0 ? (
          <EmptyState onUpload={() => setIsUploadDialogOpen(true)} />
        ) : (
          <MasonryGrid images={images} onImageDeleted={handleRefresh} />
        )}
      </main>
    </div>
  )
}
