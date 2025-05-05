"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Trash2, X } from "lucide-react"
import type { BlobImage } from "@/lib/blob-service"
import { log } from "node:console"

type MasonryGridProps = {
  images: BlobImage[]
  onImageDeleted: () => void
}

export function MasonryGrid({ images, onImageDeleted }: MasonryGridProps) {
  const [columns, setColumns] = useState(4)
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<BlobImage | null>(null)
  const [openMenuImage, setOpenMenuImage] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setColumns(1)
      } else if (window.innerWidth < 768) {
        setColumns(2)
      } else if (window.innerWidth < 1024) {
        setColumns(3)
      } else {
        setColumns(4)
      }
    }

    updateColumns()
    window.addEventListener("resize", updateColumns)
    return () => window.removeEventListener("resize", updateColumns)
  }, [])

  const distributeImages = () => {
    const columnArrays: BlobImage[][] = Array.from({ length: columns }, () => [])
    const sortedImages = [...images].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
    sortedImages.forEach((image, index) => {
      const columnIndex = index % columns
      columnArrays[columnIndex].push(image)
    })
    return columnArrays
  }

  const handleDelete = async (pathname: string) => {
    setIsDeleting(pathname)
    try {
      const response = await fetch("/api/images/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname }),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error || "Failed to delete image")
      onImageDeleted()
    } catch (error) {
      console.error("Error deleting image:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  const columnArrays = distributeImages()

  return (
    <>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {columnArrays.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.map((image) => (
              <div
                key={image.pathname}
                onMouseEnter={() => setHoveredImage(image.pathname)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <div
                  className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.pathname.split("/").pop() || "Image"}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                  {hoveredImage === image.pathname && (
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuImage((prev) => (prev === image.pathname ? null : image.pathname))
                        }}
                        className="p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-80"
                      >
                        &#x22EE; {/* Vertical Ellipsis */}
                      </button>

                      {openMenuImage === image.pathname && (
                        <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-20 w-32 text-sm overflow-hidden">
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedImage(image)
                              setOpenMenuImage(null)
                            }}
                          >
                            View
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenMenuImage(null)
                              handleDelete(image.pathname)
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
                <div
                  className="text-sm text-center text-gray-700 mt-2 px-2 truncate"
                  title={image.pathname.split("/").pop()}
                >
                  {image.pathname.split("/").pop()}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4">
          <div className="relative bg-white rounded-lg overflow-hidden max-w-full w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] max-h-[90vh] shadow-xl">

            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 z-50 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
            >
              ✕
            </button>

            {/* 3-dot Menu */}
            <div className="absolute  top-2 left-2 z-50">
              <button
                onClick={() => setShowDropdown(prev => !prev)}
                className="p-2 rounded-full hover: bg-gray-700 text-white"
              >
                ⋯
              </button>

              {showDropdown && (
                <div className="mt-2 bg-white shadow-md rounded-md py-1 text-sm absolute left-0 top-8 z-50 w-36">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={async () => {
                      try {
                        const response = await fetch(selectedImage.url);  // Fetch the image from the URL
                        const blob = await response.blob();  // Convert the response to a Blob object
                        const url = window.URL.createObjectURL(blob);  // Create a temporary URL for the Blob

                        const link = document.createElement('a');  // Create an anchor element
                        link.href = url;  // Set the href to the Blob URL

                        // Set the filename. If no filename is found, use a default one.
                        const filename = selectedImage.url.split('/').pop() || 'default-image.jpg';
                        link.download = filename;  // Set the filename (from URL or default)

                        link.click();

                        // Clean up
                        window.URL.revokeObjectURL(url);
                      } catch (err: any) {
                        alert('Error downloading image: ' + err.message);
                      }
                    }}
                  >
                    Download Image
                  </button>

                  {/* Copy URL */}
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedImage.url)
                      setShowDropdown(false)
                      alert("Image URL copied!")
                    }}
                  >
                    Copy URL
                  </button>

                  {/* Share */}
                  {/* <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={async () => {
                      try {
                        await navigator.share({
                          title: "Check this image",
                          url: selectedImage.url,
                        })
                      } catch (err) {
                        alert("Sharing not supported or canceled.")
                      }
                      setShowDropdown(false)
                    }}
                  >
                    Share
                  </button> */}

                  {/* Delete */}
                  <button
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    onClick={() => {
                      setShowDropdown(false)
                      handleDelete(selectedImage.pathname)
                      setSelectedImage(null)
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Image */}
            <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] relative">
              <Image
                src={selectedImage.url}
                alt={selectedImage.pathname.split("/").pop() || "Image"}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Image Name */}
            <div className="p-4 text-center text-sm text-gray-700 break-words">
              {selectedImage.pathname.split("/").pop()}
            </div>
          </div>
        </div>
      )}


    </>
  )
}
