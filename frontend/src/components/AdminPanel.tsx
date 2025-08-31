'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface AdminPanelProps {
  user: any
  onLogout: () => void
}

export default function AdminPanel({ user, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('grades')
  const [grades, setGrades] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // Estados para formularios
  const [showGradeForm, setShowGradeForm] = useState(false)
  const [showSubjectForm, setShowSubjectForm] = useState(false)
  const [showAssignmentForm, setShowAssignmentForm] = useState(false)
  const [editingGrade, setEditingGrade] = useState<any>(null)
  const [editingSubject, setEditingSubject] = useState<any>(null)
  
  // Estados para formularios
  const [gradeForm, setGradeForm] = useState({
    nombre: '',
    descripcion: ''
  })
  const [subjectForm, setSubjectForm] = useState({
    nombre: '',
    descripcion: ''
  })
  const [assignmentForm, setAssignmentForm] = useState({
    gradeId: '',
    subjectId: ''
  })

  useEffect(() => {
    fetchGrades()
    fetchSubjects()
  }, [])

  const fetchGrades = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:3000/api/admin/grades', {
        withCredentials: true
      })
      setGrades(response.data.data)
    } catch (error) {
      console.error('Error fetching grades:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:3000/api/admin/subjects', {
        withCredentials: true
      })
      setSubjects(response.data.data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  // Funciones para Grados
  const handleCreateGrade = async () => {
    try {
      await axios.post('http://localhost:3000/api/admin/grades', gradeForm, {
        withCredentials: true
      })
      setGradeForm({ nombre: '', descripcion: '' })
      setShowGradeForm(false)
      fetchGrades()
    } catch (error) {
      console.error('Error creating grade:', error)
    }
  }

  const handleEditGrade = async () => {
    try {
      await axios.put(`http://localhost:3000/api/admin/grades/${editingGrade.id}`, gradeForm, {
        withCredentials: true
      })
      setGradeForm({ nombre: '', descripcion: '' })
      setEditingGrade(null)
      setShowGradeForm(false)
      fetchGrades()
    } catch (error) {
      console.error('Error updating grade:', error)
    }
  }

  const handleToggleGradeStatus = async (gradeId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`http://localhost:3000/api/admin/grades/${gradeId}/toggle-status`, {
        activo: !currentStatus
      }, {
        withCredentials: true
      })
      fetchGrades()
    } catch (error) {
      console.error('Error toggling grade status:', error)
    }
  }

  const openGradeForm = (grade?: any) => {
    if (grade) {
      setEditingGrade(grade)
      setGradeForm({ nombre: grade.nombre, descripcion: grade.descripcion })
    } else {
      setEditingGrade(null)
      setGradeForm({ nombre: '', descripcion: '' })
    }
    setShowGradeForm(true)
  }

  // Funciones para Materias
  const handleCreateSubject = async () => {
    try {
      await axios.post('http://localhost:3000/api/admin/subjects', subjectForm, {
        withCredentials: true
      })
      setSubjectForm({ nombre: '', descripcion: '' })
      setShowSubjectForm(false)
      fetchSubjects()
    } catch (error) {
      console.error('Error creating subject:', error)
    }
  }

  const handleEditSubject = async () => {
    try {
      await axios.put(`http://localhost:3000/api/admin/subjects/${editingSubject.id}`, subjectForm, {
        withCredentials: true
      })
      setSubjectForm({ nombre: '', descripcion: '' })
      setEditingSubject(null)
      setShowSubjectForm(false)
      fetchSubjects()
    } catch (error) {
      console.error('Error updating subject:', error)
    }
  }

  const handleToggleSubjectStatus = async (subjectId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`http://localhost:3000/api/admin/subjects/${subjectId}/toggle-status`, {
        activo: !currentStatus
      }, {
        withCredentials: true
      })
      fetchSubjects()
    } catch (error) {
      console.error('Error toggling subject status:', error)
    }
  }

  const openSubjectForm = (subject?: any) => {
    if (subject) {
      setEditingSubject(subject)
      setSubjectForm({ nombre: subject.nombre, descripcion: subject.descripcion })
    } else {
      setEditingSubject(null)
      setSubjectForm({ nombre: '', descripcion: '' })
    }
    setShowSubjectForm(true)
  }

  // Funciones para Asignación de Materias
  const handleAssignSubjectToGrade = async () => {
    try {
      await axios.post('http://localhost:3000/api/admin/grades/assign-subject', assignmentForm, {
        withCredentials: true
      })
      setAssignmentForm({ gradeId: '', subjectId: '' })
      setShowAssignmentForm(false)
      fetchGrades()
      fetchSubjects()
    } catch (error: any) {
      console.error('Error assigning subject to grade:', error)
      alert(error.response?.data?.message || 'Error al asignar materia al grado')
    }
  }

  const openAssignmentForm = () => {
    setAssignmentForm({ gradeId: '', subjectId: '' })
    setShowAssignmentForm(true)
  }

  const renderGradesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold tracking-tight">Gestión de Grados</h3>
        <div className="flex gap-2">
          <Button onClick={() => openAssignmentForm()} className="flex items-center gap-2">
            <span>🔗</span>
            Asignar Materia
          </Button>
          <Button onClick={() => openGradeForm()} className="flex items-center gap-2">
            <span>➕</span>
            Nuevo Grado
          </Button>
        </div>
      </div>

      {showGradeForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingGrade ? 'Editar Grado' : 'Crear Nuevo Grado'}
            </CardTitle>
            <CardDescription>
              {editingGrade ? 'Modifica la información del grado' : 'Agrega un nuevo grado al sistema'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={gradeForm.nombre}
                onChange={(e) => setGradeForm({ ...gradeForm, nombre: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="Ej: Primero de Secundaria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={gradeForm.descripcion}
                onChange={(e) => setGradeForm({ ...gradeForm, descripcion: e.target.value })}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Descripción del grado"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={editingGrade ? handleEditGrade : handleCreateGrade}
                className="flex-1"
              >
                {editingGrade ? 'Actualizar' : 'Crear'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowGradeForm(false)
                  setEditingGrade(null)
                  setGradeForm({ nombre: '', descripcion: '' })
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showAssignmentForm && (
        <Card>
          <CardHeader>
            <CardTitle>Asignar Materia a Grado</CardTitle>
            <CardDescription>
              Selecciona un grado y una materia para crear la asignación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Grado</label>
              <select
                value={assignmentForm.gradeId}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, gradeId: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Selecciona un grado</option>
                {grades.filter((g: any) => g.activo).map((grade: any) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Materia</label>
              <select
                value={assignmentForm.subjectId}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, subjectId: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Selecciona una materia</option>
                {subjects.filter((s: any) => s.activo).map((subject: any) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleAssignSubjectToGrade}
                className="flex-1"
                disabled={!assignmentForm.gradeId || !assignmentForm.subjectId}
              >
                Asignar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAssignmentForm(false)
                  setAssignmentForm({ gradeId: '', subjectId: '' })
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Grados</CardTitle>
          <CardDescription>Grados disponibles en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Materias</TableHead>
                <TableHead>Estudiantes</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade: any) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">{grade.nombre}</TableCell>
                  <TableCell>{grade.descripcion}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      grade.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {grade.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell>{grade.subjects?.length || 0}</TableCell>
                  <TableCell>{grade.students?.length || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openGradeForm(grade)}
                      >
                        ✏️
                      </Button>
                      <Button 
                        size="sm" 
                        variant={grade.activo ? "destructive" : "default"}
                        onClick={() => handleToggleGradeStatus(grade.id, grade.activo)}
                      >
                        {grade.activo ? '❌' : '✅'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderSubjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold tracking-tight">Gestión de Materias</h3>
        <Button onClick={() => openSubjectForm()} className="flex items-center gap-2">
          <span>📚</span>
          Nueva Materia
        </Button>
      </div>

      {showSubjectForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSubject ? 'Editar Materia' : 'Crear Nueva Materia'}
            </CardTitle>
            <CardDescription>
              {editingSubject ? 'Modifica la información de la materia' : 'Agrega una nueva materia al sistema'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={subjectForm.nombre}
                onChange={(e) => setSubjectForm({ ...subjectForm, nombre: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="Ej: Matemáticas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={subjectForm.descripcion}
                onChange={(e) => setSubjectForm({ ...subjectForm, descripcion: e.target.value })}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Descripción de la materia"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={editingSubject ? handleEditSubject : handleCreateSubject}
                className="flex-1"
              >
                {editingSubject ? 'Actualizar' : 'Crear'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSubjectForm(false)
                  setEditingSubject(null)
                  setSubjectForm({ nombre: '', descripcion: '' })
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Materias</CardTitle>
          <CardDescription>Materias disponibles en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Grados</TableHead>
                <TableHead>Profesores</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject: any) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.nombre}</TableCell>
                  <TableCell>{subject.descripcion}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      subject.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subject.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </TableCell>
                  <TableCell>{subject.grades?.length || 0}</TableCell>
                  <TableCell>{subject.teachers?.length || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openSubjectForm(subject)}
                      >
                        ✏️
                      </Button>
                      <Button 
                        size="sm" 
                        variant={subject.activo ? "destructive" : "default"}
                        onClick={() => handleToggleSubjectStatus(subject.id, subject.activo)}
                      >
                        {subject.activo ? '❌' : '✅'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderEnrollmentTab = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold tracking-tight">Inscripción de Estudiantes</h3>
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidad en Desarrollo</CardTitle>
          <CardDescription>
            Próximamente podrás inscribir estudiantes a grados específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🚧</div>
            <p className="text-muted-foreground">Funcionalidad en desarrollo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAssignmentTab = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold tracking-tight">Asignación de Materias</h3>
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidad en Desarrollo</CardTitle>
          <CardDescription>
            Próximamente podrás asignar materias a profesores y grados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🚧</div>
            <p className="text-muted-foreground">Funcionalidad en desarrollo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-muted-foreground">Cargando información...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">👨‍💼</span>
            Panel de Administración
          </CardTitle>
          <CardDescription>
            Gestiona grados, materias, inscripciones y asignaciones del sistema educativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="grades">Grados</TabsTrigger>
              <TabsTrigger value="subjects">Materias</TabsTrigger>
              <TabsTrigger value="enrollment">Inscripciones</TabsTrigger>
              <TabsTrigger value="assignment">Asignaciones</TabsTrigger>
            </TabsList>
            <TabsContent value="grades" className="mt-6">
              {renderGradesTab()}
            </TabsContent>
            <TabsContent value="subjects" className="mt-6">
              {renderSubjectsTab()}
            </TabsContent>
            <TabsContent value="enrollment" className="mt-6">
              {renderEnrollmentTab()}
            </TabsContent>
            <TabsContent value="assignment" className="mt-6">
              {renderAssignmentTab()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
