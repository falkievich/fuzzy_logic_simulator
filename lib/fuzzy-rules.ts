import { fuzzyAnd } from "./fuzzy-logic"

// Tipo para representar una regla difusa
export type FuzzyRule = {
  antecedent: (inputs: Record<string, Record<string, number>>) => number
  consequent: {
    variable: string
    term: string
  }
  description: string
}

// Definición de las 30 reglas difusas según el modelado teórico
export const fuzzyRules: FuzzyRule[] = [
  // Reglas de un solo síntoma (12)
  // 1. SI Pérdida de paquetes ES Alta → Falla en router ES Probable
  {
    antecedent: (inputs) => inputs.perdida_paquetes.alta,
    consequent: {
      variable: "falla_router",
      term: "probable",
    },
    description: "Si pérdida de paquetes es alta, entonces falla en router es probable",
  },

  // 2. SI Pérdida de paquetes ES Alta → Falla del ISP ES Probable
  {
    antecedent: (inputs) => inputs.perdida_paquetes.alta,
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
    description: "Si pérdida de paquetes es alta, entonces falla del ISP es probable",
  },

  // 3. SI Pérdida de paquetes ES Moderada → Congestión de red local ES Posible
  {
    antecedent: (inputs) => inputs.perdida_paquetes.moderada,
    consequent: {
      variable: "congestion_red_local",
      term: "posible",
    },
    description: "Si pérdida de paquetes es moderada, entonces congestión de red local es posible",
  },

  // 4. SI Errores DNS ES Frecuente → Problema de DNS ES Probable
  {
    antecedent: (inputs) => inputs.errores_dns.frecuente,
    consequent: {
      variable: "problema_dns",
      term: "probable",
    },
    description: "Si errores DNS son frecuentes, entonces problema de DNS es probable",
  },

  // 5. SI Errores DNS ES Ocasional → Problema de DNS ES Posible
  {
    antecedent: (inputs) => inputs.errores_dns.ocasional,
    consequent: {
      variable: "problema_dns",
      term: "posible",
    },
    description: "Si errores DNS son ocasionales, entonces problema de DNS es posible",
  },

  // 6. SI Velocidad de carga ES Baja → Saturación del servidor interno ES Probable
  {
    antecedent: (inputs) => inputs.velocidad_carga.baja,
    consequent: {
      variable: "saturacion_servidor_interno",
      term: "probable",
    },
    description: "Si velocidad de carga es baja, entonces saturación del servidor interno es probable",
  },

  // 7. SI Velocidad de carga ES Media → Saturación del servidor interno ES Posible
  {
    antecedent: (inputs) => inputs.velocidad_carga.media,
    consequent: {
      variable: "saturacion_servidor_interno",
      term: "posible",
    },
    description: "Si velocidad de carga es media, entonces saturación del servidor interno es posible",
  },

  // 8. SI Señal Wi-Fi ES Débil → Señal Wi-Fi deficiente ES Probable
  {
    antecedent: (inputs) => inputs.senal_wifi.debil,
    consequent: {
      variable: "senal_wifi_deficiente",
      term: "probable",
    },
    description: "Si señal Wi-Fi es débil, entonces señal Wi-Fi deficiente es probable",
  },

  // 9. SI Señal Wi-Fi ES Media → Señal Wi-Fi deficiente ES Posible
  {
    antecedent: (inputs) => inputs.senal_wifi.media,
    consequent: {
      variable: "senal_wifi_deficiente",
      term: "posible",
    },
    description: "Si señal Wi-Fi es media, entonces señal Wi-Fi deficiente es posible",
  },

  // 10. SI Conexión ES Intermitente → Falla del ISP ES Posible
  {
    antecedent: (inputs) => inputs.conexion.intermitente,
    consequent: {
      variable: "falla_isp",
      term: "posible",
    },
    description: "Si conexión es intermitente, entonces falla del ISP es posible",
  },

  // 11. SI Conexión ES Inexistente → Falla del ISP ES Probable
  {
    antecedent: (inputs) => inputs.conexion.inexistente,
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
    description: "Si conexión es inexistente, entonces falla del ISP es probable",
  },

  // 12. SI Conexión ES Estable → No hay fallo probable
  {
    antecedent: (inputs) => inputs.conexion.estable,
    consequent: {
      variable: "no_hay_fallo",
      term: "probable",
    },
    description: "Si conexión es estable, entonces no hay fallo probable",
  },

  // Reglas de dos síntomas (12)
  // 13. SI Pérdida de paquetes ES Alta Y Conexión ES Intermitente → Falla del ISP ES Probable
  {
    antecedent: (inputs) => fuzzyAnd(inputs.perdida_paquetes.alta, inputs.conexion.intermitente),
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
    description: "Si pérdida de paquetes es alta y conexión es intermitente, entonces falla del ISP es probable",
  },

  // 14. SI Pérdida de paquetes ES Alta Y Velocidad de carga ES Baja → Falla del ISP ES Probable
  {
    antecedent: (inputs) => fuzzyAnd(inputs.perdida_paquetes.alta, inputs.velocidad_carga.baja),
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
    description: "Si pérdida de paquetes es alta y velocidad de carga es baja, entonces falla del ISP es probable",
  },

  // 15. SI Pérdida de paquetes ES Alta Y Señal Wi-Fi ES Débil → Falla en router ES Probable
  {
    antecedent: (inputs) => fuzzyAnd(inputs.perdida_paquetes.alta, inputs.senal_wifi.debil),
    consequent: {
      variable: "falla_router",
      term: "probable",
    },
    description: "Si pérdida de paquetes es alta y señal Wi-Fi es débil, entonces falla en router es probable",
  },

  // 16. SI Velocidad de carga ES Baja Y Errores DNS ES Frecuente → Problema de DNS ES Posible
  {
    antecedent: (inputs) => fuzzyAnd(inputs.velocidad_carga.baja, inputs.errores_dns.frecuente),
    consequent: {
      variable: "problema_dns",
      term: "posible",
    },
    description: "Si velocidad de carga es baja y errores DNS son frecuentes, entonces problema de DNS es posible",
  },

  // 17. SI Velocidad de carga ES Baja Y Señal Wi-Fi ES Débil → Señal Wi-Fi deficiente ES Probable
  {
    antecedent: (inputs) => fuzzyAnd(inputs.velocidad_carga.baja, inputs.senal_wifi.debil),
    consequent: {
      variable: "senal_wifi_deficiente",
      term: "probable",
    },
    description: "Si velocidad de carga es baja y señal Wi-Fi es débil, entonces señal Wi-Fi deficiente es probable",
  },

  // 18. SI Velocidad de carga ES Baja Y Conexión ES Intermitente → Falla del ISP ES Probable
  {
    antecedent: (inputs) => fuzzyAnd(inputs.velocidad_carga.baja, inputs.conexion.intermitente),
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
    description: "Si velocidad de carga es baja y conexión es intermitente, entonces falla del ISP es probable",
  },

  // 19. SI Errores DNS ES Frecuente Y Conexión ES Intermitente → Problema de DNS ES Probable
  {
    antecedent: (inputs) => fuzzyAnd(inputs.errores_dns.frecuente, inputs.conexion.intermitente),
    consequent: {
      variable: "problema_dns",
      term: "probable",
    },
    description: "Si errores DNS son frecuentes y conexión es intermitente, entonces problema de DNS es probable",
  },

  // 20. SI Señal Wi-Fi ES Débil Y Conexión ES Intermitente → Señal Wi-Fi deficiente ES Probable
  {
    antecedent: (inputs) => fuzzyAnd(inputs.senal_wifi.debil, inputs.conexion.intermitente),
    consequent: {
      variable: "senal_wifi_deficiente",
      term: "probable",
    },
    description: "Si señal Wi-Fi es débil y conexión es intermitente, entonces señal Wi-Fi deficiente es probable",
  },

  // 21. SI Señal Wi-Fi ES Débil Y Pérdida de paquetes ES Moderada → Congestión de red local ES Posible
  {
    antecedent: (inputs) => fuzzyAnd(inputs.senal_wifi.debil, inputs.perdida_paquetes.moderada),
    consequent: {
      variable: "congestion_red_local",
      term: "posible",
    },
    description:
      "Si señal Wi-Fi es débil y pérdida de paquetes es moderada, entonces congestión de red local es posible",
  },

  // 22. SI Conexión ES Inexistente Y Errores DNS ES Frecuente → Problema de DNS ES Probable
  {
    antecedent: (inputs) => fuzzyAnd(inputs.conexion.inexistente, inputs.errores_dns.frecuente),
    consequent: {
      variable: "problema_dns",
      term: "probable",
    },
    description: "Si conexión es inexistente y errores DNS son frecuentes, entonces problema de DNS es probable",
  },

  // 23. SI Conexión ES Inexistente Y Pérdida de paquetes ES Alta → Falla del ISP ES Probable
  {
    antecedent: (inputs) => fuzzyAnd(inputs.conexion.inexistente, inputs.perdida_paquetes.alta),
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
    description: "Si conexión es inexistente y pérdida de paquetes es alta, entonces falla del ISP es probable",
  },

  // 24. SI Velocidad de carga ES Media Y Señal Wi-Fi ES Media → Señal Wi-Fi deficiente ES Posible
  {
    antecedent: (inputs) => fuzzyAnd(inputs.velocidad_carga.media, inputs.senal_wifi.media),
    consequent: {
      variable: "senal_wifi_deficiente",
      term: "posible",
    },
    description: "Si velocidad de carga es media y señal Wi-Fi es media, entonces señal Wi-Fi deficiente es posible",
  },

  // 25. SI Velocidad de carga ES Media Y Errores DNS ES Ocasional → Problema de DNS ES Posible
  {
    antecedent: (inputs) => fuzzyAnd(inputs.velocidad_carga.media, inputs.errores_dns.ocasional),
    consequent: {
      variable: "problema_dns",
      term: "posible",
    },
    description: "Si velocidad de carga es media y errores DNS son ocasionales, entonces problema de DNS es posible",
  },

  // Reglas de tres síntomas (6)
  // 26. SI Pérdida de paquetes ES Alta Y Velocidad de carga ES Baja Y Conexión ES Intermitente → Falla del ISP ES Probable
  {
    antecedent: (inputs) =>
      fuzzyAnd(fuzzyAnd(inputs.perdida_paquetes.alta, inputs.velocidad_carga.baja), inputs.conexion.intermitente),
    consequent: {
      variable: "falla_isp",
      term: "probable",
    },
    description:
      "Si pérdida de paquetes es alta, velocidad de carga es baja y conexión es intermitente, entonces falla del ISP es probable",
  },

  // 27. SI Pérdida de paquetes ES Alta Y Errores DNS ES Frecuente Y Conexión ES Intermitente → Problema de DNS ES Probable
  {
    antecedent: (inputs) =>
      fuzzyAnd(fuzzyAnd(inputs.perdida_paquetes.alta, inputs.errores_dns.frecuente), inputs.conexion.intermitente),
    consequent: {
      variable: "problema_dns",
      term: "probable",
    },
    description:
      "Si pérdida de paquetes es alta, errores DNS son frecuentes y conexión es intermitente, entonces problema de DNS es probable",
  },

  // 28. SI Señal Wi-Fi ES Débil Y Velocidad de carga ES Baja Y Errores DNS ES Ocasional → Señal Wi-Fi deficiente ES Posible
  {
    antecedent: (inputs) =>
      fuzzyAnd(fuzzyAnd(inputs.senal_wifi.debil, inputs.velocidad_carga.baja), inputs.errores_dns.ocasional),
    consequent: {
      variable: "senal_wifi_deficiente",
      term: "posible",
    },
    description:
      "Si señal Wi-Fi es débil, velocidad de carga es baja y errores DNS son ocasionales, entonces señal Wi-Fi deficiente es posible",
  },

  // 29. SI Pérdida de paquetes ES Moderada Y Velocidad de carga ES Media Y Conexión ES Intermitente → Congestión de red local ES Posible
  {
    antecedent: (inputs) =>
      fuzzyAnd(fuzzyAnd(inputs.perdida_paquetes.moderada, inputs.velocidad_carga.media), inputs.conexion.intermitente),
    consequent: {
      variable: "congestion_red_local",
      term: "posible",
    },
    description:
      "Si pérdida de paquetes es moderada, velocidad de carga es media y conexión es intermitente, entonces congestión de red local es posible",
  },

  // 30. SI Errores DNS ES Frecuente Y Velocidad de carga ES Baja Y Señal Wi-Fi ES Débil → Problema de DNS ES Probable
  {
    antecedent: (inputs) =>
      fuzzyAnd(fuzzyAnd(inputs.errores_dns.frecuente, inputs.velocidad_carga.baja), inputs.senal_wifi.debil),
    consequent: {
      variable: "problema_dns",
      term: "probable",
    },
    description:
      "Si errores DNS son frecuentes, velocidad de carga es baja y señal Wi-Fi es débil, entonces problema de DNS es probable",
  },

  // 31. SI Conexión ES Estable Y Velocidad de carga ES Alta Y Señal Wi-Fi ES Fuerte → No hay fallo probable
  {
    antecedent: (inputs) =>
      fuzzyAnd(fuzzyAnd(inputs.conexion.estable, inputs.velocidad_carga.alta), inputs.senal_wifi.fuerte),
    consequent: {
      variable: "no_hay_fallo",
      term: "probable",
    },
    description:
      "Si conexión es estable, velocidad de carga es alta y señal Wi-Fi es fuerte, entonces no hay fallo probable",
  },
]
