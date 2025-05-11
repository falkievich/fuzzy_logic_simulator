"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, AlertTriangle, Info, Wifi, Server, Database, Network, Activity } from "lucide-react"
import { fuzzyInference, type DiagnosisParams, type DiagnosisResult } from "@/lib/fuzzy-inference"
import { diagnosticNames } from "@/lib/fuzzy-rules"

// Casos de prueba predefinidos
const FALLBACK_TEST_CASES = [
  {
    nombre: "Caso 1: Falla en Router",
    parametros: {
      velocidad_carga: 1.5,
      perdida_paquetes: 18,
      errores_dns: 0.2,
      senal_wifi: 85,
      conexion: 40,
    },
  },
  {
    nombre: "Caso 2: Problema de DNS",
    parametros: {
      velocidad_carga: 5,
      perdida_paquetes: 3,
      errores_dns: 7,
      senal_wifi: 75,
      conexion: 60,
    },
  },
  {
    nombre: "Caso 3: Señal Wi-Fi Deficiente",
    parametros: {
      velocidad_carga: 2.8,
      perdida_paquetes: 5,
      errores_dns: 0.1,
      senal_wifi: 25,
      conexion: 50,
    },
  },
  {
    nombre: "Caso 4: Falla del ISP",
    parametros: {
      velocidad_carga: 1.2,
      perdida_paquetes: 12,
      errores_dns: 0.3,
      senal_wifi: 90,
      conexion: 20,
    },
  },
  {
    nombre: "Caso 5: Congestión de Red Local",
    parametros: {
      velocidad_carga: 2.5,
      perdida_paquetes: 8,
      errores_dns: 1,
      senal_wifi: 65,
      conexion: 70,
    },
  },
]

// Interfaces para los tipos de datos
interface TestCase {
  nombre: string
  parametros: DiagnosisParams
}

