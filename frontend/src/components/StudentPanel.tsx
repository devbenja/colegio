'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

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
      <h3 className="text-xl font-semibold">Información Académica</h3>
      {academicInfo ? (
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-4">Datos Personales</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Nombre:</span> {academicInfo.estudiante.nombre} {academicInfo.estudiante.apellido}</p>
                <p><span className="font-medium">Email:</span> {academicInfo.estudiante.email}</p>
                <p><span className="font-medium">Rol:</span> Estudiante</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Grados Inscritos</h4>
              {academicInfo.grados && academicInfo.grados.length > 0 ? (
                <div className="space-y-2">
                  {academicInfo.grados.map((grade: any) => (
                    <div key={grade.id} className="p-3 bg-blue-50 rounded border">
                      <p className="font-medium">{grade.nombre}</p>
                      <p className="text-sm text-gray-600">{grade.descripcion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No estás inscrito en ningún grado</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No se pudo cargar la información académica</p>
        </div>
      )}
    </div>
  )

  const renderSchedule = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Horario</h3>
      {schedule ? (
        <div className="bg-white p-6 rounded-lg shadow border">
          <p className="text-gray-600 mb-4">Tu horario de clases</p>
          {schedule.horario && schedule.horario.length > 0 ? (
            <div className="space-y-4">
              {schedule.horario.map((day: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <h5 className="font-semibold text-lg mb-3 text-blue-600">{day.dia}</h5>
                  <div className="space-y-2">
                    {day.materias.map((materia: any, mIndex: number) => (
                      <div key={mIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">{materia.materia}</span>
                        <span className="text-sm text-gray-600">{materia.hora}</span>
                        <span className="text-sm text-blue-600">{materia.profesor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded border">
              <p className="text-gray-500 text-center">No hay horario disponible</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No se pudo cargar el horario</p>
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'info', label: 'Información Académica' },
              { id: 'schedule', label: 'Horario' }
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
          {activeTab === 'info' && renderAcademicInfo()}
          {activeTab === 'schedule' && renderSchedule()}
        </div>
      </div>
    </div>
  )
}
