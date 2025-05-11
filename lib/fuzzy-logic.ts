// Funciones básicas de lógica difusa
export const fuzzyAnd = (a: number, b: number): number => Math.min(a, b)
export const fuzzyOr = (a: number, b: number): number => Math.max(a, b)
export const fuzzyNot = (a: number): number => 1 - a

// Tipos de funciones de membresía
export type MembershipFunction = (x: number) => number

// Función de membresía triangular
export function triangularMF(a: number, b: number, c: number): MembershipFunction {
  return (x: number): number => {
    if (x <= a || x >= c) return 0
    if (x === b) return 1
    if (x < b) return (x - a) / (b - a)
    return (c - x) / (c - b)
  }
}

// Función de membresía trapezoidal
export function trapezoidalMF(a: number, b: number, c: number, d: number): MembershipFunction {
  return (x: number): number => {
    if (x <= a || x >= d) return 0
    if (x >= b && x <= c) return 1
    if (x < b) return (x - a) / (b - a)
    return (d - x) / (d - c)
  }
}

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

// Evaluar una función de membresía para un valor dado
export function evaluateMembership(
  value: number,
  membershipFunctions: Record<string, MembershipFunction>,
): Record<string, number> {
  const result: Record<string, number> = {}

  for (const [key, mf] of Object.entries(membershipFunctions)) {
    result[key] = mf(value)
  }

  return result
}
