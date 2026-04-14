import { Exercise } from "@/src/models/Exercise";

export const EXERCISES: Exercise[] = [
  // ======================
  // FOREARMS / BICEPS
  // ======================
  {
    id: "db_biceps_curl_supinated",
    name: "biceps stojąc hantlami (z supinacją)",
    nameEn: "Dumbbell Biceps Curl (Supinated Grip)",
    primaryMuscleId: "biceps",
    secondaryMuscleIds: ["brachialis", "forearms"],
    equipmentIds: ["dumbbell"],
    tagIds: ["pull", "isolation"],
  },
  {
    id: "hammer_curl",
    name: "biceps stojąc hantlami (młotki)",
    nameEn: "Hammer Curl",
    primaryMuscleId: "brachialis",
    secondaryMuscleIds: ["biceps", "forearms"],
    equipmentIds: ["dumbbell"],
    tagIds: ["pull", "isolation"],
  },
  {
    id: "bb_biceps_curl",
    name: "biceps stojąc sztangą",
    nameEn: "Barbell Biceps Curl",
    primaryMuscleId: "biceps",
    secondaryMuscleIds: ["brachialis", "forearms"],
    equipmentIds: ["barbell"],
    tagIds: ["pull", "isolation"],
  },
  {
    id: "incline_db_curl",
    name: "biceps na ławce dodatniej na plecach (z supinacją)",
    nameEn: "Incline Dumbbell Curl",
    primaryMuscleId: "biceps",
    secondaryMuscleIds: ["brachialis"],
    equipmentIds: ["dumbbell"],
    tagIds: ["pull", "isolation"],
  },
  {
    id: "incline_hammer_curl",
    name: "biceps na ławce dodatniej na plecach (młotki)",
    nameEn: "Incline Hammer Curl",
    primaryMuscleId: "brachialis",
    secondaryMuscleIds: ["biceps"],
    equipmentIds: ["dumbbell"],
    tagIds: ["pull", "isolation"],
  },
  {
    id: "preacher_barbell_curl",
    name: "biceps na modlitewniku sztangą",
    nameEn: "Barbell Preacher Curl",
    primaryMuscleId: "biceps",
    secondaryMuscleIds: ["brachialis"],
    equipmentIds: ["barbell"],
    tagIds: ["pull", "isolation"],
  },
  {
    id: "cable_biceps_curl",
    name: "biceps na wyciągu",
    nameEn: "Cable Biceps Curl",
    primaryMuscleId: "biceps",
    secondaryMuscleIds: ["brachialis", "forearms"],
    equipmentIds: ["cable"],
    tagIds: ["pull", "isolation"],
  },

  // ======================
  // TRICEPS
  // ======================
  {
    id: "french_press",
    name: "wyciskanie francuskie",
    nameEn: "French Press / Skull Crushers",
    primaryMuscleId: "triceps",
    secondaryMuscleIds: ["forearms"],
    equipmentIds: ["barbell"],
    tagIds: ["push", "isolation"],
  },
  {
    id: "dips",
    name: "dipy",
    nameEn: "Dips",
    primaryMuscleId: "triceps",
    secondaryMuscleIds: ["chest", "front-delts"],
    equipmentIds: ["bodyweight"],
    tagIds: ["push", "compound"],
  },
  {
    id: "triceps_pushdown",
    name: "triceps na wyciągu",
    nameEn: "Cable Triceps Pushdown",
    primaryMuscleId: "triceps",
    secondaryMuscleIds: ["forearms"],
    equipmentIds: ["cable"],
    tagIds: ["push", "isolation"],
  },

  // ======================
  // SHOULDERS
  // ======================
  {
    id: "overhead_press",
    name: "wyciskanie żołnierskie (szeroko)",
    nameEn: "Overhead Press",
    primaryMuscleId: "front-delts",
    secondaryMuscleIds: ["triceps", "chest"],
    equipmentIds: ["barbell"],
    tagIds: ["push", "compound"],
  },
  {
    id: "db_front_raise",
    name: "wznosy hantli przodem",
    nameEn: "Dumbbell Front Raise",
    primaryMuscleId: "front-delts",
    secondaryMuscleIds: [],
    equipmentIds: ["dumbbell"],
    tagIds: ["isolation"],
  },
  {
    id: "db_lateral_raise",
    name: "wznosy hantli bokiem",
    nameEn: "Dumbbell Lateral Raise",
    primaryMuscleId: "side-delts",
    secondaryMuscleIds: [],
    equipmentIds: ["dumbbell"],
    tagIds: ["isolation"],
  },
  {
    id: "rear_delt_fly",
    name: "odwrotne rozpiętki",
    nameEn: "Rear Delt Fly",
    primaryMuscleId: "rear-delts",
    secondaryMuscleIds: ["upper-back"],
    equipmentIds: ["dumbbell"],
    tagIds: ["isolation"],
  },

  // ======================
  // CHEST
  // ======================
  {
    id: "bench_press",
    name: "wyciskanie sztangi na ławce prostej",
    nameEn: "Barbell Bench Press",
    primaryMuscleId: "chest",
    secondaryMuscleIds: ["triceps", "front-delts"],
    equipmentIds: ["barbell"],
    tagIds: ["push", "compound"],
  },
  {
    id: "incline_db_press",
    name: "wyciskanie hantli na ławce dodatniej",
    nameEn: "Incline Dumbbell Press",
    primaryMuscleId: "chest-upper",
    secondaryMuscleIds: ["triceps", "front-delts"],
    equipmentIds: ["dumbbell"],
    tagIds: ["push", "compound"],
  },

  // ======================
  // BACK
  // ======================
  {
    id: "pull_up",
    name: "podciąganie",
    nameEn: "Pull-Up",
    primaryMuscleId: "back-lats",
    secondaryMuscleIds: ["biceps", "forearms"],
    equipmentIds: ["bodyweight"],
    tagIds: ["pull", "compound"],
  },
  {
    id: "db_row",
    name: "wiosłowanie hantlem w oparciu",
    nameEn: "One Arm Dumbbell Row",
    primaryMuscleId: "back-lats",
    secondaryMuscleIds: ["upper-back", "biceps"],
    equipmentIds: ["dumbbell"],
    tagIds: ["pull", "compound"],
  },

  // ======================
  // LOWER BODY
  // ======================
  {
    id: "squat",
    name: "przysiad",
    nameEn: "Squat",
    primaryMuscleId: "quadriceps",
    secondaryMuscleIds: ["glutes", "hamstrings"],
    equipmentIds: ["barbell"],
    tagIds: ["compound"],
  },
  {
    id: "deadlift",
    name: "martwy ciąg",
    nameEn: "Deadlift",
    primaryMuscleId: "hamstrings",
    secondaryMuscleIds: ["glutes", "lower-back"],
    equipmentIds: ["barbell"],
    tagIds: ["compound"],
  },
  {
    id: "hip_thrust",
    name: "hip thrusty",
    nameEn: "Hip Thrust",
    primaryMuscleId: "glutes",
    secondaryMuscleIds: ["hamstrings"],
    equipmentIds: ["barbell"],
    tagIds: ["compound"],
  },

  // ======================
  // ABS
  // ======================
  {
    id: "leg_raises",
    name: "unoszenie nóg",
    nameEn: "Leg Raises",
    primaryMuscleId: "abs",
    secondaryMuscleIds: ["hip-flexors"],
    equipmentIds: ["bodyweight"],
    tagIds: ["isolation"],
  },
];
