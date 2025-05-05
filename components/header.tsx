"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UploadImage } from "@/components/upload-image"
import { ImageIcon } from "lucide-react"

type HeaderProps = {
  onUploadComplete: () => void
  showUploadButton?: boolean
  isAdmin: boolean // Add a prop to indicate if the user is an admin
  adminAvatarUrl?: string // Avatar URL for the admin
}

export function Header({ onUploadComplete, showUploadButton, isAdmin, adminAvatarUrl }: HeaderProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const handleUploadComplete = () => {
    setIsUploadOpen(false)
    onUploadComplete()
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isAdmin ? (
            <div className="flex items-center space-x-2">
              <img src={adminAvatarUrl} alt="Admin Avatar" className="h-8 w-8 rounded-full border border-gray-300" />
            </div>
          ) : <ImageIcon className="h-6 w-6 text-primary" />}

          <h1 className="text-xl font-bold">PinBlob</h1>
        </div>

        {showUploadButton && <Button onClick={() => setIsUploadOpen(true)}>Upload Image</Button>}

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload a new image</DialogTitle>
            </DialogHeader>
            <UploadImage onUploadComplete={handleUploadComplete} />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
