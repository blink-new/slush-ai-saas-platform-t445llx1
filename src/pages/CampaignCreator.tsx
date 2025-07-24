import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Wand2, Calendar, Target, Users, Settings } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Checkbox } from '../components/ui/checkbox'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { blink } from '../blink/client'

interface CampaignCreatorProps {
  onBack: () => void
}

const CampaignCreator: React.FC<CampaignCreatorProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    objective: '',
    targetAudience: '',
    contentType: '',
    platforms: [] as string[],
    duration: '',
    budget: '',
    tone: '',
    keywords: '',
    teamMembers: [] as string[]
  })
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  const agents = [
    { id: 'planning', name: 'Planning Agent', icon: '📅', description: 'Creates content calendar and strategy' },
    { id: 'brainstorming', name: 'Brainstorming Agent', icon: '💡', description: 'Generates creative ideas and concepts' },
    { id: 'creative', name: 'Creative Agent', icon: '✨', description: 'Writes scripts, copy, and content' },
    { id: 'competitor', name: 'Competitor Analysis', icon: '🔍', description: 'Analyzes competition and trends' },
    { id: 'evaluation', name: 'Evaluation Agent', icon: '⭐', description: 'Reviews and optimizes content' },
    { id: 'scheduling', name: 'Scheduling Agent', icon: '⏰', description: 'Plans publishing timeline' },
    { id: 'publishing', name: 'Publishing Agent', icon: '📤', description: 'Handles multi-platform posting' },
    { id: 'performance', name: 'Performance Agent', icon: '📊', description: 'Tracks analytics and insights' }
  ]

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: '🎥' },
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'newsletter', name: 'Newsletter', icon: '📧' }
  ]

  const handleInputChange = (field: string, value: any) => {
    setCampaignData(prev => ({ ...prev, [field]: value }))
  }

  const handlePlatformToggle = (platformId: string) => {
    setCampaignData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }))
  }

  const handleAgentToggle = (agentId: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(a => a !== agentId)
        : [...prev, agentId]
    )
  }

  const generateCampaignContent = async () => {
    setIsGenerating(true)
    try {
      // Generate campaign strategy using AI
      const { text: strategy } = await blink.ai.generateText({
        prompt: `Create a comprehensive content marketing campaign strategy for:
        
Campaign: ${campaignData.name}
Description: ${campaignData.description}
Objective: ${campaignData.objective}
Target Audience: ${campaignData.targetAudience}
Content Type: ${campaignData.contentType}
Platforms: ${campaignData.platforms.join(', ')}
Tone: ${campaignData.tone}
Keywords: ${campaignData.keywords}

Please provide:
1. Content calendar with 10 specific content ideas
2. Platform-specific adaptations
3. Engagement strategies
4. Key performance indicators
5. Timeline and milestones

Format as JSON with clear structure.`,
        maxTokens: 2000
      })

      // Generate specific content ideas
      const { text: contentIdeas } = await blink.ai.generateText({
        prompt: `Generate 5 specific, actionable content ideas for this campaign:
        
Campaign: ${campaignData.name}
Target: ${campaignData.targetAudience}
Platforms: ${campaignData.platforms.join(', ')}
Tone: ${campaignData.tone}

For each idea, provide:
- Title/Hook
- Content outline
- Platform-specific format
- Expected engagement type
- Call-to-action

Format as JSON array.`,
        maxTokens: 1500
      })

      setGeneratedContent({
        strategy,
        contentIdeas,
        timestamp: new Date().toISOString()
      })

      // Save campaign to database
      await blink.db.campaigns.create({
        name: campaignData.name,
        description: campaignData.description,
        objective: campaignData.objective,
        target_audience: campaignData.targetAudience,
        content_type: campaignData.contentType,
        platforms: campaignData.platforms.join(','),
        duration: campaignData.duration,
        tone: campaignData.tone,
        keywords: campaignData.keywords,
        selected_agents: selectedAgents.join(','),
        status: 'active',
        generated_strategy: strategy,
        generated_content: contentIdeas,
        user_id: 'current-user', // Will be replaced with actual user ID
        created_at: new Date().toISOString()
      })

    } catch (error) {
      console.error('Error generating campaign:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      generateCampaignContent()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = (currentStep / 4) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Campaign</h1>
            <p className="text-slate-600 dark:text-slate-400">Let AI agents build your content strategy</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-600" />
                  Campaign Basics
                </CardTitle>
                <CardDescription>Define your campaign goals and target audience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Summer Product Launch"
                      value={campaignData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objective">Primary Objective</Label>
                    <Select value={campaignData.objective} onValueChange={(value) => handleInputChange('objective', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select objective" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                        <SelectItem value="lead-generation">Lead Generation</SelectItem>
                        <SelectItem value="sales">Sales & Conversions</SelectItem>
                        <SelectItem value="engagement">Community Engagement</SelectItem>
                        <SelectItem value="education">Education & Thought Leadership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Campaign Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your campaign goals, key messages, and desired outcomes..."
                    value={campaignData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Input
                      id="audience"
                      placeholder="e.g., Tech entrepreneurs, 25-40, B2B"
                      value={campaignData.targetAudience}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Campaign Duration</Label>
                    <Select value={campaignData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-week">1 Week</SelectItem>
                        <SelectItem value="2-weeks">2 Weeks</SelectItem>
                        <SelectItem value="1-month">1 Month</SelectItem>
                        <SelectItem value="3-months">3 Months</SelectItem>
                        <SelectItem value="6-months">6 Months</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-indigo-600" />
                  Content & Style
                </CardTitle>
                <CardDescription>Define your content type, tone, and key themes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contentType">Content Type</Label>
                    <Select value={campaignData.contentType} onValueChange={(value) => handleInputChange('contentType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="educational">Educational Content</SelectItem>
                        <SelectItem value="promotional">Promotional Content</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="behind-scenes">Behind the Scenes</SelectItem>
                        <SelectItem value="user-generated">User-Generated Content</SelectItem>
                        <SelectItem value="thought-leadership">Thought Leadership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tone">Brand Tone</Label>
                    <Select value={campaignData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual & Friendly</SelectItem>
                        <SelectItem value="humorous">Humorous</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                        <SelectItem value="authoritative">Authoritative</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords & Themes</Label>
                  <Textarea
                    id="keywords"
                    placeholder="Enter relevant keywords, hashtags, and themes separated by commas..."
                    value={campaignData.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Target Platforms</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {platforms.map((platform) => (
                      <div
                        key={platform.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          campaignData.platforms.includes(platform.id)
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                        onClick={() => handlePlatformToggle(platform.id)}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{platform.icon}</div>
                          <div className="font-medium text-sm">{platform.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-indigo-600" />
                  Select AI Agents
                </CardTitle>
                <CardDescription>Choose which AI agents will work on your campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAgents.includes(agent.id)
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                      onClick={() => handleAgentToggle(agent.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{agent.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{agent.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{agent.description}</p>
                        </div>
                        <Checkbox
                          checked={selectedAgents.includes(agent.id)}
                          onChange={() => handleAgentToggle(agent.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Review & Launch
                </CardTitle>
                <CardDescription>Review your campaign settings and launch with AI agents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Campaign Overview</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {campaignData.name}</div>
                      <div><span className="font-medium">Objective:</span> {campaignData.objective}</div>
                      <div><span className="font-medium">Duration:</span> {campaignData.duration}</div>
                      <div><span className="font-medium">Content Type:</span> {campaignData.contentType}</div>
                      <div><span className="font-medium">Tone:</span> {campaignData.tone}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Selected Platforms</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {campaignData.platforms.map((platformId) => {
                        const platform = platforms.find(p => p.id === platformId)
                        return platform ? (
                          <Badge key={platformId} variant="secondary">
                            {platform.icon} {platform.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                    <h3 className="font-semibold mb-2">Active AI Agents</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgents.map((agentId) => {
                        const agent = agents.find(a => a.id === agentId)
                        return agent ? (
                          <Badge key={agentId} variant="outline">
                            {agent.icon} {agent.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>

                {generatedContent && (
                  <div className="mt-8 p-6 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      ✅ Campaign Generated Successfully!
                    </h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Your AI agents have created a comprehensive strategy and content plan. 
                      The campaign is now active and ready for execution.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            onClick={nextStep}
            disabled={isGenerating || (currentStep === 4 && generatedContent)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isGenerating ? (
              <>
                <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : currentStep === 4 ? (
              generatedContent ? 'Campaign Created!' : 'Generate Campaign'
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CampaignCreator