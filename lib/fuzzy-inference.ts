import { evaluateMembership, centroidDefuzzification } from "./fuzzy-logic"
import { inputVariables, outputVariables, outputDiscreteValues } from "./fuzzy-variables"
import { fuzzyRules, type FuzzyRule } from "./fuzzy-rules"

// Tipo para los parámetros de diagnóstico
export interface DiagnosisParams {
  velocidad_carga: number
  perdida_paquetes: number
  errores_dns: number
  senal_wifi: number
  conexion: number
}

// Tipo para el resultado de una regla activada
export interface ActivatedRule {
  regla: string
  nivel: number
}

// Tipo para el resultado del diagnóstico
export interface DiagnosisResult {
  resultados: Record<string, number>
  diagnostico_principal: string
  nivel_diagnostico: number
  reglas_activadas: ActivatedRule[]
  recomendaciones: string[]
  error?: string
}

// Función para generar recomendaciones basadas en el diagnóstico
function generateRecommendations(diagnosis: string, level: number): string[] {
  const recommendations: string[] = []

  switch (diagnosis) {
    case "falla_router":
      recommendations.push("Reiniciar el router y verificar las conexiones físicas.")
      recommendations.push("Comprobar si hay actualizaciones de firmware disponibles para el router.")
      if (level > 70) {
        recommendations.push("Considerar reemplazar el router si es antiguo o muestra signos de fallo.")
        recommendations.push("Verificar si hay interferencias electromagnéticas cerca del router.")
      }
      break

    case "falla_isp":
      recommendations.push("Contactar al proveedor de servicios de Internet (ISP) para reportar el problema.")
      recommendations.push("Verificar si hay mantenimientos programados o cortes en la zona.")
      if (level > 70) {
        recommendations.push("Solicitar una revisión técnica por parte del ISP.")
        recommendations.push("Considerar temporalmente un proveedor de Internet alternativo para tareas críticas.")
      }
      break

    case "problema_dns":
      recommendations.push("Verificar la configuración de DNS en los equipos afectados.")
      recommendations.push(
        "Considerar el uso de servidores DNS alternativos (como Google 8.8.8.8 o Cloudflare 1.1.1.1).",
      )
      if (level > 70) {
        recommendations.push("Revisar si hay malware que esté afectando la resolución DNS.")
        recommendations.push("Verificar si hay conflictos con el firewall o software de seguridad.")
      }
      break

    case "senal_wifi_deficiente":
      recommendations.push("Verificar la ubicación del router WiFi y considerar su reposicionamiento.")
      recommendations.push("Revisar si hay interferencias de otros dispositivos electrónicos o redes cercanas.")
      if (level > 70) {
        recommendations.push("Instalar repetidores WiFi en áreas con señal débil.")
        recommendations.push("Considerar la actualización a un router con mejor cobertura o tecnología más reciente.")
      }
      break

    case "congestion_red_local":
      recommendations.push("Revisar si hay dispositivos o aplicaciones consumiendo excesivo ancho de banda.")
      recommendations.push("Implementar políticas de QoS (Quality of Service) para priorizar tráfico crítico.")
      if (level > 70) {
        recommendations.push("Segmentar la red para distribuir mejor el tráfico.")
        recommendations.push("Considerar aumentar la capacidad de los equipos de red.")
      }
      break

    case "saturacion_servidor_interno":
      recommendations.push("Revisar la carga del servidor y los procesos que están consumiendo recursos.")
      recommendations.push("Optimizar las aplicaciones que se ejecutan en el servidor.")
      if (level > 70) {
        recommendations.push("Considerar aumentar la capacidad del servidor o implementar balanceo de carga.")
        recommendations.push("Programar tareas de alto consumo en horarios de menor uso.")
      }
      break

    case "no_hay_fallo":
      recommendations.push("No se detectan problemas significativos en la red.")
      recommendations.push("Realizar mantenimiento preventivo periódico para evitar futuros problemas.")
      break
  }

  return recommendations
}

// Motor de inferencia difusa
export function fuzzyInference(params: DiagnosisParams): DiagnosisResult {
  try {
    // Paso 1: Fuzzificación - Evaluar las funciones de membresía para cada entrada
    const fuzzifiedInputs = {
      velocidad_carga: evaluateMembership(params.velocidad_carga, inputVariables.velocidad_carga),
      perdida_paquetes: evaluateMembership(params.perdida_paquetes, inputVariables.perdida_paquetes),
      errores_dns: evaluateMembership(params.errores_dns, inputVariables.errores_dns),
      senal_wifi: evaluateMembership(params.senal_wifi, inputVariables.senal_wifi),
      conexion: evaluateMembership(params.conexion, inputVariables.conexion),
    }

    // Paso 2: Evaluación de reglas - Calcular el grado de activación de cada regla
    const activatedRules: ActivatedRule[] = []
    const outputAggregation: Record<string, Record<string, number>> = {}

    // Inicializar la agregación de salidas
    Object.keys(outputVariables).forEach((variable) => {
      outputAggregation[variable] = {
        improbable: 0,
        posible: 0,
        probable: 0,
      }
    })

    // Evaluar cada regla
    fuzzyRules.forEach((rule: FuzzyRule) => {
      const activationLevel = rule.antecedent(fuzzifiedInputs)

      if (activationLevel > 0) {
        // Registrar la regla activada
        activatedRules.push({
          regla: rule.description,
          nivel: activationLevel,
        })

        // Agregar el resultado a la salida correspondiente (método máximo)
        const { variable, term } = rule.consequent
        outputAggregation[variable][term] = Math.max(outputAggregation[variable][term], activationLevel)
      }
    })

    // Paso 3: Defuzzificación - Convertir los resultados difusos en valores nítidos
    const crispResults: Record<string, number> = {}

    Object.entries(outputAggregation).forEach(([variable, terms]) => {
      // Preparar los valores para la defuzzificación por centroide
      const membershipDegrees: number[] = []
      const outputValues: number[] = []

      Object.entries(terms).forEach(([term, degree]) => {
        if (degree > 0) {
          membershipDegrees.push(degree)
          outputValues.push(outputDiscreteValues[term as keyof typeof outputDiscreteValues])
        }
      })

      // Calcular el valor nítido usando el método del centroide
      crispResults[variable] = centroidDefuzzification(outputValues, membershipDegrees)
    })

    // Paso 4: Determinar el diagnóstico principal
    let mainDiagnosis = ""
    let maxLevel = 0

    Object.entries(crispResults).forEach(([diagnosis, level]) => {
      if (level > maxLevel) {
        mainDiagnosis = diagnosis
        maxLevel = level
      }
    })

    // Paso 5: Generar recomendaciones
    const recommendations = generateRecommendations(mainDiagnosis, maxLevel)

    // Devolver el resultado del diagnóstico
    return {
      resultados: crispResults,
      diagnostico_principal: mainDiagnosis,
      nivel_diagnostico: maxLevel,
      reglas_activadas: activatedRules,
      recomendaciones: recommendations,
    }
  } catch (error) {
    console.error("Error en el motor de inferencia difusa:", error)
    return {
      resultados: {},
      diagnostico_principal: "",
      nivel_diagnostico: 0,
      reglas_activadas: [],
      recomendaciones: ["Error en el sistema de diagnóstico. Por favor, contacte al soporte técnico."],
      error: `Error en el diagnóstico: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}
