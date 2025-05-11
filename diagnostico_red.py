import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl
import matplotlib.pyplot as plt

# Definición de variables de entrada (antecedentes)
velocidad_carga = ctrl.Antecedent(np.arange(0, 11, 0.1), 'velocidad_carga')
perdida_paquetes = ctrl.Antecedent(np.arange(0, 31, 0.1), 'perdida_paquetes')
errores_dns = ctrl.Antecedent(np.arange(0, 11, 0.1), 'errores_dns')
senal_wifi = ctrl.Antecedent(np.arange(0, 101, 1), 'senal_wifi')
tiempo_respuesta = ctrl.Antecedent(np.arange(0, 501, 1), 'tiempo_respuesta')

# Definición de variables de salida (consecuentes)
problema_isp = ctrl.Consequent(np.arange(0, 101, 1), 'problema_isp')
problema_hardware = ctrl.Consequent(np.arange(0, 101, 1), 'problema_hardware')
problema_dns = ctrl.Consequent(np.arange(0, 101, 1), 'problema_dns')
problema_wifi = ctrl.Consequent(np.arange(0, 101, 1), 'problema_wifi')
congestion_red = ctrl.Consequent(np.arange(0, 101, 1), 'congestion_red')

# Funciones de membresía para velocidad de carga (Mbps)
velocidad_carga['baja'] = fuzz.trapmf(velocidad_carga.universe, [0, 0, 2, 3])
velocidad_carga['media'] = fuzz.trimf(velocidad_carga.universe, [2, 4.5, 7])
velocidad_carga['alta'] = fuzz.trapmf(velocidad_carga.universe, [6, 7, 10, 10])

# Funciones de membresía para pérdida de paquetes (%)
perdida_paquetes['ninguna'] = fuzz.trimf(perdida_paquetes.universe, [0, 0, 1])
perdida_paquetes['moderada'] = fuzz.trimf(perdida_paquetes.universe, [1, 8, 15])
perdida_paquetes['alta'] = fuzz.trapmf(perdida_paquetes.universe, [15, 20, 30, 30])

# Funciones de membresía para errores DNS (errores por hora)
errores_dns['inexistente'] = fuzz.trimf(errores_dns.universe, [0, 0, 0.5])
errores_dns['ocasional'] = fuzz.trimf(errores_dns.universe, [0.5, 2, 3])
errores_dns['frecuente'] = fuzz.trapmf(errores_dns.universe, [3, 5, 10, 10])

# Funciones de membresía para señal WiFi (%)
senal_wifi['debil'] = fuzz.trapmf(senal_wifi.universe, [0, 0, 30, 50])
senal_wifi['moderada'] = fuzz.trimf(senal_wifi.universe, [30, 60, 80])
senal_wifi['fuerte'] = fuzz.trapmf(senal_wifi.universe, [70, 90, 100, 100])

# Funciones de membresía para tiempo de respuesta (ms)
tiempo_respuesta['rapido'] = fuzz.trapmf(tiempo_respuesta.universe, [0, 0, 50, 100])
tiempo_respuesta['normal'] = fuzz.trimf(tiempo_respuesta.universe, [50, 150, 250])
tiempo_respuesta['lento'] = fuzz.trapmf(tiempo_respuesta.universe, [200, 300, 500, 500])

# Funciones de membresía para las variables de salida
for var in [problema_isp, problema_hardware, problema_dns, problema_wifi, congestion_red]:
    var['bajo'] = fuzz.trimf(var.universe, [0, 0, 50])
    var['medio'] = fuzz.trimf(var.universe, [0, 50, 100])
    var['alto'] = fuzz.trimf(var.universe, [50, 100, 100])

