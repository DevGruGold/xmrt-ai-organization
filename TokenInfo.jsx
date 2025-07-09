import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Coins, 
  ExternalLink, 
  Copy, 
  TrendingUp, 
  Users, 
  Lock,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const TokenInfo = () => {
  const [copied, setCopied] = useState(false)
  
  const tokenAddress = '0x77307DFbc436224d5e6f2048d2b6bDfA66998a15'
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tokenStats = [
    { label: 'Total Supply', value: '1,000,000 XMRT', change: null },
    { label: 'Circulating Supply', value: '750,000 XMRT', change: '+2.5%' },
    { label: 'Market Cap', value: '$2.4M', change: '+12.8%' },
    { label: 'Holders', value: '1,247', change: '+8.2%' },
    { label: 'Treasury Balance', value: '150,000 XMRT', change: '-1.2%' },
    { label: 'Staked Tokens', value: '450,000 XMRT', change: '+5.7%' }
  ]

  const recentTransactions = [
    {
      type: 'governance',
      description: 'Proposal #42 execution reward',
      amount: '+500 XMRT',
      hash: '0x1a2b3c...',
      time: '2 min ago'
    },
    {
      type: 'treasury',
      description: 'Treasury rebalancing',
      amount: '-2,500 XMRT',
      hash: '0x4d5e6f...',
      time: '15 min ago'
    },
    {
      type: 'staking',
      description: 'Staking rewards distribution',
      amount: '+1,250 XMRT',
      hash: '0x7g8h9i...',
      time: '1 hour ago'
    }
  ]

  return (
    <section id="treasury" className="py-16 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">XMRT Token</h2>
          <p className="text-slate-400 text-lg">Governance token powering the XMRT DAO ecosystem</p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Token Overview */}
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-2xl">XMRT Token</CardTitle>
                    <p className="text-slate-400">Sepolia Testnet</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Contract Address</h4>
                  <div className="flex items-center space-x-2 bg-slate-900 rounded-lg p-3">
                    <code className="text-blue-400 text-sm flex-1 font-mono">{tokenAddress}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                      className="border-slate-600 text-slate-400 hover:text-white"
                    >
                      {copied ? 'Copied!' : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-400 hover:text-white"
                      onClick={() => window.open(`https://sepolia.etherscan.io/token/${tokenAddress}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Quick Actions</h4>
                  <div className="flex space-x-2">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                      <Wallet className="w-4 h-4 mr-2" />
                      Add to Wallet
                    </Button>
                    <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white flex-1">
                      <Lock className="w-4 h-4 mr-2" />
                      Stake Tokens
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Token Statistics */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Token Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tokenStats.map((stat, index) => (
                    <div key={index} className="bg-slate-900 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-slate-400 text-sm">{stat.label}</p>
                        {stat.change && (
                          <span className={`text-xs flex items-center ${
                            stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {stat.change.startsWith('+') ? (
                              <ArrowUpRight className="w-3 h-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 mr-1" />
                            )}
                            {stat.change}
                          </span>
                        )}
                      </div>
                      <p className="text-white font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              tx.type === 'governance' ? 'border-blue-400 text-blue-400' :
                              tx.type === 'treasury' ? 'border-yellow-400 text-yellow-400' :
                              'border-green-400 text-green-400'
                            }`}
                          >
                            {tx.type}
                          </Badge>
                          <span className="text-slate-400 text-xs">{tx.time}</span>
                        </div>
                        <p className="text-white text-sm">{tx.description}</p>
                        <code className="text-slate-500 text-xs">{tx.hash}</code>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {tx.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-slate-600 text-slate-400 hover:text-white"
                  onClick={() => window.open(`https://sepolia.etherscan.io/token/${tokenAddress}`, '_blank')}
                >
                  View All Transactions
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TokenInfo

