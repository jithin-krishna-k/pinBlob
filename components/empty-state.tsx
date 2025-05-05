"use client"

import { ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  onUpload: () => void
}

export function EmptyState({ onUpload }: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16">
      <div className="p-4 bg-primary/10 rounded-full">
        <ImageIcon className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-4 text-xl font-medium">No images yet</h3>
      <p className="mt-2 text-muted-foreground text-center max-w-md">
        Upload your first image to get started with your Pinterest-style gallery
      </p>
      <Button onClick={onUpload} className="mt-6">
        Upload an Image
      </Button>
    </div>
  )
}
