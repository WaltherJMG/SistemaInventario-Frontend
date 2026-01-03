import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Login from './pages/Login'
import Signin from './pages/Signin'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Motion from './pages/Motion'
import './App.css'

function App() {

  return (
    <BrowserRouter>
     <div className=' w-full h-screen'>
      <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Signin />} />

          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Navigate to='home' replace />} />  
            <Route path="home" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="motion" element={<Motion />} />
          </Route>
          
      </Routes>
     </div>
    </BrowserRouter>
  )
}

export default App
