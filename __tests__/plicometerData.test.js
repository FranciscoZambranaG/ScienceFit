import { calculateBodyFat } from '../src/utils/plicometerData';

describe('calculateBodyFat', () => {
  test('calcula correctamente el porcentaje de grasa para hombre', () => {
    const measurements = {
      chest: 10,
      abdominal: 20,
      thigh: 15,
      triceps: 12,
      subscapular: 14,
      suprailiac: 13,
      midaxillary: 11,
    };
    const result = calculateBodyFat(measurements, 25, 'male');
    expect(result).toBeCloseTo(13.3, 0);
  });

  test('calcula correctamente el porcentaje de grasa para mujer', () => {
    const measurements = {
      triceps: 18,
      abdominal: 22,
      thigh: 20,
      suprailiac: 16,
      subscapular: 15,
      calf: 14,
      midaxillary: 13,
    };
    const result = calculateBodyFat(measurements, 25, 'female');
    expect(result).toBeCloseTo(23.2, 0);
  });
});