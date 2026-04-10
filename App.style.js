import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  box1: {
    height: 100,
    width: 100,
    backgroundColor: "grey",
    alignSelf: "flex-start",
    //alignSelf: "stretch", // żeby zrobić box1 na całą szerokość, ale wtedy trzeba usunąć width: 100
  },
  box2: {
    height: 100,
    width: 100,
    backgroundColor: "blue",
  },
  box3: {
    height: 100,
    width: 100,
    backgroundColor: "darkorange",
    alignSelf: "flex-end",
  },
  box4: {
    height: 150,
    width: 100,
    backgroundColor: "green",
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  box5: {
    height: 100,
    width: 150,
    backgroundColor: "purple",
    zIndex: 1,
    position: "absolute",
    bottom: 25,
    left: 25,
  },
});
