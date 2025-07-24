import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Brain, 
  Lightbulb, 
  PenTool, 
  Search, 
  CheckCircle, 
  Calendar, 
  Send, 
  BarChart3,
  Sparkles,
  Plus,
  Settings,
  Users,
  Bell,
  Moon,
  Sun,
  LogOut,
  Play,
  Pause,
  MoreHorizontal,
  TrendingUp,
  Clock,
  Target,
  Zap,
  ArrowRight,
  Activity,
  Eye,
  Heart,
  MessageCircle,
  Share
} from 'lucide-react'
import { blink } from '../blink/client'

interface DashboardProps {
  user: any
  onNavigate: (page: string, campaignId?: string) => void
  onSignOut: () => void
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onSignOut }) => {
  const [darkMode, setDarkMode] = useState(false)
  const [activeAgents, setActiveAgents] = useState(0)
  const [campaigns, setCampaigns] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleLogout = () => {
    onSignOut()
  }

  const agents = useMemo(() => [
    {
      id: 'planning',
      icon: Calendar,
      name: 'Planning Agent',
      description: 'Content calendar & strategy',
      status: 'active',
      color: 'bg-blue-500',
      progress: 85,
      lastAction: 'Generated 7-day content calendar',
      metrics: { tasks: 12, completed: 10 }
    },
    {
      id: 'brainstorming',
      icon: Lightbulb,
      name: 'Brainstorming Agent',
      description: 'Creative ideas & topics',
      status: 'active',
      color: 'bg-yellow-500',
      progress: 92,
      lastAction: 'Suggested 15 new video ideas',
      metrics: { tasks: 8, completed: 7 }
    },
    {
      id: 'creative',
      icon: PenTool,
      name: 'Creative Agent',
      description: 'Content creation & drafts',
      status: 'working',
      color: 'bg-purple-500',
      progress: 67,
      lastAction: 'Drafting YouTube script...',
      metrics: { tasks: 15, completed: 10 }
    },
    {
      id: 'competitor',
      icon: Search,
      name: 'Competitor Analysis',
      description: 'Market insights & trends',
      status: 'idle',
      color: 'bg-green-500',
      progress: 100,
      lastAction: 'Analyzed 5 competitor channels',
      metrics: { tasks: 3, completed: 3 }
    },
    {
      id: 'evaluation',
      icon: CheckCircle,
      name: 'Evaluation Agent',
      description: 'Content review & optimization',
      status: 'active',
      color: 'bg-orange-500',
      progress: 78,
      lastAction: 'Reviewed 3 draft posts',
      metrics: { tasks: 6, completed: 5 }
    },
    {
      id: 'scheduling',
      icon: Clock,
      name: 'Scheduling Agent',
      description: 'Publishing timeline',
      status: 'active',
      color: 'bg-pink-500',
      progress: 95,
      lastAction: 'Scheduled 12 posts this week',
      metrics: { tasks: 20, completed: 19 }
    },
    {
      id: 'publishing',
      icon: Send,
      name: 'Publishing Agent',
      description: 'Multi-platform posting',
      status: 'working',
      color: 'bg-indigo-500',
      progress: 45,
      lastAction: 'Publishing to Instagram...',
      metrics: { tasks: 8, completed: 4 }
    },
    {
      id: 'performance',
      icon: BarChart3,
      name: 'Performance Agent',
      description: 'Analytics & insights',
      status: 'active',
      color: 'bg-red-500',
      progress: 88,
      lastAction: 'Generated weekly report',
      metrics: { tasks: 5, completed: 4 }
    }
  ], [])

  const mockCampaigns = useMemo(() => [
    {
      id: 1,
      name: 'Q1 Product Launch',
      status: 'active',
      progress: 75,
      dueDate: '2024-03-15',
      platforms: ['YouTube', 'Instagram', 'LinkedIn'],
      agentsInvolved: 6,
      contentPieces: 24,
      engagement: '+15%'
    },
    {
      id: 2,
      name: 'Educational Series',
      status: 'planning',
      progress: 30,
      dueDate: '2024-02-28',
      platforms: ['YouTube', 'Blog'],
      agentsInvolved: 4,
      contentPieces: 12,
      engagement: 'N/A'
    },
    {
      id: 3,
      name: 'Brand Awareness',
      status: 'completed',
      progress: 100,
      dueDate: '2024-01-31',
      platforms: ['Instagram', 'Twitter', 'LinkedIn'],
      agentsInvolved: 8,
      contentPieces: 36,
      engagement: '+28%'
    }
  ], [])

  const mockActivity = useMemo(() => [
    {
      id: 1,
      agent: 'Creative Agent',
      action: 'Generated YouTube script for "AI in 2024"',
      time: '2 minutes ago',
      type: 'creation'
    },
    {
      id: 2,
      agent: 'Publishing Agent',
      action: 'Posted to Instagram: "Morning motivation"',
      time: '15 minutes ago',
      type: 'publish'
    },
    {
      id: 3,
      agent: 'Performance Agent',
      action: 'Detected trending hashtag: #TechTrends2024',
      time: '1 hour ago',
      type: 'insight'
    },
    {
      id: 4,
      agent: 'Scheduling Agent',
      action: 'Scheduled 5 posts for tomorrow',
      time: '2 hours ago',
      type: 'schedule'
    },
    {
      id: 5,
      agent: 'Competitor Analysis',
      action: 'Found new competitor strategy insight',
      time: '3 hours ago',
      type: 'analysis'
    }
  ], [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'working': return 'bg-blue-500'
      case 'idle': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'working': return 'Working'
      case 'idle': return 'Idle'
      default: return 'Unknown'
    }
  }

  useEffect(() => {
    setActiveAgents(agents.filter(agent => agent.status === 'active' || agent.status === 'working').length)
    setCampaigns(mockCampaigns)
    setRecentActivity(mockActivity)
  }, [agents, mockCampaigns, mockActivity])

  return (
    <div className={`min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Slush AI</span>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              {activeAgents} agents active
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('ai-workflow')}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Workflow
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('integrations')}>
              <Settings className="w-4 h-4 mr-2" />
              Integrations
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('team')}>
              <Users className="w-4 h-4 mr-2" />
              Team
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Your AI agents have been busy. Here's what's happening with your content.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                  <p className="text-2xl font-bold">{activeAgents}</p>
                </div>
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Content Created</p>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-green-600">+12% this week</p>
                </div>
                <PenTool className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                  <p className="text-2xl font-bold">+23%</p>
                  <p className="text-xs text-green-600">vs last month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Saved</p>
                  <p className="text-2xl font-bold">32h</p>
                  <p className="text-xs text-green-600">this week</p>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* AI Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your AI Agent Team</h2>
              <Button onClick={() => onNavigate('campaign-creator')}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Campaign
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {agents.map((agent, index) => (
                <Card 
                  key={agent.id} 
                  className="agent-card cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 ${agent.color} rounded-full flex items-center justify-center`}>
                        <agent.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                        <span className="text-xs text-muted-foreground">{getStatusText(agent.status)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription className="text-sm">{agent.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{agent.progress}%</span>
                        </div>
                        <Progress value={agent.progress} className="h-2" />
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <p className="mb-2">{agent.lastAction}</p>
                        <div className="flex justify-between">
                          <span>{agent.metrics.completed}/{agent.metrics.tasks} tasks</span>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Active Campaigns</h2>
              <Button onClick={() => onNavigate('campaign-creator')}>
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </div>

            <div className="space-y-4">
              {mockCampaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">Due: {campaign.dueDate}</p>
                      </div>
                      <Badge variant={campaign.status === 'active' ? 'default' : campaign.status === 'completed' ? 'secondary' : 'outline'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={campaign.progress} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{campaign.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Platforms</p>
                        <p className="text-sm font-medium">{campaign.platforms.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Content Pieces</p>
                        <p className="text-sm font-medium">{campaign.contentPieces}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Engagement</p>
                        <p className="text-sm font-medium text-green-600">{campaign.engagement}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {campaign.agentsInvolved} agents involved
                      </p>
                      <Button variant="outline" size="sm">
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Performance Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Performance</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Views</span>
                      </div>
                      <span className="font-semibold">124.5K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Likes</span>
                      </div>
                      <span className="font-semibold">8.2K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Comments</span>
                      </div>
                      <span className="font-semibold">1.1K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Share className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Shares</span>
                      </div>
                      <span className="font-semibold">456</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Agent Efficiency</CardTitle>
                  <CardDescription>Tasks completed this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agents.slice(0, 4).map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${agent.color} rounded-full flex items-center justify-center`}>
                            <agent.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium">{agent.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={agent.progress} className="w-16 h-2" />
                          <span className="text-sm text-muted-foreground">{agent.metrics.completed}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.agent}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Dashboard