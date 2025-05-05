"use server"

import { revalidatePath } from "next/cache"
import { getAllImages, uploadImage, deleteImage } from "@/lib/blob-service"

export async function getImagesAction() {
    try {
        const images = await getAllImages()
        return { success: true, data: images }
    } catch (error) {
        console.error("Error in get images action:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch images"
        return { success: false, error: errorMessage }
    }
}

export async function uploadImageAction(formData: FormData) {
    try {
        const file = formData.get("file") as File

        if (!file) {
            return { success: false, error: "No file provided" }
        }

        const result = await uploadImage(file)
        revalidatePath("/")
        return { success: true, data: result }
    } catch (error) {
        console.error("Error in upload action:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to upload image"
        return { success: false, error: errorMessage }
    }
}

export async function deleteImageAction(pathname: string) {
    try {
        await deleteImage(pathname)
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error in delete action:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to delete image"
        return { success: false, error: errorMessage }
    }
}
