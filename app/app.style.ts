import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  headerLogoContainer: {
    marginHorizontal: -16,
    marginTop: -16,
    minHeight: 84,
    paddingBottom: 8,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "orange",
  },
  headerLogo: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 32,
    marginTop: 8,
    backgroundColor: "#ffc457",
  },
  headerElement: {
    backgroundColor: "orange",
  },
  logoImage: {
    width: "85%",
    maxWidth: 340,
    height: 300,
  },
  centerLogoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImageSmall: {
    width: 40,
    height: 40,
    marginTop: 4,
  },
});
