import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import DetallePedido from './pages/DetallePedido'
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pedidos/:id" element={<DetallePedido />} />
      </Routes>
    </BrowserRouter>
  )
}