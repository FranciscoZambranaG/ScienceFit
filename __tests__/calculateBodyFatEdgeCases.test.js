import { calculateBodyFat } from '../src/utils/plicometerData';

const MALE_MEASUREMENTS = {
  chest: 10, abdominal: 20, thigh: 15, triceps: 12,
  subscapular: 14, suprailiac: 13, midaxillary: 11,
};

const FEMALE_MEASUREMENTS = {
  triceps: 18, abdominal: 22, thigh: 20, suprailiac: 16,
  subscapular: 15, calf: 14, midaxillary: 13,
};

describe('calculateBodyFat — casos extremos', () => {
  test('resultado masculino es un número válido (no NaN)', () => {
    const result = calculateBodyFat(MALE_MEASUREMENTS, 25, 'male');
    expect(typeof result).toBe('number');
    expect(isNaN(result)).toBe(false);
  });

  test('resultado femenino es un número válido (no NaN)', () => {
    const result = calculateBodyFat(FEMALE_MEASUREMENTS, 25, 'female');
    expect(typeof result).toBe('number');
    expect(isNaN(result)).toBe(false);
  });

  test('resultado masculino está entre 3% y 50%', () => {
    const result = calculateBodyFat(MALE_MEASUREMENTS, 25, 'male');
    expect(result).toBeGreaterThan(3);
    expect(result).toBeLessThan(50);
  });

  test('resultado femenino está entre 8% y 60%', () => {
    const result = calculateBodyFat(FEMALE_MEASUREMENTS, 25, 'female');
    expect(result).toBeGreaterThan(8);
    expect(result).toBeLessThan(60);
  });

  test('a mayor suma de pliegues, mayor porcentaje de grasa (masculino)', () => {
    const lowMeasurements = {
      chest: 5, abdominal: 5, thigh: 5, triceps: 5,
      subscapular: 5, suprailiac: 5, midaxillary: 5,
    };
    const highMeasurements = {
      chest: 25, abdominal: 25, thigh: 25, triceps: 25,
      subscapular: 25, suprailiac: 25, midaxillary: 25,
    };
    const lowFat = calculateBodyFat(lowMeasurements, 30, 'male');
    const highFat = calculateBodyFat(highMeasurements, 30, 'male');
    expect(highFat).toBeGreaterThan(lowFat);
  });

  test('a mayor edad, mayor porcentaje de grasa calculado (masculino)', () => {
    const fatYoung = calculateBodyFat(MALE_MEASUREMENTS, 20, 'male');
    const fatOlder = calculateBodyFat(MALE_MEASUREMENTS, 50, 'male');
    expect(fatOlder).toBeGreaterThan(fatYoung);
  });
});
