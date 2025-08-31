'use client'

import { useState, useEffect } from 'react'
import LoginForm from '@/components/LoginForm'
import AdminPanel from '@/components/AdminPanel'
import StudentPanel from '@/components/StudentPanel'
import TeacherPanel from '@/components/TeacherPanel'
import axios from 'axios'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'login' | 'admin' | 'student' | 'teacher' | 'estudiante' | 'profesor'>('login')

  // Verificar token al cargar la página
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Verificando estado de autenticación...')
      // Verificar token con el backend (se envía automáticamente por cookies)
      const response = await axios.get('http://localhost:3000/api/auth/profile', {
        withCredentials: true // Importante: enviar cookies
      })
      
      console.log('📡 Respuesta del backend:', response.data)
      
      if (response.data.success) {
        const userData = response.data.data
        console.log('👤 Usuario autenticado:', userData)
        console.log('🎭 Rol del usuario:', userData.role)
        setUser(userData)
        setCurrentView(userData.role as any)
        console.log('✅ Vista establecida a:', userData.role)
      } else {
        console.log('❌ Login falló:', response.data.message)
        setUser(null)
        setCurrentView('login')
      }
    } catch (error: any) {
      console.error('❌ Error verificando token:', error)
      if (error.response) {
        console.log('📡 Status:', error.response.status)
        console.log('📡 Data:', error.response.data)
      }
      setUser(null)
      setCurrentView('login')
    }
    setLoading(false)
  }

  const handleLogin = (userData: any) => {
    console.log('🔐 Login exitoso, datos del usuario:', userData)
    console.log('🎭 Rol del usuario:', userData.role)
    setUser(userData)
    setCurrentView(userData.role as any)
    console.log('✅ Vista establecida a:', userData.role)
  }

  const handleLogout = async () => {
    try {
      // Llamar al endpoint de logout para limpiar la cookie
      await axios.post('http://localhost:3000/api/auth/logout', {}, {
        withCredentials: true
      })
    } catch (error) {
      console.error('Error en logout:', error)
    }
    
    setUser(null)
    setCurrentView('login')
  }

  const renderContent = () => {
    console.log('🎨 Renderizando contenido...')
    console.log('📱 Estado actual:', { loading, currentView, user: user?.email })
    
    if (loading) {
      console.log('⏳ Mostrando pantalla de carga...')
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Verificando autenticación...</div>
        </div>
      )
    }

    console.log('🔍 Evaluando vista:', currentView)
    
    switch (currentView) {
      case 'admin':
        console.log('👨‍💼 Renderizando AdminPanel')
        return <AdminPanel user={user} onLogout={handleLogout} />
      case 'student':
        console.log('👨‍🎓 Renderizando StudentPanel')
        return <StudentPanel user={user} onLogout={handleLogout} />
      case 'teacher':
        console.log('👨‍🏫 Renderizando TeacherPanel')
        return <TeacherPanel user={user} onLogout={handleLogout} />
      case 'estudiante':
        console.log('👨‍🎓 Renderizando StudentPanel (estudiante)')
        return <StudentPanel user={user} onLogout={handleLogout} />
      case 'profesor':
        console.log('👨‍🏫 Renderizando TeacherPanel (profesor)')
        return <TeacherPanel user={user} onLogout={handleLogout} />
      default:
        console.log('🔐 Renderizando LoginForm (default) - currentView:', currentView, 'tipo:', typeof currentView)
        return <LoginForm onLogin={handleLogin} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          {/* Header Principal con Flexbox */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo y Título */}
            <div className="flex items-center gap-3">
              <div className="text-4xl">🏫</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sistema de Gestión Escolar
                </h1>
                <p className="text-sm text-muted-foreground hidden md:block">
                  Administración Integral Educativa
                </p>
              </div>
            </div>

            {/* Información del Usuario y Botón de Logout */}
            {user && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Información del Usuario */}
                <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-lg border">
                  <div className="text-2xl">
                    {user.role === 'admin' ? '👨‍💼' : 
                     user.role === 'estudiante' || user.role === 'student' ? '👨‍🎓' : 
                     user.role === 'profesor' || user.role === 'teacher' ? '👨‍🏫' : '👤'}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{user.nombre} {user.apellido}</p>
                    <p className="text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>

                {/* Botón de Logout */}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 gap-2"
                >
                  <span>🚪</span>
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                  <span className="sm:hidden">Salir</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  )
}
