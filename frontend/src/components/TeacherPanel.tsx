'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface TeacherPanelProps {
  user: any
  onLogout: () => void
}

export default function TeacherPanel({ user, onLogout }: TeacherPanelProps) {
  console.log('👨‍🏫 TeacherPanel renderizado con usuario:', user)
  
  const [mySubjects, setMySubjects] = useState<any>(null)
  const [classSummary, setClassSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('subjects')

  useEffect(() => {
    fetchMySubjects()
    fetchClassSummary()
  }, [])

  const fetchMySubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/teacher/subjects', {
        withCredentials: true
      })
      setMySubjects(response.data.data)
      console.log('📚 Materias recibidas:', response.data.data)
      console.log('👨‍🏫 Profesor:', response.data.data.profesor)
      console.log('📖 Materias:', response.data.data.materias)
    } catch (error) {
      console.error('❌ Error fetching subjects:', error)
    }
  }

  const fetchClassSummary = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/teacher/summary', {
        withCredentials: true
      })
      setClassSummary(response.data.data)
      console.log('📊 Resumen recibido:', response.data.data)
      console.log('👨‍🏫 Profesor:', response.data.data.profesor)
      console.log('📈 Estadísticas:', response.data.data.estadisticas)
      console.log('📖 Materias:', response.data.data.materias)
    } catch (error) {
      console.error('❌ Error fetching summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderSubjects = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Mis Materias</h3>
      {mySubjects ? (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Profesor</h4>
            <p className="text-blue-700">
              {mySubjects.profesor.nombre} {mySubjects.profesor.apellido}
            </p>
            <p className="text-blue-600 text-sm">{mySubjects.profesor.email}</p>
          </div>

          <div className="grid gap-4">
            {mySubjects.materias && mySubjects.materias.length > 0 ? (
              mySubjects.materias.map((subject: any) => (
                <div key={subject.id} className="bg-white p-6 rounded-lg shadow border">
                  <h4 className="font-semibold text-lg mb-3 text-blue-600">{subject.nombre}</h4>
                  <p className="text-gray-600 mb-4">{subject.descripcion}</p>
                  
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Estado:</span> Activa
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-medium">Funcionalidad:</span> Información básica disponible
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-center">No tienes materias asignadas</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No se pudo cargar la información de materias</p>
        </div>
      )}
    </div>
  )

  const renderSummary = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Resumen de Clases</h3>
      {classSummary ? (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 text-lg mb-4">
              {classSummary.profesor}
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {classSummary.estadisticas.totalMaterias}
                </div>
                <div className="text-sm text-green-700">Total Materias</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {classSummary.estadisticas.totalGrados}
                </div>
                <div className="text-sm text-green-700">Total Grados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {classSummary.estadisticas.totalEstudiantes}
                </div>
                <div className="text-sm text-green-700">Total Estudiantes</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="font-medium text-gray-800">Detalle por Materia:</h5>
            {classSummary.materias && classSummary.materias.length > 0 ? (
              classSummary.materias.map((subject: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow border">
                  <h6 className="font-medium text-gray-700 mb-2">{subject.nombre}</h6>
                  <p className="text-sm text-gray-600 mb-3">{subject.descripcion}</p>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Estado:</span> Activa
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-medium">Funcionalidad:</span> Información básica disponible
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-center">No hay materias disponibles</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No se pudo cargar el resumen de clases</p>
        </div>
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
      <div className="bg-white rounded-lg shadow-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'subjects', label: 'Mis Materias' },
              { id: 'summary', label: 'Resumen de Clases' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'subjects' && renderSubjects()}
          {activeTab === 'summary' && renderSummary()}
        </div>
      </div>
    </div>
  )
}
