import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Users, Crown, Shield, User, Mail, Calendar, MessageSquare, Bell, Settings } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Textarea } from '../components/ui/textarea'
import { Switch } from '../components/ui/switch'
import { blink } from '../blink/client'

interface TeamCollaborationProps {
  onBack: () => void
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  avatar?: string
  status: 'active' | 'pending' | 'inactive'
  joinedAt: string
  lastActive: string
  permissions: {
    campaigns: boolean
    content: boolean
    analytics: boolean
    integrations: boolean
    billing: boolean
  }
}

interface Project {
  id: string
  name: string
  description: string
  members: string[]
  createdAt: string
  status: 'active' | 'archived'
  campaigns: number
}

interface Activity {
  id: string
  userId: string
  userName: string
  action: string
  target: string
  timestamp: string
  type: 'campaign' | 'content' | 'member' | 'integration'
}

const TeamCollaboration: React.FC<TeamCollaborationProps> = ({ onBack }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'owner',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      status: 'active',
      joinedAt: '2024-01-15',
      lastActive: '2 minutes ago',
      permissions: {
        campaigns: true,
        content: true,
        analytics: true,
        integrations: true,
        billing: true
      }
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@company.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'active',
      joinedAt: '2024-01-20',
      lastActive: '1 hour ago',
      permissions: {
        campaigns: true,
        content: true,
        analytics: true,
        integrations: true,
        billing: false
      }
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@company.com',
      role: 'editor',
      status: 'active',
      joinedAt: '2024-02-01',
      lastActive: '3 hours ago',
      permissions: {
        campaigns: true,
        content: true,
        analytics: false,
        integrations: false,
        billing: false
      }
    },
    {
      id: '4',
      name: 'Alex Rodriguez',
      email: 'alex@company.com',
      role: 'viewer',
      status: 'pending',
      joinedAt: '2024-02-10',
      lastActive: 'Never',
      permissions: {
        campaigns: false,
        content: false,
        analytics: false,
        integrations: false,
        billing: false
      }
    }
  ])

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Q1 Product Launch',
      description: 'Marketing campaign for new product launch',
      members: ['1', '2', '3'],
      createdAt: '2024-01-15',
      status: 'active',
      campaigns: 3
    },
    {
      id: '2',
      name: 'Brand Awareness Campaign',
      description: 'Building brand recognition across social platforms',
      members: ['1', '2'],
      createdAt: '2024-02-01',
      status: 'active',
      campaigns: 2
    }
  ])

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Mike Chen',
      action: 'created campaign',
      target: 'Summer Sale 2024',
      timestamp: '2 hours ago',
      type: 'campaign'
    },
    {
      id: '2',
      userId: '3',
      userName: 'Emma Davis',
      action: 'edited content',
      target: 'Instagram Post #1',
      timestamp: '4 hours ago',
      type: 'content'
    },
    {
      id: '3',
      userId: '1',
      userName: 'Sarah Johnson',
      action: 'invited member',
      target: 'alex@company.com',
      timestamp: '1 day ago',
      type: 'member'
    },
    {
      id: '4',
      userId: '2',
      userName: 'Mike Chen',
      action: 'connected integration',
      target: 'LinkedIn',
      timestamp: '2 days ago',
      type: 'integration'
    }
  ])

  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'editor' as TeamMember['role'],
    message: ''
  })

  const [isInviting, setIsInviting] = useState(false)

  const roleColors = {
    owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    editor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    viewer: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
  }

  const roleIcons = {
    owner: <Crown className="h-4 w-4" />,
    admin: <Shield className="h-4 w-4" />,
    editor: <User className="h-4 w-4" />,
    viewer: <User className="h-4 w-4" />
  }

  const inviteTeamMember = async () => {
    setIsInviting(true)
    try {
      const user = await blink.auth.me()
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(inviteForm.email)) {
        throw new Error('Please enter a valid email address')
      }
      
      // Check if member already exists
      const existingMembers = await blink.db.team_members.list({
        where: { email: inviteForm.email },
        limit: 1
      })
      
      if (existingMembers.length > 0) {
        throw new Error('This email is already invited or part of the team')
      }
      
      // Generate invitation token
      const invitationToken = `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: inviteForm.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: inviteForm.email,
        role: inviteForm.role,
        status: 'pending',
        joinedAt: new Date().toISOString().split('T')[0],
        lastActive: 'Never',
        permissions: {
          campaigns: inviteForm.role !== 'viewer',
          content: inviteForm.role !== 'viewer',
          analytics: ['owner', 'admin'].includes(inviteForm.role),
          integrations: ['owner', 'admin'].includes(inviteForm.role),
          billing: inviteForm.role === 'owner'
        }
      }

      setTeamMembers(prev => [...prev, newMember])
      
      // Save to database with proper relationships
      await blink.db.team_members.create({
        id: `member_${Date.now()}`,
        email: inviteForm.email,
        name: newMember.name,
        role: inviteForm.role,
        status: 'pending',
        invitation_token: invitationToken,
        invitation_message: inviteForm.message,
        invited_by: user.id,
        invited_at: new Date().toISOString(),
        user_id: user.id // This represents the team owner
      })

      // Log team activity
      await blink.db.activity_log.create({
        user_id: user.id,
        action: 'team_member_invited',
        target: inviteForm.email,
        details: `Invited ${inviteForm.email} as ${inviteForm.role}${inviteForm.message ? ' with personal message' : ''}`,
        timestamp: new Date().toISOString()
      })

      // In a real app, you would send an email invitation here
      // await sendInvitationEmail(inviteForm.email, invitationToken, inviteForm.message)
      
      setInviteForm({ email: '', role: 'editor', message: '' })
    } catch (error) {
      console.error('Failed to invite member:', error)
      // You could show this error to the user via a toast or alert
      alert(error.message || 'Failed to invite team member. Please try again.')
    } finally {
      setIsInviting(false)
    }
  }

  const updateMemberRole = async (memberId: string, newRole: TeamMember['role']) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { 
            ...member, 
            role: newRole,
            permissions: {
              campaigns: newRole !== 'viewer',
              content: newRole !== 'viewer',
              analytics: ['owner', 'admin'].includes(newRole),
              integrations: ['owner', 'admin'].includes(newRole),
              billing: newRole === 'owner'
            }
          }
        : member
    ))
  }

  const removeMember = async (memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId))
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'campaign': return '🚀'
      case 'content': return '✏️'
      case 'member': return '👥'
      case 'integration': return '🔗'
      default: return '📝'
    }
  }

  const activeMembers = teamMembers.filter(m => m.status === 'active').length
  const pendingInvites = teamMembers.filter(m => m.status === 'pending').length

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
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Team Collaboration</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your team and collaborate on campaigns
              </p>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your Slush AI team
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteForm.role} onValueChange={(value: TeamMember['role']) => 
                    setInviteForm(prev => ({ ...prev, role: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer - View only access</SelectItem>
                      <SelectItem value="editor">Editor - Create and edit content</SelectItem>
                      <SelectItem value="admin">Admin - Full access except billing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Personal Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Welcome to our team! Looking forward to collaborating..."
                    value={inviteForm.message}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <Button
                  onClick={inviteTeamMember}
                  disabled={isInviting || !inviteForm.email}
                  className="w-full"
                >
                  {isInviting ? 'Sending Invitation...' : 'Send Invitation'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Team Members</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{teamMembers.length}</p>
                </div>
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active Members</p>
                  <p className="text-2xl font-bold text-green-600">{activeMembers}</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pending Invites</p>
                  <p className="text-2xl font-bold text-amber-600">{pendingInvites}</p>
                </div>
                <Mail className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active Projects</p>
                  <p className="text-2xl font-bold text-indigo-600">{projects.filter(p => p.status === 'active').length}</p>
                </div>
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          </TabsList>

          {/* Team Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{member.email}</p>
                        </div>
                      </div>
                      <Badge className={roleColors[member.role]}>
                        {roleIcons[member.role]}
                        <span className="ml-1 capitalize">{member.role}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Status:</span>
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Last Active:</span>
                      <span>{member.lastActive}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Permissions:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center gap-1 ${member.permissions.campaigns ? 'text-green-600' : 'text-slate-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${member.permissions.campaigns ? 'bg-green-500' : 'bg-slate-300'}`} />
                          Campaigns
                        </div>
                        <div className={`flex items-center gap-1 ${member.permissions.content ? 'text-green-600' : 'text-slate-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${member.permissions.content ? 'bg-green-500' : 'bg-slate-300'}`} />
                          Content
                        </div>
                        <div className={`flex items-center gap-1 ${member.permissions.analytics ? 'text-green-600' : 'text-slate-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${member.permissions.analytics ? 'bg-green-500' : 'bg-slate-300'}`} />
                          Analytics
                        </div>
                        <div className={`flex items-center gap-1 ${member.permissions.integrations ? 'text-green-600' : 'text-slate-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${member.permissions.integrations ? 'bg-green-500' : 'bg-slate-300'}`} />
                          Integrations
                        </div>
                      </div>
                    </div>
                    
                    {member.role !== 'owner' && (
                      <div className="flex gap-2">
                        <Select
                          value={member.role}
                          onValueChange={(value: TeamMember['role']) => updateMemberRole(member.id, value)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeMember(member.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{project.name}</span>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Team Members:</span>
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((memberId) => {
                          const member = teamMembers.find(m => m.id === memberId)
                          return member ? (
                            <Avatar key={memberId} className="w-6 h-6 border-2 border-white dark:border-slate-800">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ) : null
                        })}
                        {project.members.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs">
                            +{project.members.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Campaigns:</span>
                      <span className="font-semibold">{project.campaigns}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Created:</span>
                      <span className="text-sm">{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" variant="ghost" className="p-2">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add New Project Card */}
              <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">📁</div>
                  <h3 className="text-lg font-semibold mb-2">Create New Project</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Organize your campaigns and collaborate with your team
                  </p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Feed Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Stay updated with your team's latest actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.userName}</span>
                          {' '}{activity.action}{' '}
                          <span className="font-medium text-indigo-600">{activity.target}</span>
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {activity.timestamp}
                        </p>
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

export default TeamCollaboration