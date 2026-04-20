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
  typeSelectButton: {
    width: 58,
    height: 30,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  typeSelectButtonPressed: {
    backgroundColor: "#f3f3f3",
  },
  typeSelectLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  typeModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  typeModalCard: {
    width: "100%",
    maxWidth: 180,
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  typeOptionRow: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  typeOptionText: {
    fontSize: 15,
    color: "#222",
  },
  setCard: {
    marginTop: spacing.xs,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: "#f0d8b5",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  setTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  setBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  typePickerContainer: {
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  typePicker: {
    height: 50,
    width: "100%",
  },
  unitPickerContainer: {
    width: 86,
    minHeight: 48,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  unitPicker: {
    height: 50,
    width: "100%",
  },
  numberInput: {
    minWidth: 58,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  doneBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginLeft: spacing.sm,
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
