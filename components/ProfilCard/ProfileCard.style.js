import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    color: "gray",
  },
  info: {
    padding: 10,
    justifyContent: "center",
  },
  avatarContainer: {
    padding: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: "50%",
  },
  links: {},
});
