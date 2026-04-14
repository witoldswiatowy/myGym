import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import ExerciseTableHeader from "@/src/components/exercises/exercise-table-header";
import ExerciseTableRow from "@/src/components/exercises/exercise-table-row";
import { localStyles } from "@/src/components/exercises/exercises.style";
import { EQUIPMENT } from "@/src/data/equipment.data";
import { MUSCLES } from "@/src/data/muscles.data";
import { TAGS } from "@/src/data/tags.data";
import { Exercise } from "@/src/models/Exercise";
import { ExerciseRepository } from "@/src/repositories/exercise.repository";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExercisesScreen() {
  const insets = useSafeAreaInsets();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    ExerciseRepository.getAll().then(setExercises);
  }, []);

  const muscleNameById = useMemo(
    () => Object.fromEntries(MUSCLES.map((m) => [m.id, m.name])),
    [],
  );

  const equipmentNameById = useMemo(
    () => Object.fromEntries(EQUIPMENT.map((e) => [e.id, e.name])),
    [],
  );

  const tagNameById = useMemo(
    () => Object.fromEntries(TAGS.map((t) => [t.id, t.name])),
    [],
  );

  return (
    <Screen>
      <View style={[styles.headerLogoContainer, { paddingTop: insets.top }]}>
        <Text style={styles.headerLogo}>myGym</Text>
      </View>
      <Text style={styles.headerTitle}>Exercise Library</Text>

      <View style={localStyles.content}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <ExerciseTableHeader />
            <FlatList
              data={exercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ExerciseTableRow
                  exercise={item}
                  muscleNameById={muscleNameById}
                  equipmentNameById={equipmentNameById}
                  tagNameById={tagNameById}
                />
              )}
            />
          </View>
        </ScrollView>

        <Pressable>
          <Text>+ Add exercise</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
