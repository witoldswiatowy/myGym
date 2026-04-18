import { spacing } from "@/src/theme/spacing";
import { StyleSheet } from "react-native";

export const localStyles = StyleSheet.create({
  backButton: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#333",
    fontSize: 14,
  },
  note: {
    textAlign: "center",
    color: "#555",
    marginTop: spacing.xs,
  },
  meta: {
    textAlign: "center",
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  exerciseCard: {
    backgroundColor: "#fff8ee",
    borderRadius: 8,
    padding: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: "orange",
  },
  exerciseName: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: 2,
  },
  setType: {
    width: 20,
    fontWeight: "bold",
    color: "#888",
  },
  setText: {
    fontSize: 14,
  },
});
