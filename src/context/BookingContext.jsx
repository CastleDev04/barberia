import { createContext, useContext, useState, useEffect } from 'react';
import { bookingService } from '../services/booking.service';

const BookingContext = createContext(null);

const INITIAL_STATE = {
  services: [],
  barber: null,
  date: null,
  time: null,
  client: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  },
};

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(INITIAL_STATE);
  const [step, setStep] = useState(1);
  const [serviciosDB, setServiciosDB] = useState([]);
  const [barberosDB, setBarberosDB] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verificandoCliente, setVerificandoCliente] = useState(false);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  // Cargar servicios y barberos desde la BD
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      const serviciosResult = await bookingService.getServicios();
      if (serviciosResult.success) {
        setServiciosDB(serviciosResult.data);
      }
      
      const barberosResult = await bookingService.getBarberos();
      if (barberosResult.success) {
        setBarberosDB(barberosResult.data);
      }
      setLoading(false);
    };
    cargarDatos();
  }, []);

  // Cargar horarios disponibles cuando cambia barbero o fecha
  useEffect(() => {
    const cargarHorarios = async () => {
      if (booking.barber && booking.date) {
        setCargandoHorarios(true);
        const fechaStr = booking.date.toISOString().split('T')[0];
        console.log('Cargando horarios para:', booking.barber.id_barbero, fechaStr);
        const result = await bookingService.getHorariosDisponibles(booking.barber.id_barbero, fechaStr);
        if (result.success) {
          setHorariosDisponibles(result.data);
        } else {
          console.error('Error cargando horarios:', result.error);
          setHorariosDisponibles([]);
        }
        setCargandoHorarios(false);
      } else {
        setHorariosDisponibles([]);
      }
    };
    cargarHorarios();
  }, [booking.barber, booking.date]);

  const updateBooking = (key, value) =>
    setBooking(prev => {
      if (key === 'service' || key === 'services') {
        if (Array.isArray(value)) return { ...prev, services: value };
        const svc = value;
        const exists = prev.services?.some(s => s.id_servicio === svc.id_servicio);
        let newServices;
        if (exists) {
          newServices = prev.services.filter(s => s.id_servicio !== svc.id_servicio);
        } else {
          newServices = [...(prev.services || []), svc];
        }
        return { ...prev, services: newServices };
      }
      return { ...prev, [key]: value };
    });

  const updateClient = (field, value) =>
    setBooking(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value },
    }));

  const verificarClienteExistente = async (email, phone) => {
    if (!email && !phone) return null;
    setVerificandoCliente(true);
    const result = await bookingService.buscarCliente(email, phone);
    setVerificandoCliente(false);
    if (result.success && result.data) {
      setBooking(prev => ({
        ...prev,
        client: {
          firstName: result.data.nombre || '',
          lastName: result.data.apellido || '',
          phone: result.data.telefono || '',
          email: result.data.correo || '',
        }
      }));
      return result.data;
    }
    return null;
  };

  const resetBooking = () => {
    setBooking(INITIAL_STATE);
    setStep(1);
    setHorariosDisponibles([]);
  };

  const toJSON = () => ({
    services: (booking.services || []).map(s => ({ 
      id: s.id_servicio, 
      name: s.nombre_servicio, 
      price: s.precio,
      duration: s.duracion 
    })),
    barber: booking.barber ? { id: booking.barber.id_barbero, name: booking.barber.nombres } : null,
    date: booking.date ? booking.date.toISOString().split('T')[0] : null,
    time: booking.time,
    client: {
      firstName: booking.client.firstName,
      lastName: booking.client.lastName,
      phone: booking.client.phone,
      email: booking.client.email,
    },
    createdAt: new Date().toISOString(),
  });

  const isComplete = () =>
    booking.services && booking.services.length > 0 &&
    booking.barber &&
    booking.date &&
    booking.time &&
    booking.client.firstName &&
    booking.client.lastName &&
    booking.client.phone &&
    booking.client.email;

  return (
    <BookingContext.Provider value={{
      booking,
      step,
      setStep,
      updateBooking,
      updateClient,
      resetBooking,
      toJSON,
      isComplete,
      serviciosDB,
      barberosDB,
      horariosDisponibles,
      loading,
      cargandoHorarios,
      verificandoCliente,
      verificarClienteExistente,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};