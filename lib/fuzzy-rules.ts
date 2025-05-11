// Tipo para representar una regla difusa
export type FuzzyRule = {
  description: string
  antecedent: (inputs: any) => number
  consequent: {
    variable: string
    term: string
  }
}

// Definición de las 31 reglas difusas
export const fuzzyRules: FuzzyRule[] = [
  // Reglas de un solo síntoma (12)
  {
    description: "R1: SI pérdida de paquetes ES Alta → Falla en router ES Probable",
    antecedent: (i) => i.perdida_paquetes.alta,
    consequent: {
      variable: "falla_router",
      term: "probable",
    },
  },
  {
    description: "R2: SI pérdida de paquetes ES Alta → Falla del ISP ES Probable",
    antecedent: (i) => i.perdida_paquetes.alta,
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
  },
  {
    description: "R3: SI pérdida de paquetes ES Moderada → Congestión de red local ES Posible",
    antecedent: (i) => i.perdida_paquetes.moderada,
    consequent: {
      variable: "congestion_red_local",
      term: "posible",
    },
  },
  {
    description: "R4: SI errores DNS ES Frecuente → Problema de DNS ES Probable",
    antecedent: (i) => i.errores_dns.frecuente,
    consequent: {
      variable: "problema_dns",
      term: "probable",
    },
  },
  {
    description: "R5: SI errores DNS ES Ocasional → Problema de DNS ES Posible",
    antecedent: (i) => i.errores_dns.ocasional,
    consequent: {
      variable: "problema_dns",
      term: "posible",
    },
  },
  {
    description: "R6: SI velocidad de carga ES Baja → Saturación del servidor interno ES Probable",
    antecedent: (i) => i.velocidad_carga.baja,
    consequent: {
      variable: "saturacion_servidor_interno",
      term: "probable",
    },
  },
  {
    description: "R7: SI velocidad de carga ES Media → Saturación del servidor interno ES Posible",
    antecedent: (i) => i.velocidad_carga.media,
    consequent: {
      variable: "saturacion_servidor_interno",
      term: "posible",
    },
  },
  {
    description: "R8: SI señal Wi-Fi ES Débil → Señal Wi-Fi deficiente ES Probable",
    antecedent: (i) => i.senal_wifi.debil,
    consequent: {
      variable: "senal_wifi_deficiente",
      term: "probable",
    },
  },
  {
    description: "R9: SI señal Wi-Fi ES Media → Señal Wi-Fi deficiente ES Posible",
    antecedent: (i) => i.senal_wifi.moderada,
    consequent: {
      variable: "senal_wifi_deficiente",
      term: "posible",
    },
  },
  {
    description: "R10: SI conexión ES Intermitente → Falla del ISP ES Posible",
    antecedent: (i) => i.conexion.intermitente,
    consequent: {
      variable: "falla_isp",
      term: "posible",
    },
  },
  {
    description: "R11: SI conexión ES Inexistente → Falla del ISP ES Probable",
    antecedent: (i) => i.conexion.inexistente,
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
  },
  {
    description: "R12: SI conexión ES Estable → No hay fallo probable",
    antecedent: (i) => i.conexion.estable,
    consequent: {
      variable: "no_hay_fallo",
      term: "probable",
    },
  },

  // Reglas de dos síntomas (13)
  {
    description: "R13: SI pérdida de paquetes ES Alta Y conexión ES Intermitente → Falla del ISP ES Probable",
    antecedent: (i) => Math.min(i.perdida_paquetes.alta, i.conexion.intermitente),
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
  },
  {
    description: "R14: SI pérdida de paquetes ES Alta Y velocidad de carga ES Baja → Falla del ISP ES Probable",
    antecedent: (i) => Math.min(i.perdida_paquetes.alta, i.velocidad_carga.baja),
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
  },
  {
    description: "R15: SI pérdida de paquetes ES Alta Y señal Wi-Fi ES Débil → Falla en router ES Probable",
    antecedent: (i) => Math.min(i.perdida_paquetes.alta, i.senal_wifi.debil),
    consequent: {
      variable: "falla_router",
      term: "probable",
    },
  },
  {
    description: "R16: SI velocidad de carga ES Baja Y errores DNS ES Frecuente → Problema de DNS ES Posible",
    antecedent: (i) => Math.min(i.velocidad_carga.baja, i.errores_dns.frecuente),
    consequent: {
      variable: "problema_dns",
      term: "posible",
    },
  },
  {
    description: "R17: SI velocidad de carga ES Baja Y señal Wi-Fi ES Débil → Señal Wi-Fi deficiente ES Probable",
    antecedent: (i) => Math.min(i.velocidad_carga.baja, i.senal_wifi.debil),
    consequent: {
      variable: "senal_wifi_deficiente",
      term: "probable",
    },
  },
  {
    description: "R18: SI velocidad de carga ES Baja Y conexión ES Intermitente → Falla del ISP ES Probable",
    antecedent: (i) => Math.min(i.velocidad_carga.baja, i.conexion.intermitente),
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
  },
  {
    description: "R19: SI errores DNS ES Frecuente Y conexión ES Intermitente → Problema de DNS ES Probable",
    antecedent: (i) => Math.min(i.errores_dns.frecuente, i.conexion.intermitente),
    consequent: {
      variable: "problema_dns",
      term: "probable",
    },
  },
  {
    description: "R20: SI señal Wi-Fi ES Débil Y conexión ES Intermitente → Señal Wi-Fi deficiente ES Probable",
    antecedent: (i) => Math.min(i.senal_wifi.debil, i.conexion.intermitente),
    consequent: {
      variable: "senal_wifi_deficiente",
      term: "probable",
    },
  },
  {
    description: "R21: SI señal Wi-Fi ES Débil Y pérdida de paquetes ES Moderada → Congestión de red local ES Posible",
    antecedent: (i) => Math.min(i.senal_wifi.debil, i.perdida_paquetes.moderada),
    consequent: {
      variable: "congestion_red_local",
      term: "posible",
    },
  },
  {
    description: "R22: SI conexión ES Inexistente Y errores DNS ES Frecuente → Problema de DNS ES Probable",
    antecedent: (i) => Math.min(i.conexion.inexistente, i.errores_dns.frecuente),
    consequent: {
      variable: "problema_dns",
      term: "probable",
    },
  },
  {
    description: "R23: SI conexión ES Inexistente Y pérdida de paquetes ES Alta → Falla del ISP ES Probable",
    antecedent: (i) => Math.min(i.conexion.inexistente, i.perdida_paquetes.alta),
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
  },
  {
    description: "R24: SI velocidad de carga ES Media Y señal Wi-Fi ES Media → Señal Wi-Fi deficiente ES Posible",
    antecedent: (i) => Math.min(i.velocidad_carga.media, i.senal_wifi.moderada),
    consequent: {
      variable: "senal_wifi_deficiente",
      term: "posible",
    },
  },
  {
    description: "R25: SI velocidad de carga ES Media Y errores DNS ES Ocasional → Problema de DNS ES Posible",
    antecedent: (i) => Math.min(i.velocidad_carga.media, i.errores_dns.ocasional),
    consequent: {
      variable: "problema_dns",
      term: "posible",
    },
  },

  // Reglas de tres síntomas (6)
  {
    description:
      "R26: SI pérdida de paquetes ES Alta Y velocidad de carga ES Baja Y conexión ES Intermitente → Falla del ISP ES Probable",
    antecedent: (i) => Math.min(i.perdida_paquetes.alta, i.velocidad_carga.baja, i.conexion.intermitente),
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
  },
  {
    description:
      "R27: SI pérdida de paquetes ES Alta Y errores DNS ES Frecuente Y conexión ES Intermitente → Problema de DNS ES Probable",
    antecedent: (i) => Math.min(i.perdida_paquetes.alta, i.errores_dns.frecuente, i.conexion.intermitente),
    consequent: {
      variable: "problema_dns",
      term: "probable",
    },
  },
  {
    description:
      "R28: SI señal Wi-Fi ES Débil Y velocidad de carga ES Baja Y errores DNS ES Ocasional → Señal Wi-Fi deficiente ES Posible",
    antecedent: (i) => Math.min(i.senal_wifi.debil, i.velocidad_carga.baja, i.errores_dns.ocasional),
    consequent: {
      variable: "senal_wifi_deficiente",
      term: "posible",
    },
  },
  {
    description:
      "R29: SI pérdida de paquetes ES Moderada Y velocidad de carga ES Media Y conexión ES Intermitente → Congestión de red local ES Posible",
    antecedent: (i) => Math.min(i.perdida_paquetes.moderada, i.velocidad_carga.media, i.conexion.intermitente),
    consequent: {
      variable: "congestion_red_local",
      term: "posible",
    },
  },
  {
    description:
      "R30: SI errores DNS ES Frecuente Y velocidad de carga ES Baja Y señal Wi-Fi ES Débil → Problema de DNS ES Probable",
    antecedent: (i) => Math.min(i.errores_dns.frecuente, i.velocidad_carga.baja, i.senal_wifi.debil),
    consequent: {
      variable: "problema_dns",
      term: "probable",
    },
  },
  {
    description:
      "R31: SI conexión ES Estable Y velocidad de carga ES Alta Y señal Wi-Fi ES Fuerte → No hay fallo probable",
    antecedent: (i) => Math.min(i.conexion.estable, i.velocidad_carga.alta, i.senal_wifi.fuerte),
    consequent: {
      variable: "no_hay_fallo",
      term: "probable",
    },
  },
]

// Mapeo de nombres de diagnóstico para la UI
export const diagnosticNames = {
  falla_router: "Falla en Router",
  falla_isp: "Falla del ISP",
  problema_dns: "Problema de DNS",
  senal_wifi_deficiente: "Señal Wi-Fi Deficiente",
  congestion_red_local: "Congestión de Red Local",
  saturacion_servidor_interno: "Saturación del Servidor Interno",
  no_hay_fallo: "No hay Fallo Detectado",
}
