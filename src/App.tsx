import React, { useState, useEffect } from 'react'
import { blink } from './blink/client'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import OnboardingPage from './pages/OnboardingPage'
import { Toaster } from './components/ui/toaster'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('landing')
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      if (state.user && currentPage === 'landing') {
        // Check if user needs onboarding
        const hasCompletedOnboarding = localStorage.getItem(`onboarding_${state.user.id}`)
        if (!hasCompletedOnboarding) {
          setShowOnboarding(true)
        } else {
          setCurrentPage('dashboard')
        }
      }
    })
    return unsubscribe
  }, [currentPage])

  const handleLogin = () => {
    blink.auth.login()
  }

  const handleCompleteOnboarding = (data: any) => {
    if (user) {
      localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(data))
      setShowOnboarding(false)
      setCurrentPage('dashboard')
    }
  }

  const navigateTo = (page: string) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (showOnboarding && user) {
    return (
      <>
        <OnboardingPage 
          user={user} 
          onComplete={handleCompleteOnboarding}
          onSkip={() => {
            setShowOnboarding(false)
            setCurrentPage('dashboard')
          }}
        />
        <Toaster />
      </>
    )
  }

  if (currentPage === 'dashboard' && user) {
    return (
      <>
        <Dashboard user={user} onNavigate={navigateTo} />
        <Toaster />
      </>
    )
  }

  return (
    <>
      <LandingPage onLogin={handleLogin} onNavigate={navigateTo} />
      <Toaster />
    </>
  )
}

export default App