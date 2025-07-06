import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  TrendingUp, 
  Users, 
  Vote, 
  Coins, 
  Bot, 
  Activity,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import aiAgentIcon from '../assets/ai-agent-icon.png'

const Dashboard = () => {
  const [activeProposals] = useState([
    {
      id: 1,
      title: "Increase Treasury Allocation for AI Development",
      description: "Proposal to allocate 15% more funds to AI agent development and training",
      status: "active",
      votesFor: 1250,
      votesAgainst: 340,
      totalVotes: 1590,
      timeLeft: "2 days",
      aiRecommendation: "Support"
    },
    {
      id: 2,
      title: "Deploy New Eliza Agent for Market Analysis",
      description: "Create specialized AI agent for real-time market analysis and trading recommendations",
      status: "pending",
      votesFor: 890,
      votesAgainst: 120,
      totalVotes: 1010,
      timeLeft: "5 days",
      aiRecommendation: "Support"
    },
    {
      id: 3,
      title: "Upgrade Zero-Knowledge Proof Infrastructure",
      description: "Implement advanced ZK-STARK technology for enhanced privacy and verification",
      status: "executed",
      votesFor: 2100,
      votesAgainst: 450,
      totalVotes: 2550,
      timeLeft: "Completed",
      aiRecommendation: "Executed"
    }
  ])

  const [aiAgents] = useState([
    {
      id: 1,
      name: "Eliza-Treasury",
      type: "Financial Management",
      status: "active",
      lastAction: "Optimized portfolio allocation",
      performance: 94
    },
    {
      id: 2,
      name: "Eliza-Governance",
      type: "Proposal Analysis",
      status: "active",
      lastAction: "Analyzed proposal #42",
      performance: 97
    },
    {
      id: 3,
      name: "Eliza-Security",
      type: "Risk Assessment",
      status: "active",
      lastAction: "Completed security audit",
      performance: 91
    }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'executed': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'executed': return <CheckCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <section id="dashboard" className="py-16 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">DAO Dashboard</h2>
          <p className="text-slate-400 text-lg">Real-time insights into your autonomous organization</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Value Locked</CardTitle>
              <Coins className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$2.4M</div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Members</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1,247</div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8.2% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Proposals</CardTitle>
              <Vote className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
              <p className="text-xs text-slate-400">2 pending votes</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">AI Agents</CardTitle>
              <Bot className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
              <p className="text-xs text-green-400">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Proposals */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Vote className="w-5 h-5 mr-2 text-blue-400" />
                Active Proposals
              </CardTitle>
              <CardDescription className="text-slate-400">
                Current governance proposals and voting status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProposals.map((proposal) => (
                <div key={proposal.id} className="border border-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium text-sm">{proposal.title}</h4>
                    <Badge className={`${getStatusColor(proposal.status)} text-white`}>
                      {getStatusIcon(proposal.status)}
                      <span className="ml-1 capitalize">{proposal.status}</span>
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-xs mb-3">{proposal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400">For: {proposal.votesFor}</span>
                      <span className="text-red-400">Against: {proposal.votesAgainst}</span>
                    </div>
                    <Progress 
                      value={(proposal.votesFor / proposal.totalVotes) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">{proposal.timeLeft}</span>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        AI: {proposal.aiRecommendation}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Agents Status */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bot className="w-5 h-5 mr-2 text-blue-400" />
                AI Agents Status
              </CardTitle>
              <CardDescription className="text-slate-400">
                Monitor your autonomous agents performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiAgents.map((agent) => (
                <div key={agent.id} className="border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <img src={aiAgentIcon} alt="AI Agent" className="w-8 h-8" />
                      <div>
                        <h4 className="text-white font-medium text-sm">{agent.name}</h4>
                        <p className="text-slate-400 text-xs">{agent.type}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      <Activity className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-slate-400 text-xs">Last Action: {agent.lastAction}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Performance</span>
                      <span className="text-xs text-green-400">{agent.performance}%</span>
                    </div>
                    <Progress value={agent.performance} className="h-2" />
                  </div>
                </div>
              ))}
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Interact with Agents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Dashboard

