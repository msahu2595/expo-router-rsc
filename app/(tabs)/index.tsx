"use client";
import { useCallback } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import { readAsStringAsync, EncodingType } from "expo-file-system";
import { launchImageLibraryAsync } from "expo-image-picker";
import { postImage } from "@/actions/images";

function useImages() {
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
      }
    } catch (error) { }
  }, [])

  return {
    onPickImage,
  }
}

export default function Images() {
  const { onPickImage } = useImages();

  return (
    <View style={styles.container}>
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