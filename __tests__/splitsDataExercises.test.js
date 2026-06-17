import { SPLITS_DATA } from '../src/utils/splitsData';

const getAllExercises = () => {
  const exercises = [];
  Object.values(SPLITS_DATA).forEach((split) => {
    Object.values(split.days).forEach((dayExercises) => {
      exercises.push(...dayExercises);
    });
  });
  return exercises;
};

describe('SPLITS_DATA — ejercicios', () => {
  let exercises;

  beforeAll(() => {
    exercises = getAllExercises();
  });

  test('cada ejercicio tiene name, muscleGroup, sets y repsRange', () => {
    exercises.forEach((ex) => {
      expect(ex).toHaveProperty('name');
      expect(ex).toHaveProperty('muscleGroup');
      expect(ex).toHaveProperty('sets');
      expect(ex).toHaveProperty('repsRange');
    });
  });

  test('sets siempre es un número mayor que 0', () => {
    exercises.forEach((ex) => {
      expect(typeof ex.sets).toBe('number');
      expect(ex.sets).toBeGreaterThan(0);
    });
  });

  test('repsRange tiene formato válido como "6-8" o "30-60s"', () => {
    const repsRangeRegex = /^\d+-\d+s?$/;
    exercises.forEach((ex) => {
      expect(ex.repsRange).toMatch(repsRangeRegex);
    });
  });

  test('ningún ejercicio tiene nombre vacío', () => {
    exercises.forEach((ex) => {
      expect(ex.name.trim().length).toBeGreaterThan(0);
    });
  });
});
