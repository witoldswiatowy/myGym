import { Text, TouchableOpacity } from "react-native";
import { DisplayAge } from "../DisplayAge/DisplayAge";

export function AgeCounter({ age, setAge }) {
  function increaseAge() {
    console.log("Increasing age: ", age);
    setAge(age + 1);
  }

  return (
    <>
      <Text>{age} years old</Text>
      <TouchableOpacity onPress={increaseAge}>
        <Text>Increase age</Text>
      </TouchableOpacity>
      <DisplayAge age={age} />
    </>
  );
}