# Definición de reglas
reglas = [
    # Reglas para problema de ISP
    ctrl.Rule(perdida_paquetes['alta'] & velocidad_carga['baja'], problema_isp['alto']),
    ctrl.Rule(perdida_paquetes['moderada'] & velocidad_carga['baja'] & tiempo_respuesta['lento'], problema_isp['alto']),
    ctrl.Rule(perdida_paquetes['moderada'] & velocidad_carga['media'], problema_isp['medio']),
    ctrl.Rule(perdida_paquetes['ninguna'] & velocidad_carga['alta'], problema_isp['bajo']),
    
    # Reglas para problema de hardware
    ctrl.Rule(perdida_paquetes['moderada'] & velocidad_carga['baja'] & senal_wifi['fuerte'], problema_hardware['alto']),
    ctrl.Rule(perdida_paquetes['alta'] & tiempo_respuesta['lento'] & errores_dns['inexistente'], problema_hardware['alto']),
    ctrl.Rule(perdida_paquetes['ninguna'] & velocidad_carga['alta'], problema_hardware['bajo']),
    
    # Reglas para problema de DNS
    ctrl.Rule(errores_dns['frecuente'], problema_dns['alto']),
    ctrl.Rule(errores_dns['ocasional'] & velocidad_carga['media'], problema_dns['medio']),
    ctrl.Rule(errores_dns['inexistente'], problema_dns['bajo']),
    
    # Reglas para problema de WiFi
    ctrl.Rule(senal_wifi['debil'], problema_wifi['alto']),
    ctrl.Rule(senal_wifi['moderada'] & velocidad_carga['baja'], problema_wifi['medio']),
    ctrl.Rule(senal_wifi['fuerte'] & velocidad_carga['baja'], problema_wifi['bajo']),
    
    # Reglas para congestión de red
    ctrl.Rule(tiempo_respuesta['lento'] & velocidad_carga['baja'] & perdida_paquetes['moderada'], congestion_red['alto']),
    ctrl.Rule(tiempo_respuesta['normal'] & velocidad_carga['media'], congestion_red['medio']),
    ctrl.Rule(tiempo_respuesta['rapido'] & velocidad_carga['alta'], congestion_red['bajo'])
]

# Creación del sistema de control
sistema_control = ctrl.ControlSystem(reglas)
sistema = ctrl.ControlSystemSimulation(sistema_control)

def diagnosticar_red(vel_carga, perd_paquetes, err_dns, sen_wifi, t_respuesta):
    """
    Realiza el diagnóstico de la red basado en los síntomas ingresados.
    
    Args:
        vel_carga: Velocidad de carga en Mbps
        perd_paquetes: Pérdida de paquetes en porcentaje
        err_dns: Errores DNS por hora
        sen_wifi: Intensidad de señal WiFi en porcentaje
        t_respuesta: Tiempo de respuesta en ms
    
    Returns:
        Diccionario con diagnósticos y recomendaciones
    """
    # Asignar valores de entrada
    sistema.input['velocidad_carga'] = vel_carga
    sistema.input['perdida_paquetes'] = perd_paquetes
    sistema.input['errores_dns'] = err_dns
    sistema.input['senal_wifi'] = sen_wifi
    sistema.input['tiempo_respuesta'] = t_respuesta
    
    # Computar resultado
    try:
        sistema.compute()
        
        # Obtener valores de salida
        resultados = {
            'problema_isp': sistema.output['problema_isp'],
            'problema_hardware': sistema.output['problema_hardware'],
            'problema_dns': sistema.output['problema_dns'],
            'problema_wifi': sistema.output['problema_wifi'],
            'congestion_red': sistema.output['congestion_red']
        }
        
        # Determinar reglas activadas
        reglas_activadas = []
        for regla in reglas:
            nivel_activacion = regla.aggregate_firing(sistema)
            if nivel_activacion > 0:
                reglas_activadas.append({
                    'regla': str(regla),
                    'nivel': nivel_activacion
                })
        
        # Generar diagnóstico principal
        diagnostico_principal = max(resultados, key=resultados.get)
        nivel_diagnostico = resultados[diagnostico_principal]
        
        # Generar recomendaciones basadas en el diagnóstico
        recomendaciones = generar_recomendaciones(diagnostico_principal, nivel_diagnostico, resultados)
        
        return {
            'resultados': resultados,
            'diagnostico_principal': diagnostico_principal,
            'nivel_diagnostico': nivel_diagnostico,
            'reglas_activadas': reglas_activadas,
            'recomendaciones': recomendaciones
        }
    
    except Exception as e:
        return {
            'error': f"Error en el cálculo: {str(e)}",
            'recomendaciones': ["Contactar al soporte técnico para un diagnóstico manual."]
        }

