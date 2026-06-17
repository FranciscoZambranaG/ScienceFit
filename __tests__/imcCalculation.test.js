const calcularIMC = (peso, alturaCm) => peso / Math.pow(alturaCm / 100, 2);

const clasificarIMC = (imc) => {
  if (imc < 18.5) return 'Bajo peso';
  if (imc < 25) return 'Normal';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidad';
};

describe('Cálculo de IMC', () => {
  test('70kg y 175cm da aproximadamente 22.86', () => {
    const imc = calcularIMC(70, 175);
    expect(imc.toFixed(2)).toBe('22.86');
  });

  test('clasificación Bajo peso para IMC < 18.5', () => {
    expect(clasificarIMC(17)).toBe('Bajo peso');
    expect(clasificarIMC(18.4)).toBe('Bajo peso');
  });

  test('clasificación Normal para IMC entre 18.5 y 24.9', () => {
    expect(clasificarIMC(18.5)).toBe('Normal');
    expect(clasificarIMC(22)).toBe('Normal');
    expect(clasificarIMC(24.9)).toBe('Normal');
  });

  test('clasificación Sobrepeso para IMC entre 25 y 29.9', () => {
    expect(clasificarIMC(25)).toBe('Sobrepeso');
    expect(clasificarIMC(27)).toBe('Sobrepeso');
    expect(clasificarIMC(29.9)).toBe('Sobrepeso');
  });

  test('clasificación Obesidad para IMC >= 30', () => {
    expect(clasificarIMC(30)).toBe('Obesidad');
    expect(clasificarIMC(35)).toBe('Obesidad');
  });

  test('resultado tiene formato toFixed(2)', () => {
    const imc = calcularIMC(70, 175);
    expect(imc.toFixed(2)).toMatch(/^\d+\.\d{2}$/);
  });
});
