import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'
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
  Clock,
  TrendingUp,
  Users,
  Zap,
  Star,
  ArrowRight,
  Play,
  Check,
  Moon,
  Sun
} from 'lucide-react'

interface LandingPageProps {
  onLogin: () => void
  onNavigate: (page: string) => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onNavigate }) => {
  const [darkMode, setDarkMode] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const agents = [
    {
      icon: Calendar,
      name: 'Planning Agent',
      description: 'Generates content calendars based on your audience and trends',
      color: 'bg-blue-500'
    },
    {
      icon: Lightbulb,
      name: 'Brainstorming Agent',
      description: 'Suggests creative ideas, hooks, and topics for your content',
      color: 'bg-yellow-500'
    },
    {
      icon: PenTool,
      name: 'Creative Agent',
      description: 'Drafts scripts, outlines, copy, and visuals using AI',
      color: 'bg-purple-500'
    },
    {
      icon: Search,
      name: 'Competitor Analysis',
      description: 'Scans competitors and provides actionable insights',
      color: 'bg-green-500'
    },
    {
      icon: CheckCircle,
      name: 'Evaluation Agent',
      description: 'Reviews content for tone, SEO, and engagement optimization',
      color: 'bg-orange-500'
    },
    {
      icon: Clock,
      name: 'Scheduling Agent',
      description: 'Schedules approved content across all your platforms',
      color: 'bg-pink-500'
    },
    {
      icon: Send,
      name: 'Publishing Agent',
      description: 'Posts content and tracks status across channels',
      color: 'bg-indigo-500'
    },
    {
      icon: BarChart3,
      name: 'Performance Agent',
      description: 'Analyzes engagement and suggests micro-optimizations',
      color: 'bg-red-500'
    }
  ]

  const benefits = [
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Automate 80% of your content operations with AI agents'
    },
    {
      icon: TrendingUp,
      title: 'Increase Output',
      description: 'Produce 3x more high-quality content consistently'
    },
    {
      icon: Sparkles,
      title: 'Unlock Creativity',
      description: 'AI-powered brainstorming and creative assistance'
    },
    {
      icon: Zap,
      title: 'Outpace Competitors',
      description: 'Stay ahead with real-time competitor analysis'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'YouTube Creator',
      content: 'Slush AI transformed my content workflow. I went from 2 videos per week to 5, with better engagement rates!',
      avatar: '👩‍💻'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Instagram Influencer',
      content: 'The AI agents handle everything from planning to posting. I can finally focus on what I love - creating.',
      avatar: '👨‍🎨'
    },
    {
      name: 'Emma Thompson',
      role: 'Newsletter Writer',
      content: 'My newsletter grew from 1K to 10K subscribers in 3 months using Slush AI\'s content strategies.',
      avatar: '✍️'
    }
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '2 AI agents',
        '10 content pieces/month',
        'Basic analytics',
        'Email support'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For serious creators',
      features: [
        'All 8 AI agents',
        'Unlimited content',
        'Advanced analytics',
        'Priority support',
        'Team collaboration',
        'Custom integrations'
      ],
      popular: true
    },
    {
      name: 'Team',
      price: '$99',
      period: '/month',
      description: 'For creator teams',
      features: [
        'Everything in Pro',
        'Up to 10 team members',
        'Advanced team features',
        'Custom workflows',
        'Dedicated support',
        'White-label options'
      ],
      popular: false
    }
  ]

  const faqs = [
    {
      question: 'How do the AI agents work together?',
      answer: 'Our AI agents form an intelligent workflow where each agent passes data to the next. For example, the Planning Agent creates a content calendar, which the Brainstorming Agent uses to generate ideas, which the Creative Agent turns into drafts, and so on.'
    },
    {
      question: 'Which platforms do you integrate with?',
      answer: 'We integrate with YouTube, Instagram, LinkedIn, Twitter, TikTok, newsletters (Mailchimp, ConvertKit), and more. New integrations are added regularly based on user requests.'
    },
    {
      question: 'Can I customize the AI agents?',
      answer: 'Yes! Each agent can be customized to match your brand voice, content style, and specific requirements. You can also create custom workflows and automation rules.'
    },
    {
      question: 'Is my content data secure?',
      answer: 'Absolutely. We use enterprise-grade security with end-to-end encryption. Your content and data are never shared with third parties and you maintain full ownership.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.'
    }
  ]

  return (
    <div className={`min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Slush AI</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button onClick={onLogin} className="bg-primary hover:bg-primary/90">
              Start Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-4">
              🚀 AI Agents as Your Creative Partners
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Let AI Agents Handle Your{' '}
              <span className="gradient-text">Content Operations</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              8 specialized AI agents work together to plan, create, optimize, and publish your content across all platforms. 
              Focus on what matters while AI does the heavy lifting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" onClick={onLogin} className="bg-primary hover:bg-primary/90 text-lg px-8">
                Start Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Play className="mr-2 w-5 h-5" />
                See Agents in Action
              </Button>
            </div>

            {/* Agent Showcase */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {agents.slice(0, 8).map((agent, index) => (
                <div 
                  key={agent.name}
                  className="agent-card p-4 text-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 ${agent.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <agent.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground">{agent.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Creators Choose Slush AI</h2>
            <p className="text-xl text-muted-foreground">Transform your content workflow with AI-powered automation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={benefit.title} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Your AI Agent Team</h2>
            <p className="text-xl text-muted-foreground">8 specialized agents working in perfect harmony</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent, index) => (
              <Card key={agent.name} className="agent-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className={`w-16 h-16 ${agent.color} rounded-full flex items-center justify-center mb-4`}>
                    <agent.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{agent.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Creators Worldwide</h2>
            <p className="text-xl text-muted-foreground">See how Slush AI transforms content workflows</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the plan that fits your creator journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={plan.name} 
                className={`relative animate-fade-in ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-3" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={onLogin}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know about Slush AI</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-muted-foreground">Have questions? We'd love to hear from you.</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your content creation challenges..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">Slush AI</span>
              </div>
              <p className="text-muted-foreground text-sm">
                AI agents as your creative partners. Transform your content workflow today.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Integrations</a></li>
                <li><a href="#" className="hover:text-foreground">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">Community</a></li>
                <li><a href="#" className="hover:text-foreground">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Slush AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage