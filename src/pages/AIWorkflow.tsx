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
      let prompt = ''
      let previousOutput = ''
      
      // Get previous step output for context
      if (stepIndex > 0) {
        previousOutput = workflowSteps[stepIndex - 1].output || ''
      }

      // Generate step-specific prompts
      switch (step.id) {
        case 'planning':
          prompt = `Create a comprehensive content planning strategy for a creator campaign. Include:
          1. Content calendar for the next 4 weeks
          2. Key themes and topics
          3. Content pillars
          4. Posting frequency recommendations
          5. Platform-specific adaptations
          
          Format as a detailed plan with actionable items.`
          break
          
        case 'brainstorming':
          prompt = `Based on this content plan: "${previousOutput}"
          
          Generate 10 creative content ideas including:
          1. Engaging headlines/hooks
          2. Content formats (video, post, story, etc.)
          3. Key messages
          4. Visual concepts
          5. Call-to-action suggestions
          
          Make ideas specific, actionable, and engaging.`
          break
          
        case 'creative':
          prompt = `Using these content ideas: "${previousOutput}"
          
          Create detailed content for the top 3 ideas:
          1. Full scripts/copy
          2. Visual descriptions
          3. Platform-specific versions
          4. Hashtag suggestions
          5. Engagement hooks
          
          Make content ready for production.`
          break
          
        case 'competitor':
          prompt = `Analyze competitor content strategies and provide:
          1. Top 5 competitor analysis
          2. Content gaps and opportunities
          3. Trending topics in the niche
          4. Best performing content types
          5. Differentiation strategies
          
          Focus on actionable competitive insights.`
          break
          
        case 'evaluation':
          prompt = `Evaluate this content: "${previousOutput}"
          
          Provide detailed feedback on:
          1. Content quality and engagement potential
          2. SEO optimization suggestions
          3. Brand alignment
          4. Audience relevance
          5. Improvement recommendations
          
          Include specific, actionable feedback.`
          break
          
        case 'scheduling':
          prompt = `Create a publishing schedule based on: "${previousOutput}"
          
          Include:
          1. Optimal posting times for each platform
          2. Content sequencing strategy
          3. Cross-platform promotion plan
          4. Engagement follow-up schedule
          5. Performance tracking milestones
          
          Provide a detailed timeline.`
          break
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setWorkflowSteps(prev => prev.map((s, i) => 
          i === stepIndex && s.status === 'running' 
            ? { ...s, progress: Math.min(s.progress + 10, 90) } 
            : s
        ))
      }, 200)

      // Generate content using AI
      const { text } = await blink.ai.generateText({
        prompt,
        maxTokens: 1500
      })

      clearInterval(progressInterval)

      // Update step with completed status and output
      setWorkflowSteps(prev => prev.map((s, i) => 
        i === stepIndex 
          ? { ...s, status: 'completed' as const, progress: 100, output: text }
          : s
      ))

      // Save to database
      await blink.db.content.create({
        campaign_id: campaignId || 'demo-campaign',
        agent_type: step.id,
        content_type: 'ai_generated',
        title: step.name,
        content: text,
        status: 'completed',
        user_id: 'current-user',
        created_at: new Date().toISOString()
      })

    } catch (error) {
      console.error(`Error in ${step.name}:`, error)
      setWorkflowSteps(prev => prev.map((s, i) => 
        i === stepIndex 
          ? { ...s, status: 'error' as const, progress: 0 }
          : s
      ))
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