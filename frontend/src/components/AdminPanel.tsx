'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface AdminPanelProps {
  user: any
  onLogout: () => void
}

export default function AdminPanel({ user, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('grades')
  const [grades, setGrades] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchGrades()
    fetchSubjects()
  }, [])

  const fetchGrades = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/grades', {
        withCredentials: true
      })
      setGrades(response.data.data)
    } catch (error) {
      console.error('Error fetching grades:', error)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/subjects', {
        withCredentials: true
      })
      setSubjects(response.data.data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const renderGradesTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Grados</h3>
      <div className="grid gap-4">
        {grades.map((grade: any) => (
          <div key={grade.id} className="bg-white p-4 rounded-lg shadow border">
            <h4 className="font-semibold text-lg">{grade.nombre}</h4>
            <p className="text-gray-600">{grade.descripcion}</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                Materias: {grade.subjects?.length || 0} | 
                Estudiantes: {grade.students?.length || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSubjectsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Materias</h3>
      <div className="grid gap-4">
        {subjects.map((subject: any) => (
          <div key={subject.id} className="bg-white p-4 rounded-lg shadow border">
            <h4 className="font-semibold text-lg">{subject.nombre}</h4>
            <p className="text-gray-600">{subject.descripcion}</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                Grados: {subject.grades?.length || 0} | 
                Profesores: {subject.teachers?.length || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderEnrollmentTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Inscribir Estudiante</h3>
      <EnrollmentForm onSuccess={fetchGrades} />
    </div>
  )

  const renderAssignmentTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Asignar Materias</h3>
      <AssignmentForm onSuccess={() => {
        fetchGrades()
        fetchSubjects()
      }} />
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'grades', label: 'Grados' },
              { id: 'subjects', label: 'Materias' },
              { id: 'enrollment', label: 'Inscripciones' },
              { id: 'assignment', label: 'Asignaciones' }
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
          {activeTab === 'grades' && renderGradesTab()}
          {activeTab === 'subjects' && renderSubjectsTab()}
          {activeTab === 'enrollment' && renderEnrollmentTab()}
          {activeTab === 'assignment' && renderAssignmentTab()}
        </div>
      </div>
    </div>
  )
}

// Componente para inscribir estudiantes
function EnrollmentForm({ onSuccess }: { onSuccess: () => void }) {
  const [studentId, setStudentId] = useState('')
  const [gradeId, setGradeId] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await axios.post('http://localhost:3000/api/admin/students/enroll', {
        studentId,
        gradeId
      }, {
        withCredentials: true
      })

      setMessage('Estudiante inscrito exitosamente')
      setStudentId('')
      setGradeId('')
      onSuccess()
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error al inscribir estudiante')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">ID del Estudiante</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="UUID del estudiante"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">ID del Grado</label>
        <input
          type="text"
          value={gradeId}
          onChange={(e) => setGradeId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="UUID del grado"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Inscribiendo...' : 'Inscribir Estudiante'}
      </button>
      {message && (
        <div className={`p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </form>
  )
}

// Componente para asignar materias
function AssignmentForm({ onSuccess }: { onSuccess: () => void }) {
  const [gradeId, setGradeId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await axios.post('http://localhost:3000/api/admin/grades/assign-subject', {
        gradeId,
        subjectId
      }, {
        withCredentials: true
      })

      setMessage('Materia asignada exitosamente')
      setGradeId('')
      setSubjectId('')
      onSuccess()
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error al asignar materia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">ID del Grado</label>
        <input
          type="text"
          value={gradeId}
          onChange={(e) => setGradeId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="UUID del grado"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">ID de la Materia</label>
        <input
          type="text"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="UUID de la materia"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Asignando...' : 'Asignar Materia'}
      </button>
      {message && (
        <div className={`p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </form>
  )
}
