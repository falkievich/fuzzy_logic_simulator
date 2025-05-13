import {
  conexionInexistente,
  conexionIntermitente,
  conexionEstable,
  velocidadBaja,
  velocidadMedia,
  velocidadAlta,
  perdidaNinguna,
  perdidaModerada,
  perdidaAlta,
  dnsInexistente,
  dnsOcasional,
  dnsFrecuente,
  wifiDebil,
  wifiModerada,
  wifiFuerte,
} from "./fuzzy-logic"
import { fuzzyRules } from "./fuzzy-rules"

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

// Función para calcular el centroide con rangos continuos
function continuousCentroidDefuzzification(
  outputRanges: { term: string; min: number; max: number }[],
  membershipDegrees: Record<string, number>,
): number {
  // Número de puntos para la discretización
  const numPoints = 100
  let numerator = 0
  let denominator = 0

  // Para cada término lingüístico
  for (const range of outputRanges) {
    const { term, min, max } = range
    const membershipDegree = membershipDegrees[term] || 0

    if (membershipDegree > 0) {
      // Discretizar el rango y calcular el centroide
      const step = (max - min) / numPoints
      for (let i = 0; i <= numPoints; i++) {
        const x = min + i * step
        numerator += x * membershipDegree
        denominator += membershipDegree
      }
    }
  }

  return denominator === 0 ? 0 : numerator / denominator
}

// Motor de inferencia difusa
export function fuzzyInference(params: DiagnosisParams): DiagnosisResult {
  try {
    // Paso 1: Fuzzificación - Evaluar las funciones de membresía para cada entrada
    const inputs = {
      conexion: {
        inexistente: conexionInexistente(params.conexion),
        intermitente: conexionIntermitente(params.conexion),
        estable: conexionEstable(params.conexion),
      },
      velocidad_carga: {
        baja: velocidadBaja(params.velocidad_carga),
        media: velocidadMedia(params.velocidad_carga),
        alta: velocidadAlta(params.velocidad_carga),
      },
      perdida_paquetes: {
        ninguna: perdidaNinguna(params.perdida_paquetes),
        moderada: perdidaModerada(params.perdida_paquetes),
        alta: perdidaAlta(params.perdida_paquetes),
      },
      errores_dns: {
        inexistente: dnsInexistente(params.errores_dns),
        ocasional: dnsOcasional(params.errores_dns),
        frecuente: dnsFrecuente(params.errores_dns),
      },
      senal_wifi: {
        debil: wifiDebil(params.senal_wifi),
        moderada: wifiModerada(params.senal_wifi),
        fuerte: wifiFuerte(params.senal_wifi),
      },
    }

    // Paso 2: Inicializar la estructura de salida
    const outputFuzzy: Record<string, Record<string, number>> = {
      falla_router: { improbable: 0, posible: 0, probable: 0 },
      falla_isp: { improbable: 0, posible: 0, probable: 0 },
      problema_dns: { improbable: 0, posible: 0, probable: 0 },
      senal_wifi_deficiente: { improbable: 0, posible: 0, probable: 0 },
      congestion_red_local: { improbable: 0, posible: 0, probable: 0 },
      saturacion_servidor_interno: { improbable: 0, posible: 0, probable: 0 },
      no_hay_fallo: { improbable: 0, posible: 0, probable: 0 },
    }

    // Paso 3: Evaluación de reglas y agregación
    const reglas_activadas: ActivatedRule[] = []

    for (const rule of fuzzyRules) {
      const alpha = rule.antecedent(inputs)

      if (alpha > 0) {
        // Registrar la regla activada
        reglas_activadas.push({
          regla: rule.description,
          nivel: alpha,
        })

        // Agregar el resultado a la salida correspondiente (método máximo)
        const { variable, term } = rule.consequent
        outputFuzzy[variable][term] = Math.max(outputFuzzy[variable][term], alpha)
      }
    }

    // Paso 4: Defuzzificación con rangos continuos
    // Definir los rangos para cada término lingüístico
    const outputRanges = [
      { term: "improbable", min: 0, max: 33 },
      { term: "posible", min: 33, max: 67 },
      { term: "probable", min: 67, max: 100 },
    ]

    const resultados: Record<string, number> = {}

    // Para cada variable de salida
    for (const varName in outputFuzzy) {
      // Calcular el centroide usando rangos continuos
      resultados[varName] = continuousCentroidDefuzzification(outputRanges, outputFuzzy[varName])
    }

    // Paso 5: Determinar el diagnóstico principal
    const diagnostico_principal = Object.keys(resultados).reduce((a, b) => (resultados[a] > resultados[b] ? a : b))
    const nivel_diagnostico = resultados[diagnostico_principal]

    // Paso 6: Generar recomendaciones
    const recomendaciones = generateRecommendations(diagnostico_principal, nivel_diagnostico)

    // Devolver el resultado del diagnóstico
    return {
      resultados,
      diagnostico_principal,
      nivel_diagnostico,
      reglas_activadas,
      recomendaciones,
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
