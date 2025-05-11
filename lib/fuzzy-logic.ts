// Función de membresía triangular
export function triangularMF(a: number, b: number, c: number): (x: number) => number {
  return (x: number): number => {
    if (x <= a || x >= c) return 0
    if (x === b) return 1
    if (x < b) return (x - a) / (b - a)
    return (c - x) / (c - b)
  }
}

// Función de membresía trapezoidal
export function trapezoidalMF(a: number, b: number, c: number, d: number): (x: number) => number {
  return (x: number): number => {
    if (x <= a || x >= d) return 0
    if (x > a && x <= b) return (x - a) / (b - a)
    if (x > b && x < c) return 1
    if (x >= c && x < d) return (d - x) / (d - c)
    return 0
  }
}

// Funciones básicas de lógica difusa
export const fuzzyAnd = (a: number, b: number): number => Math.min(a, b)
export const fuzzyOr = (a: number, b: number): number => Math.max(a, b)
export const fuzzyNot = (a: number): number => 1 - a

// Estado de Conexión (%)
export const conexionInexistente = triangularMF(0, 0, 30)
export const conexionIntermitente = triangularMF(20, 50, 80)
export const conexionEstable = triangularMF(70, 100, 100)

// Velocidad de Carga (Mbps)
export const velocidadBaja = triangularMF(0, 0, 3)
export const velocidadMedia = triangularMF(2, 4.5, 7)
export const velocidadAlta = triangularMF(6, 10, 10)

// Pérdida de paquetes (%)
export const perdidaNinguna = triangularMF(0, 0, 1)
export const perdidaModerada = triangularMF(1, 8, 15)
export const perdidaAlta = triangularMF(15, 30, 30)

// Errores DNS (por hora)
export const dnsInexistente = triangularMF(0, 0, 0.5)
export const dnsOcasional = triangularMF(1, 2, 3)
export const dnsFrecuente = triangularMF(3, 10, 10)

// Señal Wi-Fi (%)
export const wifiDebil = triangularMF(0, 0, 50)
export const wifiModerada = triangularMF(30, 60, 80)
export const wifiFuerte = triangularMF(70, 100, 100)

// Defuzzificación por centro de gravedad (centroide)
export function centroidDefuzzification(outputValues: number[], membershipDegrees: number[]): number {
  if (outputValues.length === 0 || membershipDegrees.length === 0) return 0

  let numerator = 0
  let denominator = 0

  for (let i = 0; i < outputValues.length; i++) {
    numerator += outputValues[i] * membershipDegrees[i]
    denominator += membershipDegrees[i]
  }

  return denominator === 0 ? 0 : numerator / denominator
}
