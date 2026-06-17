import { calculateBodyComposition } from '../src/utils/plicometerData';

describe('calculateBodyComposition — validaciones adicionales', () => {
  test('fatMass + leanMass suma el peso total', () => {
    const result = calculateBodyComposition(80, 20);
    const sum = parseFloat(result.fatMass) + parseFloat(result.leanMass);
    expect(sum).toBeCloseTo(80, 10);
  });

  test('con 0% grasa, leanMass es igual al peso total', () => {
    const result = calculateBodyComposition(70, 0);
    expect(parseFloat(result.leanMass)).toBe(70);
    expect(parseFloat(result.fatMass)).toBe(0);
  });

  test('con 100% grasa, leanMass es 0', () => {
    const result = calculateBodyComposition(70, 100);
    expect(parseFloat(result.leanMass)).toBe(0);
    expect(parseFloat(result.fatMass)).toBe(70);
  });

  test('bodyFatPercentage tiene exactamente 1 decimal', () => {
    const result = calculateBodyComposition(80, 20);
    expect(result.bodyFatPercentage).toMatch(/^\d+\.\d{1}$/);
  });

  test('fatMass tiene exactamente 2 decimales', () => {
    const result = calculateBodyComposition(80, 20);
    expect(result.fatMass).toMatch(/^\d+\.\d{2}$/);
  });

  test('leanMass tiene exactamente 2 decimales', () => {
    const result = calculateBodyComposition(80, 20);
    expect(result.leanMass).toMatch(/^\d+\.\d{2}$/);
  });
});
