import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Send, 
  Bot, 
  User, 
  Zap,
  Brain,
  Shield,
  TrendingUp
} from 'lucide-react'
import aiAgentIcon from '../assets/ai-agent-icon.png'

const ElizaChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'agent',
      agent: 'Eliza-Governance',
      content: 'Hello! I\'m Eliza, your AI governance assistant. I can help you understand proposals, analyze voting patterns, and provide recommendations based on DAO data. How can I assist you today?',
      timestamp: new Date(Date.now() - 60000)
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState('Eliza-Governance')
  const messagesEndRef = useRef(null)

  const agents = [
    {
      name: 'Eliza-Governance',
      icon: Brain,
      color: 'text-blue-400',
      description: 'Proposal analysis and governance insights'
    },
    {
      name: 'Eliza-Treasury',
      icon: TrendingUp,
      color: 'text-green-400',
      description: 'Financial management and treasury operations'
    },
    {
      name: 'Eliza-Security',
      icon: Shield,
      color: 'text-red-400',
      description: 'Risk assessment and security monitoring'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAgentResponse = (userMessage) => {
    setIsTyping(true)
    
    setTimeout(() => {
      let response = ''
      
      if (userMessage.toLowerCase().includes('proposal')) {
        response = `Based on my analysis of current proposals, I recommend supporting Proposal #1 for increased AI development funding. The proposal shows strong community support with 78% approval rate and aligns with our long-term strategic goals. The treasury can accommodate this allocation without compromising operational reserves.`
      } else if (userMessage.toLowerCase().includes('treasury')) {
        response = `Current treasury status: $2.4M TVL with 15% growth this month. Asset allocation is optimized across DeFi protocols with 94% efficiency rating. I've identified 3 new yield opportunities that could increase returns by 8-12% annually while maintaining our risk parameters.`
      } else if (userMessage.toLowerCase().includes('security')) {
        response = `Security audit completed. All smart contracts are secure with no critical vulnerabilities detected. I've implemented additional monitoring for unusual transaction patterns and updated our risk assessment protocols. Current threat level: LOW.`
      } else if (userMessage.toLowerCase().includes('vote') || userMessage.toLowerCase().includes('voting')) {
        response = `Voting analysis shows healthy participation with 67% of token holders actively engaging in governance. I recommend implementing quadratic voting for the next proposal to ensure more equitable representation. Current proposal #2 needs 340 more votes to reach quorum.`
      } else {
        response = `I understand you're asking about "${userMessage}". As an AI agent in the XMRT DAO, I can provide insights on governance, treasury management, security, and proposal analysis. Could you be more specific about what aspect you'd like me to help with?`
      }

      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'agent',
        agent: selectedAgent,
        content: response,
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    simulateAgentResponse(inputMessage)
    setInputMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <section id="agents" className="py-16 bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Interact with Eliza AI Agents</h2>
          <p className="text-slate-400 text-lg">Communicate directly with our autonomous AI agents for governance insights and assistance</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Agent Selection */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Available Agents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {agents.map((agent) => {
                    const IconComponent = agent.icon
                    return (
                      <button
                        key={agent.name}
                        onClick={() => setSelectedAgent(agent.name)}
                        className={`w-full p-3 rounded-lg border transition-colors text-left ${
                          selectedAgent === agent.name
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <IconComponent className={`w-5 h-5 ${agent.color}`} />
                          <span className="text-white font-medium text-sm">{agent.name}</span>
                        </div>
                        <p className="text-slate-400 text-xs">{agent.description}</p>
                      </button>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="bg-slate-900 border-slate-700 h-[600px] flex flex-col">
                <CardHeader className="border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={aiAgentIcon} alt="AI Agent" className="w-8 h-8" />
                      <div>
                        <CardTitle className="text-white text-lg">{selectedAgent}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-500 text-white text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Online
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-200 border border-slate-700'
                          }`}
                        >
                          {message.type === 'agent' && (
                            <div className="flex items-center space-x-2 mb-2">
                              <Bot className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400 text-sm font-medium">{message.agent}</span>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.type === 'user' ? 'text-blue-200' : 'text-slate-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-end ${message.type === 'user' ? 'order-1 mr-2' : 'order-2 ml-2'}`}>
                        {message.type === 'user' ? (
                          <User className="w-6 h-6 text-slate-400" />
                        ) : (
                          <img src={aiAgentIcon} alt="AI Agent" className="w-6 h-6" />
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-2">
                        <img src={aiAgentIcon} alt="AI Agent" className="w-6 h-6" />
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input */}
                <div className="border-t border-slate-700 p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Ask ${selectedAgent} anything about the DAO...`}
                      className="flex-1 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ElizaChat

