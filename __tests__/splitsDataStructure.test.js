import { SPLITS_DATA } from '../src/utils/splitsData';

describe('SPLITS_DATA — estructura general', () => {
  test('contiene los 4 splits esperados', () => {
    expect(SPLITS_DATA).toHaveProperty('upper-lower');
    expect(SPLITS_DATA).toHaveProperty('arnold-split');
    expect(SPLITS_DATA).toHaveProperty('ppl');
    expect(SPLITS_DATA).toHaveProperty('fullbody');
  });

  test('cada split tiene name, description, icon y days', () => {
    Object.values(SPLITS_DATA).forEach((split) => {
      expect(split).toHaveProperty('name');
      expect(split).toHaveProperty('description');
      expect(split).toHaveProperty('icon');
      expect(split).toHaveProperty('days');
      expect(typeof split.days).toBe('object');
    });
  });

  test('upper-lower tiene 4 días', () => {
    const days = Object.keys(SPLITS_DATA['upper-lower'].days);
    expect(days).toHaveLength(4);
  });

  test('ppl tiene 6 días', () => {
    const days = Object.keys(SPLITS_DATA['ppl'].days);
    expect(days).toHaveLength(6);
  });

  test('fullbody tiene 3 días', () => {
    const days = Object.keys(SPLITS_DATA['fullbody'].days);
    expect(days).toHaveLength(3);
  });
});
