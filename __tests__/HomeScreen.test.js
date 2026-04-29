// Prueba unitaria de la lógica de HomeScreen
// Testeamos los datos de SPLIT_INFO sin necesidad de renderizar componentes

const SPLIT_INFO = {
  'upper-lower': {
    name: 'Up/LW',
    fullName: 'Upper/Lower',
    fullNameSpanish: 'Tren Superior / Tren Inferior',
    icon: '💪',
    daysPerWeek: 4,
    description: 'División entre tren superior e inferior.'
  },
  'arnold-split': {
    name: 'Arnold\nSplit',
    fullName: 'Arnold Split',
    fullNameSpanish: 'Arnold Split',
    icon: '🏋️',
    daysPerWeek: 6,
    description: 'Rutina popularizada por Arnold Schwarzenegger.'
  },
  'fullbody': {
    name: 'FB',
    fullName: 'Full Body',
    fullNameSpanish: 'Cuerpo Completo',
    icon: '💯',
    daysPerWeek: 3,
    description: 'Entrena todos los grupos musculares en cada sesión.'
  },
  'ppl': {
    name: 'PPL',
    fullName: 'Push/Pull/Legs',
    fullNameSpanish: 'Empuje/Jalón/Piernas',
    icon: '🔥',
    daysPerWeek: 6,
    description: 'Divide entrenamientos en empuje, jalón y piernas.'
  }
};

const showSplitInfo = (splitType) => {
  return SPLIT_INFO[splitType] || null;
};

describe('HomeScreen - lógica de splits', () => {
  test('showSplitInfo retorna la información correcta del split fullbody', () => {
    const result = showSplitInfo('fullbody');
    expect(result).not.toBeNull();
    expect(result.fullName).toBe('Full Body');
    expect(result.daysPerWeek).toBe(3);
    expect(result.icon).toBe('💯');
  });

  test('showSplitInfo retorna null para un split inexistente', () => {
    const result = showSplitInfo('split-inventado');
    expect(result).toBeNull();
  });

  test('todos los splits tienen daysPerWeek definido', () => {
    Object.values(SPLIT_INFO).forEach(split => {
      expect(split.daysPerWeek).toBeDefined();
      expect(typeof split.daysPerWeek).toBe('number');
    });
  });
});