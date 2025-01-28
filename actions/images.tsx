"use server";
import ImagesList from "@/components/images-list";
import fs from "node:fs";
import path from "node:path";
import { Text, View } from "react-native";

export interface StoredImage {
    fileName: string;
    originalFileName: string;
    width: number;
    height: number;
}

const IMAGES_JSON_PATH = path.join(".", "images.json");

export const getImages = async (): Promise<StoredImage[]> => {
    if (!fs.existsSync(IMAGES_JSON_PATH)) {
        return [];
    }
    const jsonContent = fs.readFileSync(IMAGES_JSON_PATH, "utf-8");
    return JSON.parse(jsonContent) || [];
}


export const getImagesList = async (): Promise<React.ReactNode> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const images = await getImages();
    return (
        <View>
            <Text style={{ fontSize: 24, fontWeight: '600', paddingHorizontal: 12, paddingBottom: 12 }}>Images</Text>
            <ImagesList images={images} />
        </View>
    )
}

export async function postImage({
    name: originalFileName,
    image,
    width,
    height,
}: {
    name: string;
    image: string;
    width: number;
    height: number;
}) {
    try {
        const buffer = Buffer.from(image, "base64");

        const dir = path.join(process.cwd(), "public", "images");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = originalFileName.split('.').pop() || "jpg";
        const name = `${randomString}.${fileExtension}`;

        const filePath = path.join(dir, name);
        fs.writeFileSync(filePath, buffer);

        const images: StoredImage[] = await getImages()

        images.push({
            fileName: name,
            originalFileName,
            width,
            height
        })

        fs.writeFileSync(IMAGES_JSON_PATH, JSON.stringify(images, null, 2));

        return { success: true }
    } catch (error) {
        console.error("Error saving image: ", error)
        return { success: false, error: "Failed to save image" }
    }


};