def generar_recomendaciones(diagnostico, nivel, resultados):
    """
    Genera recomendaciones basadas en el diagnóstico principal.
    
    Args:
        diagnostico: Diagnóstico principal
        nivel: Nivel del diagnóstico
        resultados: Todos los resultados del diagnóstico
    
    Returns:
        Lista de recomendaciones
    """
    recomendaciones = []
    
    # Recomendaciones basadas en el diagnóstico principal
    if diagnostico == 'problema_isp':
        recomendaciones.append("Contactar al proveedor de servicios de Internet (ISP) para reportar el problema.")
        recomendaciones.append("Verificar si hay mantenimientos programados en la zona.")
        if nivel > 70:
            recomendaciones.append("Solicitar una revisión técnica por parte del ISP.")
            recomendaciones.append("Considerar temporalmente un proveedor de Internet alternativo para tareas críticas.")
        else:
            recomendaciones.append("Reiniciar el router principal y verificar la conexión.")
    
    elif diagnostico == 'problema_hardware':
        recomendaciones.append("Revisar el estado físico de los cables de red y conectores.")
        recomendaciones.append("Verificar el funcionamiento del router y switches.")
        if nivel > 70:
            recomendaciones.append("Reemplazar los cables o conectores dañados.")
            recomendaciones.append("Considerar la actualización de equipos de red obsoletos.")
        else:
            recomendaciones.append("Reiniciar los equipos de red y verificar su funcionamiento.")
    
    elif diagnostico == 'problema_dns':
        recomendaciones.append("Verificar la configuración de DNS en los equipos afectados.")
        recomendaciones.append("Considerar el uso de servidores DNS alternativos (como Google 8.8.8.8 o Cloudflare 1.1.1.1).")
        if nivel > 70:
            recomendaciones.append("Revisar si hay malware que esté afectando la resolución DNS.")
            recomendaciones.append("Verificar si hay conflictos con el firewall o software de seguridad.")
        else:
            recomendaciones.append("Limpiar la caché de DNS en los equipos afectados.")
    
    elif diagnostico == 'problema_wifi':
        recomendaciones.append("Verificar la ubicación del router WiFi y considerar su reposicionamiento.")
        recomendaciones.append("Revisar si hay interferencias de otros dispositivos electrónicos.")
        if nivel > 70:
            recomendaciones.append("Instalar repetidores WiFi en áreas con señal débil.")
            recomendaciones.append("Considerar la actualización a un router con mejor cobertura o tecnología más reciente.")
        else:
            recomendaciones.append("Cambiar el canal WiFi para reducir interferencias.")
    
    elif diagnostico == 'congestion_red':
        recomendaciones.append("Revisar si hay dispositivos o aplicaciones consumiendo excesivo ancho de banda.")
        recomendaciones.append("Implementar políticas de QoS (Quality of Service) para priorizar tráfico crítico.")
        if nivel > 70:
            recomendaciones.append("Segmentar la red para distribuir mejor el tráfico.")
            recomendaciones.append("Considerar aumentar el ancho de banda contratado con el ISP.")
        else:
            recomendaciones.append("Programar tareas de alto consumo de red en horarios de menor uso.")
    
    # Recomendaciones adicionales basadas en otros diagnósticos con valores significativos
    for diag, valor in resultados.items():
        if diag != diagnostico and valor > 50:
            if diag == 'problema_isp' and valor > 60:
                recomendaciones.append("Verificar el estado del servicio con el ISP como medida preventiva.")
            elif diag == 'problema_hardware' and valor > 60:
                recomendaciones.append("Realizar un mantenimiento preventivo de los equipos de red.")
            elif diag == 'problema_dns' and valor > 60:
                recomendaciones.append("Configurar servidores DNS alternativos como respaldo.")
            elif diag == 'problema_wifi' and valor > 60:
                recomendaciones.append("Evaluar la cobertura WiFi en todas las áreas de trabajo.")
            elif diag == 'congestion_red' and valor > 60:
                recomendaciones.append("Monitorear el uso de ancho de banda para identificar picos de consumo.")
    
    return recomendaciones

