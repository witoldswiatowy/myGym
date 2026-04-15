import { StyleSheet } from "react-native";

export const localStyles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  addButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1570EF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  headerRow: {
    backgroundColor: "#F2F4F7",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E7EC",
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 13,
    color: "#1D2939",
  },
  headerText: {
    fontWeight: "700",
    color: "#101828",
  },
  colName: {
    width: 170,
  },
  colPrimary: {
    width: 150,
  },
  colSecondary: {
    width: 220,
  },
  colEquipment: {
    width: 180,
  },
  colTags: {
    width: 160,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(16, 24, 40, 0.4)",
  },
  modalSheet: {
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#101828",
  },
  modalCloseText: {
    color: "#475467",
    fontSize: 14,
    fontWeight: "600",
  },
  formContent: {
    gap: 14,
    paddingBottom: 8,
  },
  formFieldGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#101828",
    fontSize: 14,
  },
  formOptionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  formChip: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
  },
  formChipSelected: {
    backgroundColor: "#ECFDF3",
    borderColor: "#12B76A",
  },
  formChipText: {
    color: "#344054",
    fontSize: 13,
  },
  formChipTextSelected: {
    color: "#027A48",
    fontWeight: "600",
  },
  formButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 6,
  },
  formCancelButton: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  formCancelButtonText: {
    color: "#344054",
    fontWeight: "600",
  },
  formSaveButton: {
    backgroundColor: "#1570EF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  formSaveButtonDisabled: {
    backgroundColor: "#98A2B3",
  },
  formSaveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
