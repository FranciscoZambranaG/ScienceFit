import { calculateBodyComposition } from '../src/utils/plicometerData';

describe('calculateBodyComposition', () => {
  test('calcula correctamente masa grasa y masa magra', () => {
    const result = calculateBodyComposition(80, 20);
    expect(result.fatMass).toBe('16.00');
    expect(result.leanMass).toBe('64.00');
    expect(result.bodyFatPercentage).toBe('20.0');
  });

  test('retorna valores con formato de 2 decimales', () => {
    const result = calculateBodyComposition(75, 15);
    expect(result.fatMass).toBe('11.25');
    expect(result.leanMass).toBe('63.75');
    expect(result.bodyFatPercentage).toBe('15.0');
  });
});