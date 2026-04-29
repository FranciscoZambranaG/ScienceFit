// Puntos de medición con plicómetro según protocolo científico
// Basado en el protocolo de Jackson-Pollock de 7 pliegues

export const PLICOMETER_POINTS = {
  male: [
    {
      id: 'chest',
      name: 'Pectoral',
      description: 'Pliegue diagonal entre la axila y el pezón',
      instructions: [
        'Pellizcar en diagonal',
        'A medio camino entre axila y pezón',
        'Medir en el lado derecho del cuerpo',
      ],
    },
    {
      id: 'abdominal',
      name: 'Abdominal',
      description: 'Pliegue vertical a 2cm del ombligo',
      instructions: [
        'Pellizcar verticalmente',
        '2 cm al lado derecho del ombligo',
        'A la altura del ombligo',
      ],
    },
    {
      id: 'thigh',
      name: 'Muslo',
      description: 'Pliegue vertical en la parte frontal del muslo',
      instructions: [
        'Pellizcar verticalmente',
        'Punto medio entre rodilla e ingle',
        'Parte frontal del muslo derecho',
      ],
    },
    {
      id: 'triceps',
      name: 'Tríceps',
      description: 'Pliegue vertical en la parte posterior del brazo',
      instructions: [
        'Pellizcar verticalmente',
        'Punto medio entre hombro y codo',
        'Parte posterior del brazo derecho',
      ],
    },
    {
      id: 'subscapular',
      name: 'Subescapular',
      description: 'Pliegue diagonal bajo el omóplato',
      instructions: [
        'Pellizcar diagonalmente (45°)',
        'Justo debajo del ángulo inferior del omóplato',
        'Lado derecho de la espalda',
      ],
    },
    {
      id: 'suprailiac',
      name: 'Suprailiaco',
      description: 'Pliegue diagonal sobre la cresta iliaca',
      instructions: [
        'Pellizcar diagonalmente',
        'Justo encima de la cresta ilíaca',
        'En la línea axilar media',
      ],
    },
    {
      id: 'midaxillary',
      name: 'Axilar Medio',
      description: 'Pliegue horizontal en línea media axilar',
      instructions: [
        'Pellizcar horizontalmente',
        'Línea media axilar',
        'A la altura del proceso xifoides',
      ],
    },
  ],
  female: [
    {
      id: 'triceps',
      name: 'Tríceps',
      description: 'Pliegue vertical en la parte posterior del brazo',
      instructions: [
        'Pellizcar verticalmente',
        'Punto medio entre hombro y codo',
        'Parte posterior del brazo derecho',
      ],
    },
    {
      id: 'abdominal',
      name: 'Abdominal',
      description: 'Pliegue vertical a 2cm del ombligo',
      instructions: [
        'Pellizcar verticalmente',
        '2 cm al lado derecho del ombligo',
        'A la altura del ombligo',
      ],
    },
    {
      id: 'thigh',
      name: 'Muslo',
      description: 'Pliegue vertical en la parte frontal del muslo',
      instructions: [
        'Pellizcar verticalmente',
        'Punto medio entre rodilla e ingle',
        'Parte frontal del muslo derecho',
      ],
    },
    {
      id: 'suprailiac',
      name: 'Suprailiaco',
      description: 'Pliegue diagonal sobre la cresta iliaca',
      instructions: [
        'Pellizcar diagonalmente',
        'Justo encima de la cresta ilíaca',
        'En la línea axilar media',
      ],
    },
    {
      id: 'subscapular',
      name: 'Subescapular',
      description: 'Pliegue diagonal bajo el omóplato',
      instructions: [
        'Pellizcar diagonalmente (45°)',
        'Justo debajo del ángulo inferior del omóplato',
        'Lado derecho de la espalda',
      ],
    },
    {
      id: 'calf',
      name: 'Pantorrilla',
      description: 'Pliegue vertical en la parte medial de la pantorrilla',
      instructions: [
        'Pellizcar verticalmente',
        'Parte medial de la pantorrilla',
        'Nivel de mayor circunferencia',
      ],
    },
    {
      id: 'midaxillary',
      name: 'Axilar Medio',
      description: 'Pliegue horizontal en línea media axilar',
      instructions: [
        'Pellizcar horizontalmente',
        'Línea media axilar',
        'A la altura del proceso xifoides',
      ],
    },
  ],
};

// Fórmula de Jackson-Pollock para calcular porcentaje de grasa corporal
export const calculateBodyFat = (measurements, age, gender) => {
  let sumOfSkinfolds = 0;
  
  if (gender === 'male') {
    // Suma de 7 pliegues para hombres
    sumOfSkinfolds = measurements.chest + measurements.abdominal + 
                     measurements.thigh + measurements.triceps + 
                     measurements.subscapular + measurements.suprailiac + 
                     measurements.midaxillary;
    
    // Fórmula de densidad corporal para hombres
    const bodyDensity = 1.112 - (0.00043499 * sumOfSkinfolds) + 
                        (0.00000055 * Math.pow(sumOfSkinfolds, 2)) - 
                        (0.00028826 * age);
    
    // Fórmula de Siri para convertir densidad a % grasa
    const bodyFatPercentage = ((4.95 / bodyDensity) - 4.5) * 100;
    return bodyFatPercentage;
    
  } else {
    // Suma de 7 pliegues para mujeres
    sumOfSkinfolds = measurements.triceps + measurements.abdominal + 
                     measurements.thigh + measurements.suprailiac + 
                     measurements.subscapular + measurements.calf + 
                     measurements.midaxillary;
    
    // Fórmula de densidad corporal para mujeres
    const bodyDensity = 1.097 - (0.00046971 * sumOfSkinfolds) + 
                        (0.00000056 * Math.pow(sumOfSkinfolds, 2)) - 
                        (0.00012828 * age);
    
    // Fórmula de Siri
    const bodyFatPercentage = ((4.95 / bodyDensity) - 4.5) * 100;
    return bodyFatPercentage;
  }
};

// Calcular masa magra y masa grasa
export const calculateBodyComposition = (weight, bodyFatPercentage) => {
  const fatMass = (weight * bodyFatPercentage) / 100;
  const leanMass = weight - fatMass;
  
  return {
    fatMass: fatMass.toFixed(2),
    leanMass: leanMass.toFixed(2),
    bodyFatPercentage: bodyFatPercentage.toFixed(1),
  };
};