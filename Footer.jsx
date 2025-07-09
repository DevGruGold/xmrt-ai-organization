import { Github, Twitter, MessageCircle, ExternalLink } from 'lucide-react'
import xmrtLogo from '../assets/xmrt-logo.png'

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={xmrtLogo} alt="XMRT DAO" className="h-8 w-8" />
              <div>
                <h3 className="text-white font-bold text-lg">XMRT DAO</h3>
                <p className="text-blue-400 text-sm">Fully Automated AI Organization</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The world's first fully automated AI-powered DAO. Experience autonomous governance, 
              intelligent decision-making, and transparent treasury management powered by Eliza AI agents.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/DevGruGold/xmrt-ai-organization" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#dashboard" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#proposals" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Proposals
                </a>
              </li>
              <li>
                <a href="#agents" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  AI Agents
                </a>
              </li>
              <li>
                <a href="#treasury" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Treasury
                </a>
              </li>
              <li>
                <a href="#governance" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Governance
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://sepolia.etherscan.io/token/0x77307DFbc436224d5e6f2048d2b6bDfA66998a15" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center"
                >
                  Token Contract
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Whitepaper
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2025 XMRT DAO. Built with ❤️ for the future of autonomous organizations.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

