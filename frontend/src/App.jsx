import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Signup } from './pages/signup'
import { Dashboard } from './pages/dashboard'
import { SendMoney } from './pages/SendMoney'
import { Signin } from './pages/signin'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element= {<Signup />} />
          <Route path='/signin' element= {<Signin />} />
          <Route path='/dashboard' element= {<Dashboard />} />
          <Route path='/send' element= {<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