export default function Home() {
  // Estado para los parámetros de diagnóstico
  const [params, setParams] = useState<DiagnosisParams>({
    velocidad_carga: 5,
    perdida_paquetes: 5,
    errores_dns: 1,
    senal_wifi: 70,
    conexion: 80,
  })

  // Estado para los resultados del diagnóstico
  const [result, setResult] = useState<DiagnosisResult | null>(null)

  // Estado para los casos de prueba
  const [testCases, setTestCases] = useState<TestCase[]>(FALLBACK_TEST_CASES)

  // Estado para el estado de carga
  const [loading, setLoading] = useState(false)

  // Estado para errores
  const [error, setError] = useState<string | null>(null)

  // Cargar casos de prueba al iniciar
  useEffect(() => {
    setTestCases(FALLBACK_TEST_CASES)
  }, [])

  // Función para realizar diagnóstico usando el motor de inferencia difusa
  const performDiagnosis = async () => {
    setLoading(true)
    setError(null)

    try {
      // Pequeña pausa para simular procesamiento
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Ejecutar el motor de inferencia difusa
      const diagnosisResult = fuzzyInference(params)

      setResult(diagnosisResult)
    } catch (err) {
      console.error("Error performing diagnosis:", err)
      setError(`Error en el diagnóstico: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  // Función para cargar un caso de prueba
  const loadTestCase = (testCase: TestCase) => {
    setParams(testCase.parametros)
  }

  // Función para formatear el nombre del diagnóstico
  const formatDiagnosisName = (name: string) => {
    return (
      diagnosticNames[name as keyof typeof diagnosticNames] ||
      name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    )
  }

  // Función para obtener el icono según el tipo de diagnóstico
  const getDiagnosisIcon = (diagnosisType: string) => {
    switch (diagnosisType) {
      case "falla_isp":
        return <Server className="h-5 w-5" />
      case "falla_router":
        return <Database className="h-5 w-5" />
      case "problema_dns":
        return <Network className="h-5 w-5" />
      case "senal_wifi_deficiente":
        return <Wifi className="h-5 w-5" />
      case "congestion_red_local":
      case "saturacion_servidor_interno":
        return <Activity className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  // Función para obtener el color según el nivel de diagnóstico
  const getDiagnosisColor = (level: number) => {
    if (level < 30) return "bg-green-500"
    if (level < 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Sistema Experto de Diagnóstico de Red</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="diagnosis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diagnosis">Diagnóstico</TabsTrigger>
          <TabsTrigger value="test-cases">Casos de Prueba</TabsTrigger>
          <TabsTrigger value="about">Acerca del Sistema</TabsTrigger>
        </TabsList>

        {/* Pestaña de Diagnóstico */}
        <TabsContent value="diagnosis">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Formulario de entrada */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Síntomas de la Red</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="conexion">Estado de Conexión (%)</Label>
                    <span className="text-sm">{params.conexion.toFixed(0)}%</span>
                  </div>
                  <Slider
                    id="conexion"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.conexion]}
                    onValueChange={(value) => setParams({ ...params, conexion: value[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Inexistente (0-30)</span>
                    <span>Intermitente (20-80)</span>
                    <span>Estable (70-100)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="velocidad_carga">Velocidad de Carga (Mbps)</Label>
                    <span className="text-sm">{params.velocidad_carga.toFixed(1)} Mbps</span>
                  </div>
                  <Slider
                    id="velocidad_carga"
                    min={0}
                    max={10}
                    step={0.1}
                    value={[params.velocidad_carga]}
                    onValueChange={(value) => setParams({ ...params, velocidad_carga: value[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Baja (0-3)</span>
                    <span>Media (2-7)</span>
                    <span>Alta (6+)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="perdida_paquetes">Pérdida de Paquetes (%)</Label>
                    <span className="text-sm">{params.perdida_paquetes.toFixed(1)}%</span>
                  </div>
                  <Slider
                    id="perdida_paquetes"
                    min={0}
                    max={30}
                    step={0.1}
                    value={[params.perdida_paquetes]}
                    onValueChange={(value) => setParams({ ...params, perdida_paquetes: value[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Ninguna (0)</span>
                    <span>Moderada (1-15)</span>
                    <span>Alta (15+)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="errores_dns">Errores DNS (por hora)</Label>
                    <span className="text-sm">{params.errores_dns.toFixed(1)}</span>
                  </div>
                  <Slider
                    id="errores_dns"
                    min={0}
                    max={10}
                    step={0.1}
                    value={[params.errores_dns]}
                    onValueChange={(value) => setParams({ ...params, errores_dns: value[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Inexistente (0)</span>
                    <span>Ocasional (1-3)</span>
                    <span>Frecuente (3+)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="senal_wifi">Señal WiFi (%)</Label>
                    <span className="text-sm">{params.senal_wifi.toFixed(0)}%</span>
                  </div>
                  <Slider
                    id="senal_wifi"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.senal_wifi]}
                    onValueChange={(value) => setParams({ ...params, senal_wifi: value[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Débil (0-50)</span>
                    <span>Moderada (30-80)</span>
                    <span>Fuerte (70-100)</span>
                  </div>
                </div>

                <Button onClick={performDiagnosis} className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Diagnosticando...
                    </>
                  ) : (
                    "Realizar Diagnóstico"
                  )}
                </Button>
              </div>
            </Card>

            {/* Resultados del diagnóstico */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Resultados del Diagnóstico</h2>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Analizando síntomas...</p>
                </div>
              ) : !result ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Info className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Ingresa los síntomas y haz clic en "Realizar Diagnóstico" para obtener resultados.
                  </p>
                </div>
              ) : result.error ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error en el diagnóstico</AlertTitle>
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  {/* Diagnóstico principal */}
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {getDiagnosisIcon(result.diagnostico_principal)}
                      <h3 className="text-lg font-medium">{formatDiagnosisName(result.diagnostico_principal)}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Nivel de certeza:</span>
                        <span className="font-medium">{result.nivel_diagnostico.toFixed(1)}%</span>
                      </div>
                      <Progress
                        value={result.nivel_diagnostico}
                        className={getDiagnosisColor(result.nivel_diagnostico)}
                      />
                    </div>
                  </div>

                  {/* Todos los resultados */}
                  <div>
                    <h3 className="text-md font-medium mb-3">Valoración de todos los problemas:</h3>
                    <div className="space-y-3">
                      {Object.entries(result.resultados).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-1">
                              {getDiagnosisIcon(key)}
                              {formatDiagnosisName(key)}
                            </span>
                            <span>{value.toFixed(1)}%</span>
                          </div>
                          <Progress value={value} className={getDiagnosisColor(value)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recomendaciones */}
                  <div>
                    <h3 className="text-md font-medium mb-2">Recomendaciones:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.recomendaciones.map((rec, index) => (
                        <li key={index} className="text-sm">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Reglas activadas */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="rules">
                      <AccordionTrigger>Reglas activadas</AccordionTrigger>
                      <AccordionContent>
                        <div className="max-h-40 overflow-y-auto text-sm">
                          {result.reglas_activadas.map((rule, index) => (
                            <div key={index} className="py-1 border-b border-muted last:border-0">
                              <div className="flex justify-between">
                                <span className="text-xs">{rule.regla}</span>
                                <span className="text-xs font-medium">{rule.nivel.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña de Casos de Prueba */}
        <TabsContent value="test-cases">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Casos de Prueba Predefinidos</h2>

            {testCases.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-muted-foreground">Cargando casos de prueba...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Selecciona un caso de prueba para cargar automáticamente los parámetros en el formulario de
                  diagnóstico.
                </p>

                <Table>
                  <TableCaption>Casos de prueba predefinidos para el sistema experto</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Caso</TableHead>
                      <TableHead>Conexión (%)</TableHead>
                      <TableHead>Velocidad (Mbps)</TableHead>
                      <TableHead>Pérdida (%)</TableHead>
                      <TableHead>Errores DNS</TableHead>
                      <TableHead>Señal WiFi (%)</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testCases.map((testCase, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{testCase.nombre}</TableCell>
                        <TableCell>{testCase.parametros.conexion}</TableCell>
                        <TableCell>{testCase.parametros.velocidad_carga}</TableCell>
                        <TableCell>{testCase.parametros.perdida_paquetes}</TableCell>
                        <TableCell>{testCase.parametros.errores_dns}</TableCell>
                        <TableCell>{testCase.parametros.senal_wifi}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => loadTestCase(testCase)}>
                            Cargar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Pestaña de Acerca del Sistema */}
        <TabsContent value="about">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Acerca del Sistema Experto</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Sistema Experto Basado en Lógica Difusa</h3>
                <p className="text-sm text-muted-foreground">
                  Este sistema utiliza lógica difusa para diagnosticar problemas de red en base a síntomas observados. A
                  diferencia de la lógica booleana tradicional, la lógica difusa permite manejar conceptos imprecisos
                  como "velocidad lenta" o "señal débil" de manera más natural y cercana al razonamiento humano.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Variables Lingüísticas</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  El sistema utiliza las siguientes variables lingüísticas:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>
                    <strong>Entradas (síntomas):</strong> Conexión, Velocidad de carga, Pérdida de paquetes, Errores
                    DNS, Señal Wi-Fi
                  </li>
                  <li>
                    <strong>Salidas (causas):</strong> Falla en Router, Falla del ISP, Problema de DNS, Señal Wi-Fi
                    Deficiente, Congestión de Red Local, Saturación del Servidor Interno, No hay Fallo Detectado
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Funcionamiento</h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>
                    <strong>Fuzzificación:</strong> Convierte los valores de entrada en grados de pertenencia a
                    conjuntos difusos usando funciones de membresía triangulares.
                  </li>
                  <li>
                    <strong>Evaluación de reglas:</strong> Aplica reglas difusas del tipo "SI-ENTONCES" para determinar
                    posibles causas, usando operadores MIN para AND y MAX para OR.
                  </li>
                  <li>
                    <strong>Agregación:</strong> Combina los resultados de todas las reglas activadas usando el método
                    máximo.
                  </li>
                  <li>
                    <strong>Defuzzificación:</strong> Convierte el resultado difuso en un valor numérico mediante el
                    método del centroide.
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Base de Conocimiento</h3>
                <p className="text-sm text-muted-foreground">
                  El sistema contiene 31 reglas difusas que representan el conocimiento experto sobre diagnóstico de
                  redes. Estas reglas relacionan los síntomas observados con posibles causas, permitiendo un diagnóstico
                  preciso incluso con información incompleta o imprecisa.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
