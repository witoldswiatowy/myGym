import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { DisplayAge } from "../DisplayAge/DisplayAge";

export function AgeCounter({ age }) {
  const [ag, setAg] = useState(age);

  function increaseAge() {
    console.log("Increasing age: ", ag);
    setAg(ag + 1);
  }

  return (
    <>
      <Text>{ag} years old</Text>
      <TouchableOpacity onPress={increaseAge}>
        <Text>Increase age</Text>
      </TouchableOpacity>
      <DisplayAge age={ag} />
    </>
  );
}
