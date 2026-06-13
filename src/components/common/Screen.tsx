import { styles } from "@/app/app.style";
import { spacing } from "@/src/theme/spacing";
import { ReactNode } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
  title?: string;
};

export function Screen({ children, title }: ScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        padding: spacing.md,
      }}
    >
      {title && (
        <>
          <View
            style={[styles.headerLogoContainer, { paddingTop: insets.top }]}
          >
            <Text style={styles.headerLogo}>myGym</Text>
          </View>
          <Text style={styles.headerTitle}>{title}</Text>
        </>
      )}
      {children}
    </View>
  );
}
