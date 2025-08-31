'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface StudentPanelProps {
  user: any
  onLogout: () => void
}

export default function StudentPanel({ user, onLogout }: StudentPanelProps) {
  console.log('🎓 StudentPanel renderizado con usuario:', user)
  
  const [academicInfo, setAcademicInfo] = useState<any>(null)
  const [schedule, setSchedule] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    fetchAcademicInfo()
    fetchSchedule()
  }, [])

  const fetchAcademicInfo = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/student/academic-info', {
        withCredentials: true
      })
      setAcademicInfo(response.data.data)
    } catch (error) {
      console.error('❌ Error fetching academic info:', error)
    }
  }

  const fetchSchedule = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/student/schedule', {
        withCredentials: true
      })
      setSchedule(response.data.data)
      console.log('📅 Horario recibido:', response.data.data)
    } catch (error) {
      console.error('❌ Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderAcademicInfo = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold tracking-tight">Información Académica</h3>
      {academicInfo ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                Datos Personales
              </CardTitle>
              <CardDescription>Información personal del estudiante</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-muted-foreground">Nombre:</span>
                <span className="font-semibold">{academicInfo.estudiante.nombre} {academicInfo.estudiante.apellido}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-muted-foreground">Email:</span>
                <span className="font-semibold">{academicInfo.estudiante.email}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-muted-foreground">Rol:</span>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  Estudiante
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎓</span>
                Grados Inscritos
              </CardTitle>
              <CardDescription>Grados en los que estás inscrito</CardDescription>
            </CardHeader>
            <CardContent>
              {academicInfo.grados && academicInfo.grados.length > 0 ? (
                <div className="space-y-3">
                  {academicInfo.grados.map((grade: any) => (
                    <div key={grade.id} className="p-4 bg-muted/50 rounded-lg border">
                      <h4 className="font-semibold text-lg text-primary">{grade.nombre}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{grade.descripcion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📚</div>
                  <p className="text-muted-foreground">No estás inscrito en ningún grado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-2">⚠️</div>
              <p className="text-yellow-800">No se pudo cargar la información académica</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderSchedule = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold tracking-tight">Horario</h3>
      {schedule ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              Tu Horario de Clases
            </CardTitle>
            <CardDescription>Organiza tu tiempo de estudio</CardDescription>
          </CardHeader>
          <CardContent>
            {schedule.horario && schedule.horario.length > 0 ? (
              <div className="space-y-6">
                {schedule.horario.map((day: any, index: number) => (
                  <div key={index} className="space-y-3">
                    <h5 className="text-lg font-semibold text-primary border-b pb-2">{day.dia}</h5>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Materia</TableHead>
                          <TableHead>Hora</TableHead>
                          <TableHead>Profesor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {day.materias.map((materia: any, mIndex: number) => (
                          <TableRow key={mIndex}>
                            <TableCell className="font-medium">{materia.materia}</TableCell>
                            <TableCell className="text-muted-foreground">{materia.hora}</TableCell>
                            <TableCell className="text-primary">{materia.profesor}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📚</div>
                <p className="text-muted-foreground">No hay horario disponible</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-2">⚠️</div>
              <p className="text-yellow-800">No se pudo cargar el horario</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Cargando información...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            Panel del Estudiante
          </CardTitle>
          <CardDescription>
            Gestiona tu información académica y horario de clases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Información Académica</TabsTrigger>
              <TabsTrigger value="schedule">Horario</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="mt-6">
              {renderAcademicInfo()}
            </TabsContent>
            <TabsContent value="schedule" className="mt-6">
              {renderSchedule()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
