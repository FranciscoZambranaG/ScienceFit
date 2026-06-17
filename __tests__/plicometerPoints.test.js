import { PLICOMETER_POINTS } from '../src/utils/plicometerData';

describe('PLICOMETER_POINTS — estructura de puntos de medición', () => {
  test('contiene las keys male y female', () => {
    expect(PLICOMETER_POINTS).toHaveProperty('male');
    expect(PLICOMETER_POINTS).toHaveProperty('female');
  });

  test('cada género tiene exactamente 7 pliegues', () => {
    expect(PLICOMETER_POINTS.male).toHaveLength(7);
    expect(PLICOMETER_POINTS.female).toHaveLength(7);
  });

  test('cada punto tiene id, name, description e instructions no vacío', () => {
    ['male', 'female'].forEach((gender) => {
      PLICOMETER_POINTS[gender].forEach((point) => {
        expect(point).toHaveProperty('id');
        expect(point).toHaveProperty('name');
        expect(point).toHaveProperty('description');
        expect(Array.isArray(point.instructions)).toBe(true);
        expect(point.instructions.length).toBeGreaterThan(0);
      });
    });
  });

  test('masculino contiene el pliegue chest', () => {
    const ids = PLICOMETER_POINTS.male.map((p) => p.id);
    expect(ids).toContain('chest');
  });

  test('femenino contiene calf pero NO chest', () => {
    const ids = PLICOMETER_POINTS.female.map((p) => p.id);
    expect(ids).toContain('calf');
    expect(ids).not.toContain('chest');
  });
});
