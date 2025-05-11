import { triangularMF, trapezoidalMF } from "./fuzzy-logic"

// Definición de variables lingüísticas de entrada
export const inputVariables = {
  // Conexión (%)
  conexion: {
    inexistente: trapezoidalMF(0, 0, 20, 30),
    intermitente: triangularMF(20, 50, 80),
    estable: trapezoidalMF(70, 90, 100, 100),
  },

  // Velocidad de carga (Mbps)
  velocidad_carga: {
    baja: trapezoidalMF(0, 0, 2, 3),
    media: triangularMF(2, 4.5, 7),
    alta: trapezoidalMF(6, 7, 10, 10),
  },

  // Pérdida de paquetes (%)
  perdida_paquetes: {
    ninguna: triangularMF(0, 0, 1),
    moderada: triangularMF(1, 8, 15),
    alta: trapezoidalMF(15, 20, 30, 30),
  },

  // Errores DNS (por hora)
  errores_dns: {
    inexistente: triangularMF(0, 0, 0.5),
    ocasional: triangularMF(0.5, 2, 3),
    frecuente: trapezoidalMF(3, 5, 10, 10),
  },

  // Señal WiFi (%)
  senal_wifi: {
    debil: trapezoidalMF(0, 0, 30, 50),
    media: triangularMF(30, 60, 80),
    fuerte: trapezoidalMF(70, 90, 100, 100),
  },
}

// Definición de variables lingüísticas de salida
export const outputVariables = {
  falla_router: {
    improbable: triangularMF(0, 0, 50),
    posible: triangularMF(25, 50, 75),
    probable: triangularMF(50, 100, 100),
  },
  falla_isp: {
    improbable: triangularMF(0, 0, 50),
    posible: triangularMF(25, 50, 75),
    probable: triangularMF(50, 100, 100),
  },
  problema_dns: {
    improbable: triangularMF(0, 0, 50),
    posible: triangularMF(25, 50, 75),
    probable: triangularMF(50, 100, 100),
  },
  senal_wifi_deficiente: {
    improbable: triangularMF(0, 0, 50),
    posible: triangularMF(25, 50, 75),
    probable: triangularMF(50, 100, 100),
  },
  congestion_red_local: {
    improbable: triangularMF(0, 0, 50),
    posible: triangularMF(25, 50, 75),
    probable: triangularMF(50, 100, 100),
  },
  saturacion_servidor_interno: {
    improbable: triangularMF(0, 0, 50),
    posible: triangularMF(25, 50, 75),
    probable: triangularMF(50, 100, 100),
  },
  no_hay_fallo: {
    improbable: triangularMF(0, 0, 50),
    posible: triangularMF(25, 50, 75),
    probable: triangularMF(50, 100, 100),
  },
}

// Valores discretos para defuzzificación
export const outputDiscreteValues = {
  improbable: 25,
  posible: 50,
  probable: 75,
}

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
