import { Exercise } from "@/src/models/Exercise";

export const EXERCISES: Exercise[] = [
  {
    id: "ex-1",
    name: "Pull-Up",
    primaryMuscleId: "back-lats",
    secondaryMuscleIds: ["biceps", "forearms"],

    equipmentIds: ["bodyweight"],
    tagIds: ["pull", "compound"],
  },
  {
    id: "ex-2",
    name: "Bench Press",
    primaryMuscleId: "chest",
    secondaryMuscleIds: ["triceps", "front-delts"],

    equipmentIds: ["barbell"],
    tagIds: ["push", "compound"],
  },
];
