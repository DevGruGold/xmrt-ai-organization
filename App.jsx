import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Dashboard from './components/Dashboard'
import ElizaChat from './components/ElizaChat'
import TokenInfo from './components/TokenInfo'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <Hero />
      <Dashboard />
      <ElizaChat />
      <TokenInfo />
      <Footer />
    </div>
  )
}

export default App
