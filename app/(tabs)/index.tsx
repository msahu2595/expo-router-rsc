import { getImagesList } from "@/actions/images";
import Images from "@/components/images";
import { Suspense } from "react";
import { Text } from "react-native";

export default function Index() {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <Images>{getImagesList()}</Images>
    </Suspense>
  )
}