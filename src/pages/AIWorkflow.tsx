import React, { useState, useEffect } from 'react'
import { ArrowLeft, Play, Pause, RotateCcw, Download, Edit, Check, X, Wand2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Textarea } from '../components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { blink } from '../blink/client'

interface AIWorkflowProps {
  campaignId?: string
  onBack: () => void
}

interface WorkflowStep {
  id: string
  name: string
  agent: string
  icon: string
  status: 'pending' | 'running' | 'completed' | 'error'
  input?: string
  output?: string
  progress: number
}

const AIWorkflow: React.FC<AIWorkflowProps> = ({ campaignId, onBack }) => {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: 'planning',
      name: 'Content Planning',
      agent: 'Planning Agent',
      icon: '📅',
      status: 'pending',
      progress: 0
    },
    {
      id: 'brainstorming',
      name: 'Idea Generation',
      agent: 'Brainstorming Agent',
      icon: '💡',
      status: 'pending',
      progress: 0
    },
    {
      id: 'creative',
      name: 'Content Creation',
      agent: 'Creative Agent',
      icon: '✨',
      status: 'pending',
      progress: 0
    },
    {
      id: 'competitor',
      name: 'Competitor Analysis',
      agent: 'Competitor Agent',
      icon: '🔍',
      status: 'pending',
      progress: 0
    },
    {
      id: 'evaluation',
      name: 'Content Evaluation',
      agent: 'Evaluation Agent',
      icon: '⭐',
      status: 'pending',
      progress: 0
    },
    {
      id: 'scheduling',
      name: 'Publishing Schedule',
      agent: 'Scheduling Agent',
      icon: '⏰',
      status: 'pending',
      progress: 0
    }
  ])
  
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const runWorkflowStep = async (stepIndex: number) => {
    const step = workflowSteps[stepIndex]
    
    // Update step status to running
    setWorkflowSteps(prev => prev.map((s, i) => 
      i === stepIndex ? { ...s, status: 'running' as const, progress: 0 } : s
    ))

    try {
      const user = await blink.auth.me()
      let prompt = ''
      let previousOutput = ''
      let useSearch = false
      
      // Get previous step output for context
      if (stepIndex > 0) {
        previousOutput = workflowSteps[stepIndex - 1].output || ''
      }

      // Get campaign context if available
      let campaignContext = ''
      if (campaignId) {
        try {
          const campaigns = await blink.db.campaigns.list({
            where: { id: campaignId },
            limit: 1
          })
          if (campaigns.length > 0) {
            const campaign = campaigns[0]
            campaignContext = `Campaign: ${campaign.name}
Target Audience: ${campaign.target_audience}
Platforms: ${campaign.platforms}
Content Type: ${campaign.content_type}
Tone: ${campaign.tone}
Keywords: ${campaign.keywords}`
          }
        } catch (error) {
          console.log('No campaign context available')
        }
      }

      // Generate step-specific prompts with enhanced context
      switch (step.id) {
        case 'planning':
          prompt = `Create a comprehensive content planning strategy for a creator campaign.
          
${campaignContext}

Include:
1. Content calendar for the next 4 weeks with specific dates
2. Key themes and topics based on current trends
3. Content pillars that align with brand values
4. Posting frequency recommendations per platform
5. Platform-specific adaptations and best practices
6. Seasonal/trending opportunities
7. Content mix ratios (educational, promotional, entertaining)

Format as a detailed, actionable plan with specific dates and deliverables.`
          useSearch = true
          break
          
        case 'brainstorming':
          prompt = `Based on this content plan: "${previousOutput}"
          
${campaignContext}

Generate 12 creative content ideas including:
1. Engaging headlines/hooks that stop the scroll
2. Content formats (video, carousel, story, reel, etc.)
3. Key messages and value propositions
4. Visual concepts and styling directions
5. Interactive elements (polls, Q&A, challenges)
6. Call-to-action suggestions
7. Trending hashtags and keywords
8. Cross-platform adaptation strategies

Make each idea specific, actionable, and optimized for engagement.`
          useSearch = true
          break
          
        case 'creative':
          prompt = `Using these content ideas: "${previousOutput}"
          
${campaignContext}

Create detailed content for the top 5 ideas:
1. Full scripts/copy with engaging openings and strong closings
2. Visual descriptions and shot lists
3. Platform-specific versions (Instagram vs TikTok vs LinkedIn)
4. Hashtag suggestions (5-15 per platform)
5. Engagement hooks and conversation starters
6. Thumbnail/cover image concepts
7. Caption variations for A/B testing
8. Story/highlight adaptations

Make content production-ready with specific instructions.`
          break
          
        case 'competitor':
          prompt = `Analyze competitor content strategies in this niche:
          
${campaignContext}

Provide:
1. Top 10 competitor analysis with specific examples
2. Content gaps and untapped opportunities
3. Trending topics and viral formats in the niche
4. Best performing content types and engagement patterns
5. Differentiation strategies and unique angles
6. Pricing/value proposition insights
7. Audience engagement patterns and preferences
8. Content frequency and posting schedules
9. Collaboration and partnership opportunities

Focus on actionable competitive intelligence with specific recommendations.`
          useSearch = true
          break
          
        case 'evaluation':
          prompt = `Evaluate this content comprehensively: "${previousOutput}"
          
${campaignContext}

Provide detailed feedback on:
1. Content quality and engagement potential (score 1-10)
2. SEO optimization and discoverability
3. Brand alignment and voice consistency
4. Audience relevance and value delivery
5. Platform-specific optimization
6. Call-to-action effectiveness
7. Visual appeal and production quality
8. Trending topic alignment
9. Improvement recommendations with specific changes
10. A/B testing suggestions

Include specific, actionable feedback with before/after examples.`
          break
          
        case 'scheduling':
          prompt = `Create a comprehensive publishing schedule based on: "${previousOutput}"
          
${campaignContext}

Include:
1. Optimal posting times for each platform (with timezone considerations)
2. Content sequencing strategy and narrative flow
3. Cross-platform promotion and repurposing plan
4. Engagement follow-up schedule and community management
5. Performance tracking milestones and KPIs
6. Content batching and production timeline
7. Seasonal/event-based scheduling opportunities
8. Backup content and contingency plans
9. Team collaboration and approval workflows
10. Analytics review and optimization schedule

Provide a detailed 30-day timeline with specific dates and times.`
          useSearch = true
          break
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setWorkflowSteps(prev => prev.map((s, i) => 
          i === stepIndex && s.status === 'running' 
            ? { ...s, progress: Math.min(s.progress + 8, 90) } 
            : s
        ))
      }, 300)

      // Generate content using AI with enhanced parameters
      const { text } = await blink.ai.generateText({
        prompt,
        maxTokens: 2000,
        search: useSearch,
        model: 'gpt-4o-mini' // Use a specific model for consistency
      })

      clearInterval(progressInterval)

      // Update step with completed status and output
      setWorkflowSteps(prev => prev.map((s, i) => 
        i === stepIndex 
          ? { ...s, status: 'completed' as const, progress: 100, output: text }
          : s
      ))

      // Save to database with proper user context
      await blink.db.content.create({
        id: `content_${step.id}_${Date.now()}`,
        campaign_id: campaignId || `demo_${Date.now()}`,
        agent_type: step.id,
        content_type: 'ai_generated',
        title: step.name,
        content: text,
        status: 'completed',
        user_id: user.id,
        created_at: new Date().toISOString()
      })

      // Log activity
      await blink.db.activity_log.create({
        user_id: user.id,
        action: 'workflow_step_completed',
        target: step.name,
        details: `Completed ${step.name} with ${text.length} characters of content`,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      console.error(`Error in ${step.name}:`, error)
      const progressInterval = setInterval(() => {
        setWorkflowSteps(prev => prev.map((s, i) => 
          i === stepIndex 
            ? { ...s, status: 'error' as const, progress: 0, output: `Error: ${error.message || 'Failed to generate content'}` }
            : s
        ))
      }, 100)
      
      setTimeout(() => clearInterval(progressInterval), 500)
    }
  }

  const runFullWorkflow = async () => {
    setIsRunning(true)
    setCurrentStepIndex(0)
    
    for (let i = 0; i < workflowSteps.length; i++) {
      setCurrentStepIndex(i)
      await runWorkflowStep(i)
      // Small delay between steps
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setIsRunning(false)
  }

  const resetWorkflow = () => {
    setWorkflowSteps(prev => prev.map(step => ({
      ...step,
      status: 'pending' as const,
      progress: 0,
      output: undefined
    })))
    setCurrentStepIndex(0)
    setIsRunning(false)
  }

  const handleEditStep = (stepId: string) => {
    const step = workflowSteps.find(s => s.id === stepId)
    if (step?.output) {
      setEditingStep(stepId)
      setEditContent(step.output)
    }
  }

  const saveEdit = () => {
    if (editingStep) {
      setWorkflowSteps(prev => prev.map(step => 
        step.id === editingStep 
          ? { ...step, output: editContent }
          : step
      ))
      setEditingStep(null)
      setEditContent('')
    }
  }

  const cancelEdit = () => {
    setEditingStep(null)
    setEditContent('')
  }

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'running': return 'bg-blue-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-slate-300'
    }
  }

  const completedSteps = workflowSteps.filter(step => step.status === 'completed').length
  const totalProgress = (completedSteps / workflowSteps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Workflow</h1>
              <p className="text-slate-600 dark:text-slate-400">Watch AI agents collaborate on your content</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={resetWorkflow}
              disabled={isRunning}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={runFullWorkflow}
              disabled={isRunning}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Workflow
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Workflow Progress</span>
              <Badge variant={isRunning ? "default" : "secondary"}>
                {completedSteps}/{workflowSteps.length} Steps Complete
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={totalProgress} className="h-3 mb-4" />
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>Overall Progress</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflowSteps.map((step, index) => (
            <Card key={step.id} className={`transition-all ${
              currentStepIndex === index && isRunning ? 'ring-2 ring-indigo-500' : ''
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStepStatusColor(step.status)}`} />
                    <span className="text-lg">{step.icon}</span>
                    <div>
                      <div className="font-semibold">{step.name}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{step.agent}</div>
                    </div>
                  </div>
                  <Badge variant={
                    step.status === 'completed' ? 'default' :
                    step.status === 'running' ? 'secondary' :
                    step.status === 'error' ? 'destructive' : 'outline'
                  }>
                    {step.status}
                  </Badge>
                </CardTitle>
                {step.status === 'running' && (
                  <Progress value={step.progress} className="h-2" />
                )}
              </CardHeader>
              
              {step.output && (
                <CardContent>
                  {editingStep === step.id ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={8}
                        className="font-mono text-sm"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}>
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                          {step.output.substring(0, 300)}
                          {step.output.length > 300 && '...'}
                        </pre>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditStep(step.id)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Results Summary */}
        {completedSteps === workflowSteps.length && (
          <Card className="mt-8 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">
                🎉 Workflow Complete!
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                All AI agents have completed their tasks. Your content strategy is ready for execution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Content
                </Button>
                <Button variant="outline">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Start Publishing
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AIWorkflow