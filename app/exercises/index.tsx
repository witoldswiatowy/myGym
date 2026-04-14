import { Screen } from "@/src/components/common/Screen";
import { MUSCLES } from "@/src/data/muscles.data";
import { Exercise } from "@/src/models/Exercise";
import { ExerciseRepository } from "@/src/repositories/exercise.repository";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../app.style";

export default function ExercisesScreen() {
  const insets = useSafeAreaInsets();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    ExerciseRepository.getAll().then(setExercises);
  }, []);

  function getMuscleName(muscleId: string) {
    const muscle = MUSCLES.find((m) => m.id === muscleId);
    return muscle ? muscle.name : "Unknown Muscle";
  }

  return (
    <Screen>
      <View style={[styles.headerLogoContainer, { paddingTop: insets.top }]}>
        <Text style={styles.headerLogo}>myGym</Text>
      </View>
      <Text style={styles.headerTitle}>Exercise Library</Text>

      <View style={{ flex: 1, padding: 16 }}>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={{ paddingVertical: 8 }}>
              {item.name} - {getMuscleName(item.primaryMuscleId)}
            </Text>
          )}
        />

        <Pressable>
          <Text>+ Add exercise</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
