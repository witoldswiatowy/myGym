import { ReactNode } from "react";
import { View } from "react-native";
import { spacing } from "../../theme/spacing";

type ScreenProps = {
  children: ReactNode;
};

export function Screen({ children }: ScreenProps) {
  return (
    <View
      style={{
        flex: 1,
        padding: spacing.md,
      }}
    >
      {children}
    </View>
  );
}
