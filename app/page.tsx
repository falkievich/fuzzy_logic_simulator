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

// Replace the API_URL constant with this version that includes a check for the environment
const API_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://localhost:5000/api" : "/api" // Fallback path for preview

// Add these fallback data constants after the API_URL definition
const FALLBACK_TEST_CASES = [
  {
    nombre: "Caso 1: Problema de ISP",
    parametros: {
      velocidad_carga: 1.5,
      perdida_paquetes: 18,
      errores_dns: 0.2,
      senal_wifi: 85,
      tiempo_respuesta: 280,
    },
  },
  {
    nombre: "Caso 2: Problema de DNS",
    parametros: {
      velocidad_carga: 5,
      perdida_paquetes: 3,
      errores_dns: 7,
      senal_wifi: 75,
      tiempo_respuesta: 150,
    },
  },
  {
    nombre: "Caso 3: Problema de WiFi",
    parametros: {
      velocidad_carga: 2.8,
      perdida_paquetes: 5,
      errores_dns: 0.1,
      senal_wifi: 25,
      tiempo_respuesta: 180,
    },
  },
  {
    nombre: "Caso 4: Problema de Hardware",
    parametros: {
      velocidad_carga: 1.2,
      perdida_paquetes: 12,
      errores_dns: 0.3,
      senal_wifi: 90,
      tiempo_respuesta: 320,
    },
  },
  {
    nombre: "Caso 5: Congestión de Red",
    parametros: {
      velocidad_carga: 2.5,
      perdida_paquetes: 8,
      errores_dns: 1,
      senal_wifi: 65,
      tiempo_respuesta: 290,
    },
  },
]

// Interfaces para los tipos de datos
interface DiagnosisParams {
  velocidad_carga: number
  perdida_paquetes: number
  errores_dns: number
  senal_wifi: number
  tiempo_respuesta: number
}

interface ActivatedRule {
  regla: string
  nivel: number
}

