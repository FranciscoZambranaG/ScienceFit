const PLANS = [
  { id: 'free', name: 'Free', price: 0, features: ['IMC básico', 'Splits predefinidos'] },
  { id: 'max', name: 'MAX', price: 29.99, features: ['Todo Free', 'IA rutinas', 'Seguimiento'] },
  { id: 'max_plicometro', name: 'MAX+Plicómetro', price: 59.99, features: ['Todo MAX', 'Plicómetro bluetooth', 'Composición corporal'] },
];

describe('Planes de suscripción', () => {
  test('hay exactamente 3 planes', () => {
    expect(PLANS).toHaveLength(3);
  });

  test('el plan Free tiene precio 0', () => {
    const free = PLANS.find((p) => p.id === 'free');
    expect(free.price).toBe(0);
  });

  test('todos los planes de pago tienen precio mayor a 0', () => {
    const paidPlans = PLANS.filter((p) => p.id !== 'free');
    paidPlans.forEach((plan) => {
      expect(plan.price).toBeGreaterThan(0);
    });
  });

  test('cada plan tiene id, name, price y features no vacío', () => {
    PLANS.forEach((plan) => {
      expect(plan).toHaveProperty('id');
      expect(plan).toHaveProperty('name');
      expect(plan).toHaveProperty('price');
      expect(Array.isArray(plan.features)).toBe(true);
      expect(plan.features.length).toBeGreaterThan(0);
    });
  });

  test('el plan MAX+Plicómetro es el más caro', () => {
    const maxPrice = Math.max(...PLANS.map((p) => p.price));
    const mostExpensive = PLANS.find((p) => p.price === maxPrice);
    expect(mostExpensive.id).toBe('max_plicometro');
  });
});
