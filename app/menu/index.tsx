import { Link } from "expo-router";
import { Pressable } from "react-native";
import { Screen } from "../../src/components/common/Screen";

export default function MenuScreen() {
  return (
    <Screen>
      <Link href="/exercises" asChild>
        <Pressable
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
          }}
        ></Pressable>
      </Link>
    </Screen>
  );
}