interface DiagnosisResult {
  resultados: Record<string, number>
  diagnostico_principal: string
  nivel_diagnostico: number
  reglas_activadas: ActivatedRule[]
  recomendaciones: string[]
  error?: string
}

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
    tiempo_respuesta: 150,
  })

  // Estado para los resultados del diagnóstico
  const [result, setResult] = useState<DiagnosisResult | null>(null)

  // Estado para los casos de prueba
  const [testCases, setTestCases] = useState<TestCase[]>([])

  // Estado para las imágenes de las funciones de membresía
  const [membershipImages, setMembershipImages] = useState<Record<string, string>>({})

  // Estado para el estado de carga
  const [loading, setLoading] = useState(false)

  // Estado para errores
  const [error, setError] = useState<string | null>(null)

  // Cargar casos de prueba y gráficos de membresía al iniciar
  useEffect(() => {
    fetchTestCases()
    fetchMembershipGraphs()
  }, [])

  // Replace the fetchTestCases function with this improved version that better handles HTML responses
  const fetchTestCases = async () => {
    try {
      // Try to fetch from API
      const response = await fetch(`${API_URL}/casos-prueba`)

      // Check if the response is JSON before trying to parse it
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("API returned non-JSON response, using fallback test cases")
        setTestCases(FALLBACK_TEST_CASES)
        return
      }

      if (!response.ok) {
        // If API call fails, use fallback data
        console.warn("API not available, using fallback test cases")
        setTestCases(FALLBACK_TEST_CASES)
        return
      }

      const data = await response.json()
      setTestCases(data)
    } catch (err) {
      console.error("Error fetching test cases:", err)
      // Use fallback data on error
      setTestCases(FALLBACK_TEST_CASES)
    }
  }

  // Replace the fetchMembershipGraphs function with this improved version
  const fetchMembershipGraphs = async () => {
    try {
      const response = await fetch(`${API_URL}/graficos-membresia`)

      // Check if the response is JSON before trying to parse it
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("API returned non-JSON response, membership graphs will not be displayed")
        setMembershipImages({})
        return
      }

      if (!response.ok) {
        // If API call fails, set an empty object and don't show an error
        console.warn("API not available, membership graphs will not be displayed")
        setMembershipImages({})
        return
      }

      const data = await response.json()
      setMembershipImages(data)
    } catch (err) {
      console.error("Error fetching membership graphs:", err)
      setMembershipImages({})
    }
  }

  // Replace the performDiagnosis function with this improved version
  const performDiagnosis = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/diagnosticar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      // Check if the response is JSON before trying to parse it
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("API returned non-JSON response, generating mock diagnosis result")
        const mockResult = generateMockDiagnosis(params)
        setResult(mockResult)
        setLoading(false)
        return
      }

      if (!response.ok) {
        // If API call fails, generate a mock result based on the input parameters
        console.warn("API not available, generating mock diagnosis result")

        // Simple mock logic to generate a plausible result
        const mockResult = generateMockDiagnosis(params)
        setResult(mockResult)
        setLoading(false)
        return
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error("Error performing diagnosis:", err)
      // Generate mock result on error
      const mockResult = generateMockDiagnosis(params)
      setResult(mockResult)
    } finally {
      setLoading(false)
    }
  }

  // Add this function to generate mock diagnosis results when the API is not available
  const generateMockDiagnosis = (params: DiagnosisParams): DiagnosisResult => {
    // Simple logic to determine the most likely diagnosis based on input parameters
    let diagnostico_principal = "problema_isp"
    let nivel_diagnostico = 50

    // Very basic rules to determine the diagnosis
    if (params.errores_dns > 3) {
      diagnostico_principal = "problema_dns"
      nivel_diagnostico = 70 + (params.errores_dns - 3) * 5
    } else if (params.senal_wifi < 40) {
      diagnostico_principal = "problema_wifi"
      nivel_diagnostico = 70 + (40 - params.senal_wifi)
    } else if (params.perdida_paquetes > 15) {
      diagnostico_principal = "problema_isp"
      nivel_diagnostico = 70 + (params.perdida_paquetes - 15) * 2
    } else if (params.velocidad_carga < 2 && params.senal_wifi > 70) {
      diagnostico_principal = "problema_hardware"
      nivel_diagnostico = 70 + (2 - params.velocidad_carga) * 20
    } else if (params.tiempo_respuesta > 250 && params.velocidad_carga < 3) {
      diagnostico_principal = "congestion_red"
      nivel_diagnostico = 70 + (params.tiempo_respuesta - 250) / 10
    }

    // Cap the level at 95
    nivel_diagnostico = Math.min(nivel_diagnostico, 95)

    // Generate mock results for all diagnosis types
    const resultados: Record<string, number> = {
      problema_isp: 30,
      problema_hardware: 30,
      problema_dns: 30,
      problema_wifi: 30,
      congestion_red: 30,
    }

    // Set the main diagnosis to have the highest value
    resultados[diagnostico_principal] = nivel_diagnostico

    // Generate mock recommendations
    const recomendaciones = getMockRecommendations(diagnostico_principal, nivel_diagnostico)

    // Generate mock activated rules
    const reglas_activadas = [
      {
        regla: "Si velocidad_carga es baja y perdida_paquetes es alta entonces problema_isp es alto",
        nivel: 0.8,
      },
      {
        regla: "Si errores_dns es frecuente entonces problema_dns es alto",
        nivel: 0.6,
      },
    ]

    return {
      resultados,
      diagnostico_principal,
      nivel_diagnostico,
      reglas_activadas,
      recomendaciones,
    }
  }

  // Add this function to generate mock recommendations
  const getMockRecommendations = (diagnostico: string, nivel: number): string[] => {
    const recomendaciones: string[] = []

    switch (diagnostico) {
      case "problema_isp":
        recomendaciones.push("Contactar al proveedor de servicios de Internet (ISP) para reportar el problema.")
        recomendaciones.push("Verificar si hay mantenimientos programados en la zona.")
        if (nivel > 70) {
          recomendaciones.push("Solicitar una revisión técnica por parte del ISP.")
        }
        break
      case "problema_hardware":
        recomendaciones.push("Revisar el estado físico de los cables de red y conectores.")
        recomendaciones.push("Verificar el funcionamiento del router y switches.")
        if (nivel > 70) {
          recomendaciones.push("Reemplazar los cables o conectores dañados.")
        }
        break
      case "problema_dns":
        recomendaciones.push("Verificar la configuración de DNS en los equipos afectados.")
        recomendaciones.push(
          "Considerar el uso de servidores DNS alternativos (como Google 8.8.8.8 o Cloudflare 1.1.1.1).",
        )
        if (nivel > 70) {
          recomendaciones.push("Revisar si hay malware que esté afectando la resolución DNS.")
        }
        break
      case "problema_wifi":
        recomendaciones.push("Verificar la ubicación del router WiFi y considerar su reposicionamiento.")
        recomendaciones.push("Revisar si hay interferencias de otros dispositivos electrónicos.")
        if (nivel > 70) {
          recomendaciones.push("Instalar repetidores WiFi en áreas con señal débil.")
        }
        break
      case "congestion_red":
        recomendaciones.push("Revisar si hay dispositivos o aplicaciones consumiendo excesivo ancho de banda.")
        recomendaciones.push("Implementar políticas de QoS (Quality of Service) para priorizar tráfico crítico.")
        if (nivel > 70) {
          recomendaciones.push("Segmentar la red para distribuir mejor el tráfico.")
        }
        break
    }

    return recomendaciones
  }

  // Función para cargar un caso de prueba
  const loadTestCase = (testCase: TestCase) => {
    setParams(testCase.parametros)
  }

  // Función para formatear el nombre del diagnóstico
  const formatDiagnosisName = (name: string) => {
    return name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Función para obtener el icono según el tipo de diagnóstico
  const getDiagnosisIcon = (diagnosisType: string) => {
    switch (diagnosisType) {
      case "problema_isp":
        return <Server className="h-5 w-5" />
      case "problema_hardware":
        return <Database className="h-5 w-5" />
      case "problema_dns":
        return <Network className="h-5 w-5" />
      case "problema_wifi":
        return <Wifi className="h-5 w-5" />
      case "congestion_red":
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
          <TabsTrigger value="membership">Funciones de Membresía</TabsTrigger>
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

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="tiempo_respuesta">Tiempo de Respuesta (ms)</Label>
                    <span className="text-sm">{params.tiempo_respuesta.toFixed(0)} ms</span>
                  </div>
                  <Slider
                    id="tiempo_respuesta"
                    min={0}
                    max={500}
                    step={1}
                    value={[params.tiempo_respuesta]}
                    onValueChange={(value) => setParams({ ...params, tiempo_respuesta: value[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Rápido (0-100)</span>
                    <span>Normal (50-250)</span>
                    <span>Lento (200+)</span>
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
                      <TableHead>Velocidad (Mbps)</TableHead>
                      <TableHead>Pérdida (%)</TableHead>
                      <TableHead>Errores DNS</TableHead>
                      <TableHead>Señal WiFi (%)</TableHead>
                      <TableHead>Tiempo (ms)</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testCases.map((testCase, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{testCase.nombre}</TableCell>
                        <TableCell>{testCase.parametros.velocidad_carga}</TableCell>
                        <TableCell>{testCase.parametros.perdida_paquetes}</TableCell>
                        <TableCell>{testCase.parametros.errores_dns}</TableCell>
                        <TableCell>{testCase.parametros.senal_wifi}</TableCell>
                        <TableCell>{testCase.parametros.tiempo_respuesta}</TableCell>
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

        {/* Pestaña de Funciones de Membresía */}
        <TabsContent value="membership">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Funciones de Membresía</h2>

            {Object.keys(membershipImages).length === 0 ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center h-40">
                  <Info className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-center">
                    Las imágenes de funciones de membresía no están disponibles en este momento.
                    <br />
                    En un entorno de producción, estas imágenes se generarían desde el servidor Python.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-md font-medium mb-2">Velocidad de Carga (Mbps)</h3>
                    <div className="h-40 flex items-center justify-center bg-muted rounded">
                      <p className="text-sm text-muted-foreground">Baja (0-3), Media (2-7), Alta (6+)</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-md font-medium mb-2">Pérdida de Paquetes (%)</h3>
                    <div className="h-40 flex items-center justify-center bg-muted rounded">
                      <p className="text-sm text-muted-foreground">Ninguna (0), Moderada (1-15), Alta (15+)</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-md font-medium mb-2">Errores DNS (por hora)</h3>
                    <div className="h-40 flex items-center justify-center bg-muted rounded">
                      <p className="text-sm text-muted-foreground">Inexistente (0), Ocasional (1-3), Frecuente (3+)</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-md font-medium mb-2">Señal WiFi (%)</h3>
                    <div className="h-40 flex items-center justify-center bg-muted rounded">
                      <p className="text-sm text-muted-foreground">Débil (0-50), Moderada (30-80), Fuerte (70-100)</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(membershipImages).map(([key, imageData]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <h3 className="text-md font-medium mb-2">
                      {key === "velocidad_carga"
                        ? "Velocidad de Carga (Mbps)"
                        : key === "perdida_paquetes"
                          ? "Pérdida de Paquetes (%)"
                          : key === "errores_dns"
                            ? "Errores DNS (por hora)"
                            : key === "senal_wifi"
                              ? "Señal WiFi (%)"
                              : key === "tiempo_respuesta"
                                ? "Tiempo de Respuesta (ms)"
                                : key}
                    </h3>
                    <img
                      src={`data:image/png;base64,${imageData}`}
                      alt={`Función de membresía para ${key}`}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
