import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Checkbox } from '../components/ui/checkbox'
import { Progress } from '../components/ui/progress'
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Youtube,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Mic,
  Camera,
  PenTool,
  Users,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react'

interface OnboardingPageProps {
  user: any
  onComplete: (data: any) => void
  onSkip: () => void
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ user, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    contentNiche: '',
    platforms: [] as string[],
    contentTypes: [] as string[],
    mainChallenges: [] as string[],
    goals: '',
    teamSize: '',
    experience: ''
  })

  const steps = [
    {
      title: 'Welcome to Slush AI!',
      description: 'Let\'s personalize your AI agent experience'
    },
    {
      title: 'Your Content Niche',
      description: 'What type of content do you create?'
    },
    {
      title: 'Your Platforms',
      description: 'Where do you publish your content?'
    },
    {
      title: 'Content Types',
      description: 'What formats do you work with?'
    },
    {
      title: 'Main Challenges',
      description: 'What are your biggest pain points?'
    },
    {
      title: 'Your Goals',
      description: 'What do you want to achieve?'
    }
  ]

  const niches = [
    'Tech & Software',
    'Business & Entrepreneurship',
    'Lifestyle & Wellness',
    'Education & Learning',
    'Entertainment & Gaming',
    'Fashion & Beauty',
    'Food & Cooking',
    'Travel & Adventure',
    'Finance & Investing',
    'Health & Fitness',
    'Art & Design',
    'Music & Audio',
    'Other'
  ]

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: Youtube },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter },
    { id: 'newsletter', name: 'Newsletter', icon: Mail },
    { id: 'podcast', name: 'Podcast', icon: Mic },
    { id: 'tiktok', name: 'TikTok', icon: Camera },
    { id: 'blog', name: 'Blog', icon: PenTool }
  ]

  const contentTypes = [
    'Video Content',
    'Written Articles',
    'Social Media Posts',
    'Email Newsletters',
    'Podcasts',
    'Infographics',
    'Live Streams',
    'Short-form Videos',
    'Courses/Tutorials',
    'Webinars'
  ]

  const challenges = [
    'Coming up with content ideas',
    'Maintaining consistent posting',
    'Writing engaging copy',
    'Analyzing performance',
    'Managing multiple platforms',
    'Finding trending topics',
    'Optimizing for SEO',
    'Team collaboration',
    'Time management',
    'Competitor research'
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(formData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePlatformToggle = (platformId: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }))
  }

  const handleContentTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type]
    }))
  }

  const handleChallengeToggle = (challenge: string) => {
    setFormData(prev => ({
      ...prev,
      mainChallenges: prev.mainChallenges.includes(challenge)
        ? prev.mainChallenges.filter(c => c !== challenge)
        : [...prev.mainChallenges, challenge]
    }))
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Slush AI</span>
          </div>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-lg">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Hi {user.email?.split('@')[0]}! 👋</h3>
                  <p className="text-muted-foreground">
                    We're excited to help you transform your content workflow with AI agents. 
                    This quick setup will personalize your experience and configure your AI team.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">2 minutes</p>
                    <p className="text-xs text-muted-foreground">Quick setup</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Personalized</p>
                    <p className="text-xs text-muted-foreground">Custom AI agents</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Results</p>
                    <p className="text-xs text-muted-foreground">Better content</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Content Niche */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Label htmlFor="niche">Select your primary content niche:</Label>
                <RadioGroup
                  value={formData.contentNiche}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, contentNiche: value }))}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {niches.map((niche) => (
                      <div key={niche} className="flex items-center space-x-2">
                        <RadioGroupItem value={niche} id={niche} />
                        <Label htmlFor={niche} className="text-sm cursor-pointer">
                          {niche}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Platforms */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Label>Select the platforms you use (choose all that apply):</Label>
                <div className="grid grid-cols-2 gap-4">
                  {platforms.map((platform) => (
                    <div
                      key={platform.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.platforms.includes(platform.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handlePlatformToggle(platform.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <platform.icon className="w-6 h-6" />
                        <span className="font-medium">{platform.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Content Types */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Label>What types of content do you create?</Label>
                <div className="grid grid-cols-2 gap-3">
                  {contentTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={formData.contentTypes.includes(type)}
                        onCheckedChange={() => handleContentTypeToggle(type)}
                      />
                      <Label htmlFor={type} className="text-sm cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Challenges */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <Label>What are your main content creation challenges?</Label>
                <div className="grid grid-cols-1 gap-3">
                  {challenges.map((challenge) => (
                    <div key={challenge} className="flex items-center space-x-2">
                      <Checkbox
                        id={challenge}
                        checked={formData.mainChallenges.includes(challenge)}
                        onCheckedChange={() => handleChallengeToggle(challenge)}
                      />
                      <Label htmlFor={challenge} className="text-sm cursor-pointer">
                        {challenge}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Goals */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="goals">What's your main goal with content creation?</Label>
                  <RadioGroup
                    value={formData.goals}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, goals: value }))}
                  >
                    <div className="space-y-3">
                      {[
                        'Build brand awareness',
                        'Generate leads/sales',
                        'Educate my audience',
                        'Grow my following',
                        'Establish thought leadership',
                        'Create a community'
                      ].map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <RadioGroupItem value={goal} id={goal} />
                          <Label htmlFor={goal} className="cursor-pointer">
                            {goal}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="teamSize">Team size:</Label>
                  <RadioGroup
                    value={formData.teamSize}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, teamSize: value }))}
                  >
                    <div className="flex flex-wrap gap-4">
                      {['Just me', '2-5 people', '6-10 people', '10+ people'].map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                          <RadioGroupItem value={size} id={size} />
                          <Label htmlFor={size} className="cursor-pointer">
                            {size}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="experience">Content creation experience:</Label>
                  <RadioGroup
                    value={formData.experience}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                  >
                    <div className="flex flex-wrap gap-4">
                      {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <RadioGroupItem value={level} id={level} />
                          <Label htmlFor={level} className="cursor-pointer">
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <div>
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Button variant="ghost" onClick={onSkip}>
                  Skip Setup
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OnboardingPage