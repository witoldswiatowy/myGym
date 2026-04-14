import { StyleSheet } from "react-native";

export const localStyles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
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
});
