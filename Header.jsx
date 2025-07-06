import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Menu, X, Wallet } from 'lucide-react'
import xmrtLogo from '../assets/xmrt-logo.png'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={xmrtLogo} alt="XMRT DAO" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-white">XMRT DAO</h1>
              <p className="text-xs text-blue-400">Fully Automated AI Organization</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#dashboard" className="text-slate-300 hover:text-blue-400 transition-colors">
              Dashboard
            </a>
            <a href="#proposals" className="text-slate-300 hover:text-blue-400 transition-colors">
              Proposals
            </a>
            <a href="#agents" className="text-slate-300 hover:text-blue-400 transition-colors">
              AI Agents
            </a>
            <a href="#treasury" className="text-slate-300 hover:text-blue-400 transition-colors">
              Treasury
            </a>
            <a href="#governance" className="text-slate-300 hover:text-blue-400 transition-colors">
              Governance
            </a>
          </nav>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-800">
            <nav className="flex flex-col space-y-4 mt-4">
              <a href="#dashboard" className="text-slate-300 hover:text-blue-400 transition-colors">
                Dashboard
              </a>
              <a href="#proposals" className="text-slate-300 hover:text-blue-400 transition-colors">
                Proposals
              </a>
              <a href="#agents" className="text-slate-300 hover:text-blue-400 transition-colors">
                AI Agents
              </a>
              <a href="#treasury" className="text-slate-300 hover:text-blue-400 transition-colors">
                Treasury
              </a>
              <a href="#governance" className="text-slate-300 hover:text-blue-400 transition-colors">
                Governance
              </a>
              <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white mt-4">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