def mostrar_resultados(diagnostico):
    """
    Muestra los resultados del diagnóstico de forma legible.
    
    Args:
        diagnostico: Diccionario con los resultados del diagnóstico
    """
    if 'error' in diagnostico:
        print(f"ERROR: {diagnostico['error']}")
        print("Recomendaciones de emergencia:")
        for rec in diagnostico['recomendaciones']:
            print(f"- {rec}")
        return
    
    print("\n===== RESULTADOS DEL DIAGNÓSTICO =====")
    print("\nValoración de problemas (0-100):")
    for problema, valor in diagnostico['resultados'].items():
        print(f"- {problema.replace('_', ' ').title()}: {valor:.2f}")
    
    print(f"\nDiagnóstico principal: {diagnostico['diagnostico_principal'].replace('_', ' ').title()}")
    print(f"Nivel de certeza: {diagnostico['nivel_diagnostico']:.2f}/100")
    
    print("\nReglas activadas:")
    for i, regla in enumerate(diagnostico['reglas_activadas'], 1):
        print(f"{i}. {regla['regla']} (Nivel: {regla['nivel']:.2f})")
    
    print("\nRecomendaciones:")
    for i, rec in enumerate(diagnostico['recomendaciones'], 1):
        print(f"{i}. {rec}")

# Casos de prueba
def ejecutar_casos_prueba():
    """
    Ejecuta 5 casos de prueba predefinidos y muestra los resultados.
    """
    casos_prueba = [
        {
            'nombre': "Caso 1: Problema de ISP",
            'parametros': {
                'vel_carga': 1.5,         # Baja
                'perd_paquetes': 18,      # Alta
                'err_dns': 0.2,           # Inexistente
                'sen_wifi': 85,           # Fuerte
                't_respuesta': 280        # Lento
            }
        },
        {
            'nombre': "Caso 2: Problema de DNS",
            'parametros': {
                'vel_carga': 5,           # Media
                'perd_paquetes': 3,       # Moderada
                'err_dns': 7,             # Frecuente
                'sen_wifi': 75,           # Fuerte
                't_respuesta': 150        # Normal
            }
        },
        {
            'nombre': "Caso 3: Problema de WiFi",
            'parametros': {
                'vel_carga': 2.8,         # Baja-Media
                'perd_paquetes': 5,       # Moderada
                'err_dns': 0.1,           # Inexistente
                'sen_wifi': 25,           # Débil
                't_respuesta': 180        # Normal
            }
        },
        {
            'nombre': "Caso 4: Problema de Hardware",
            'parametros': {
                'vel_carga': 1.2,         # Baja
                'perd_paquetes': 12,      # Moderada
                'err_dns': 0.3,           # Inexistente
                'sen_wifi': 90,           # Fuerte
                't_respuesta': 320        # Lento
            }
        },
        {
            'nombre': "Caso 5: Congestión de Red",
            'parametros': {
                'vel_carga': 2.5,         # Baja-Media
                'perd_paquetes': 8,       # Moderada
                'err_dns': 1,             # Ocasional
                'sen_wifi': 65,           # Moderada
                't_respuesta': 290        # Lento
            }
        }
    ]
    
    for i, caso in enumerate(casos_prueba, 1):
        print(f"\n\n{'='*50}")
        print(f"CASO DE PRUEBA #{i}: {caso['nombre']}")
        print(f"{'='*50}")
        
        print("\nSíntomas ingresados:")
        for param, valor in caso['parametros'].items():
            nombre_param = {
                'vel_carga': 'Velocidad de carga (Mbps)',
                'perd_paquetes': 'Pérdida de paquetes (%)',
                'err_dns': 'Errores DNS (por hora)',
                'sen_wifi': 'Señal WiFi (%)',
                't_respuesta': 'Tiempo de respuesta (ms)'
            }
            print(f"- {nombre_param[param]}: {valor}")
        
        # Realizar diagnóstico
        diagnostico = diagnosticar_red(**caso['parametros'])
        
        # Mostrar resultados
        mostrar_resultados(diagnostico)

# Ejecutar los casos de prueba
if __name__ == "__main__":
    ejecutar_casos_prueba()
    
    # Opcional: Visualizar las funciones de membresía
    plt.figure(figsize=(12, 10))
    
    plt.subplot(3, 2, 1)
    velocidad_carga.view()
    plt.title('Velocidad de Carga (Mbps)')
    
    plt.subplot(3, 2, 2)
    perdida_paquetes.view()
    plt.title('Pérdida de Paquetes (%)')
    
    plt.subplot(3, 2, 3)
    errores_dns.view()
    plt.title('Errores DNS (por hora)')
    
    plt.subplot(3, 2, 4)
    senal_wifi.view()
    plt.title('Señal WiFi (%)')
    
    plt.subplot(3, 2, 5)
    tiempo_respuesta.view()
    plt.title('Tiempo de Respuesta (ms)')
    
    plt.tight_layout()
    plt.show()
