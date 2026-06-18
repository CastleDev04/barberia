import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBarberos from './pages/admin/AdminBarberos';
import AdminEncargados from './pages/admin/AdminEncargados';
import AdminServicios from './pages/admin/AdminServicios';
import AdminClientes from './pages/admin/AdminClientes';
import AdminTurnos from './pages/admin/AdminTurnos';
import AdminHorarios from './pages/admin/AdminHorarios';
import AdminGastos from './pages/admin/AdminGastos';
import AdminPagos from './pages/admin/AdminPagos';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/reservar" element={<BookingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas del panel administrativo */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="barberos" element={<AdminBarberos />} />
              <Route path="encargados" element={<AdminEncargados />} />
              <Route path="servicios" element={<AdminServicios />} />
              <Route path="clientes" element={<AdminClientes />} />
              <Route path="turnos" element={<AdminTurnos />} />
              <Route path="horarios" element={<AdminHorarios />} />
              <Route path="gastos" element={<AdminGastos />} />
              <Route path="pagos" element={<AdminPagos />} />
            </Route>
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}