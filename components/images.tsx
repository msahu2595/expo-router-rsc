"use client"

import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Button } from "react-native";

import { readAsStringAsync, EncodingType } from "expo-file-system";
import { launchImageLibraryAsync } from "expo-image-picker";
import { postImage, getImagesList } from "@/actions/images";

function useImages() {

    const [images, setImages] = useState<React.ReactNode>();

    useEffect(() => {
        getImagesList().then(setImages);
    }, [])

    const onPickImage = useCallback(async () => {
        try {
            const result = await launchImageLibraryAsync({
                mediaTypes: ["images"],
                quality: 1
            });

            if (result?.assets?.[0]?.uri) {
                const image = await readAsStringAsync(result?.assets?.[0]?.uri, {
                    encoding: EncodingType.Base64
                })

                await postImage({
                    image,
                    name: result?.assets?.[0]?.fileName || "",
                    width: result?.assets?.[0]?.width || 0,
                    height: result?.assets?.[0]?.height || 0,
                });

                setImages(await getImagesList())
            }
        } catch (error) { }
    }, [])

    return {
        images,
        onPickImage,
    }
}

export default function Images({ children }: { children: React.ReactNode }) {
    const { images, onPickImage } = useImages();

    return (
        <View style={styles.container}>
            {images || children}
            <Button title="Image" onPress={onPickImage} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 80,
        flex: 1
    }
})