import { Text, TouchableOpacity } from "react-native";

export function AgeCounter({ age, setAge }) {
  function increaseAge() {
    setAge(age + 1);
  }

  return (
    <>
      <TouchableOpacity onPress={increaseAge}>
        <Text style={{ fontSize: 16, color: "blue" }}>Increase age</Text>
      </TouchableOpacity>
    </>
  );
}
