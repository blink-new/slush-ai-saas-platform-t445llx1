import React, { useState, useEffect } from 'react'
import { blink } from './blink/client'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import OnboardingPage from './pages/OnboardingPage'
import CampaignCreator from './pages/CampaignCreator'
import AIWorkflow from './pages/AIWorkflow'
import Integrations from './pages/Integrations'
import TeamCollaboration from './pages/TeamCollaboration'
import { Toaster } from './components/ui/toaster'

type Page = 'landing' | 'dashboard' | 'campaign-creator' | 'ai-workflow' | 'integrations' | 'team'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<Page>('landing')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>()

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

  const navigateTo = (page: Page, campaignId?: string) => {
    setCurrentPage(page)
    if (campaignId) {
      setSelectedCampaignId(campaignId)
    }
  }

  const handleSignOut = () => {
    blink.auth.logout()
    setCurrentPage('landing')
    setShowOnboarding(false)
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

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage onLogin={handleLogin} onNavigate={navigateTo} />
      )}

      {currentPage === 'dashboard' && user && (
        <Dashboard 
          user={user} 
          onNavigate={navigateTo}
          onSignOut={handleSignOut}
        />
      )}

      {currentPage === 'campaign-creator' && (
        <CampaignCreator 
          onBack={() => navigateTo('dashboard')}
        />
      )}

      {currentPage === 'ai-workflow' && (
        <AIWorkflow 
          campaignId={selectedCampaignId}
          onBack={() => navigateTo('dashboard')}
        />
      )}

      {currentPage === 'integrations' && (
        <Integrations 
          onBack={() => navigateTo('dashboard')}
        />
      )}

      {currentPage === 'team' && (
        <TeamCollaboration 
          onBack={() => navigateTo('dashboard')}
        />
      )}

      <Toaster />
    </>
  )
}

export default App