import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useBooking } from '../context/BookingContext';
import { useClientes } from '../hooks/useClientes';
import { useTurnos } from '../hooks/useTurnos';

import ServiceCard from '../components/ui/ServiceCard';
import BarberCard from '../components/ui/BarberCard';
import TimeSlot from '../components/ui/TimeSlot';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import Calendar from '../components/booking/Calendar';
import BookingSummary from '../components/booking/BookingSummary';
import ConfirmationScreen from '../components/booking/ConfirmationScreen';

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: total }, (_, i) => i + 1).map((step, idx) => (
        <div key={step} className="flex items-center">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono font-medium
            transition-all duration-300
            ${step < current
              ? 'bg-[#C9A84C] text-black'
              : step === current
              ? 'bg-[rgba(201,168,76,0.15)] border-2 border-[#C9A84C] text-[#C9A84C]'
              : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] text-[#6B6357]'
            }
          `}>
            {step < current ? (
              <CheckCircle2 size={14} />
            ) : step}
          </div>
          {idx < total - 1 && (
            <div className={`w-8 h-[1px] transition-colors duration-300 ${step < current ? 'bg-[#C9A84C]' : 'bg-[rgba(255,255,255,0.1)]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div className="mb-10">
      <h3 className="font-display text-xl font-semibold text-[#F5F1EB] mb-6 flex items-center gap-3">
        <div className="gold-divider w-6" />
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function BookingPage() {
  const { 
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
    verificarClienteExistente
  } = useBooking();
  
  const { createItem: crearCliente } = useClientes();
  const { createItem: crearTurno } = useTurnos();
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [verificando, setVerificando] = useState(false);

  const validateClient = () => {
    const errs = {};
    if (!booking.client.firstName?.trim()) errs.firstName = 'Requerido';
    if (!booking.client.lastName?.trim()) errs.lastName = 'Requerido';
    if (!booking.client.phone?.trim()) errs.phone = 'Requerido';
    if (!booking.client.email?.trim()) errs.email = 'Requerido';
    else if (!/\S+@\S+\.\S+/.test(booking.client.email)) errs.email = 'Correo inválido';
    return errs;
  };

  // Verificar si el cliente ya existe
  const handleClientBlur = async (field, value) => {
    if ((field === 'email' || field === 'phone') && value) {
      if (booking.client.email || booking.client.phone) {
        setVerificando(true);
        await verificarClienteExistente(booking.client.email, booking.client.phone);
        setVerificando(false);
      }
    }
  };

  const handleSubmit = async () => {
    const errs = validateClient();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      document.querySelector('[data-section="client"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (!booking.services || booking.services.length === 0) { 
      alert('Por favor selecciona al menos un servicio'); 
      return; 
    }
    if (!booking.barber) { 
      alert('Por favor selecciona un barbero'); 
      return; 
    }
    if (!booking.date) { 
      alert('Por favor selecciona una fecha'); 
      return; 
    }
    if (!booking.time) { 
      alert('Por favor selecciona un horario'); 
      return; 
    }

    setStep(2);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    
    try {
      // 1. Buscar o crear cliente
      let cliente = await verificarClienteExistente(booking.client.email, booking.client.phone);
      
      if (!cliente) {
        const nuevoCliente = {
          nombre: booking.client.firstName,
          apellido: booking.client.lastName,
          telefono: booking.client.phone,
          correo: booking.client.email
        };
        
        console.log('📝 Creando nuevo cliente:', nuevoCliente);
        const clienteResult = await crearCliente(nuevoCliente);
        
        if (clienteResult.success) {
          cliente = clienteResult.data;
          console.log('✅ Cliente creado:', cliente);
        } else {
          throw new Error(clienteResult.error || 'Error al crear cliente');
        }
      } else {
        console.log('✅ Cliente existente:', cliente);
      }
      
      // 2. Calcular duración total y hora de fin
      const duracionTotal = booking.services.reduce((sum, s) => sum + (s.duracion || 0), 0);
      const [hora, minuto] = booking.time.split(':').map(Number);
      let horaFin = hora;
      let minutoFin = minuto + duracionTotal;
      while (minutoFin >= 60) {
        horaFin++;
        minutoFin -= 60;
      }
      const horaFinStr = `${String(horaFin).padStart(2, '0')}:${String(minutoFin).padStart(2, '0')}`;
      
      // 3. Preparar datos del turno
      const turnoData = {
        id_cliente: cliente.id,
        id_barbero: booking.barber.id_barbero,
        fecha: booking.date.toISOString().split('T')[0],
        hora_inicio: booking.time,
        hora_fin: horaFinStr,
        estado: "PENDIENTE",
        servicios: booking.services.map(s => s.id_servicio)
      };
      
      console.log('📤 Creando turno:', turnoData);
      const turnoResult = await crearTurno(turnoData);
      
      if (turnoResult.success) {
        console.log('✅ Turno creado:', turnoResult.data);
        setSubmitting(false);
        setStep(3);
      } else {
        throw new Error(turnoResult.error || 'Error al crear turno');
      }
      
    } catch (error) {
      console.error('❌ Error en reserva:', error);
      alert(error.message);
      setSubmitting(false);
    }
  };

  // ── Step 3: Confirmed ──────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ConfirmationScreen
            booking={booking}
            onReset={resetBooking}
            bookingJSON={toJSON()}
          />
        </div>
      </Layout>
    );
  }

  // ── Step 2: Summary preview ────────────────────────────────────────────────
  if (step === 2) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <SectionHeader
              eyebrow="Paso 2 de 2"
              title="Confirma tu reserva"
              subtitle="Revisa los detalles y confirma tu turno."
            />
          </div>

          <BookingSummary booking={booking} />

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              ← Editar
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              loading={submitting}
            >
              Confirmar reserva
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Step 1: Form ──
  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center h-96">
          <div className="text-[#C9A84C] animate-pulse">Cargando servicios y barberos...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Page header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <SectionHeader
              eyebrow="Tu turno"
              title="Reservar cita"
              subtitle="Completa el formulario para agendar tu visita."
            />
            <StepIndicator current={1} total={2} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column: form ── */}
          <div className="lg:col-span-2 space-y-0">

            {/* Services - desde BD */}
            <FormSection title="Elige tu servicio">
              {serviciosDB.length === 0 ? (
                <div className="text-[#6B6357] text-center py-8">No hay servicios disponibles</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {serviciosDB.map((s) => (
                    <ServiceCard
                      key={s.id_servicio}
                      service={{
                        id: s.id_servicio,
                        name: s.nombre_servicio,
                        price: s.precio,
                        duration: s.duracion
                      }}
                      selected={booking.services?.some(ss => ss.id_servicio === s.id_servicio)}
                      onClick={() => updateBooking('service', s)}
                      clickable
                    />
                  ))}
                </div>
              )}
            </FormSection>

            {/* Barbers - desde BD */}
            <FormSection title="Elige tu barbero">
              {barberosDB.length === 0 ? (
                <div className="text-[#6B6357] text-center py-8">No hay barberos disponibles</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {barberosDB.map((b) => (
                    <BarberCard
                      key={b.id_barbero}
                      barber={{
                        id: b.id_barbero,
                        name: `${b.nombres} ${b.apellido}`,
                        specialty: b.especialidad
                      }}
                      selected={booking.barber?.id_barbero === b.id_barbero}
                      onClick={() => updateBooking('barber', b)}
                    />
                  ))}
                </div>
              )}
            </FormSection>

            {/* Calendar + Time */}
<FormSection title="Fecha y horario">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <Calendar
      selected={booking.date}
      onSelect={(d) => updateBooking('date', d)}
    />

    <div>
      <div className="text-sm text-[#A89F8C] mb-3 font-medium">
        Horarios disponibles
        {booking.date && (
          <span className="ml-2 text-[#6B6357] font-normal text-xs">
            — {booking.date.toLocaleDateString('es-PY', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>
      {!booking.date ? (
        <div className="flex items-center gap-2 text-[#6B6357] text-sm py-8 justify-center">
          <AlertCircle size={16} />
          Selecciona una fecha primero
        </div>
      ) : cargandoHorarios ? (
        <div className="flex items-center gap-2 text-[#6B6357] text-sm py-8 justify-center">
          <div className="animate-pulse">Cargando horarios...</div>
        </div>
      ) : horariosDisponibles.length === 0 ? (
        <div className="flex items-center gap-2 text-[#6B6357] text-sm py-8 justify-center">
          <AlertCircle size={16} />
          No hay horarios disponibles para este día
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2">
          {horariosDisponibles.map((horario) => (
            <TimeSlot
              key={horario.hora}
              time={horario.hora}
              selected={booking.time === horario.hora}
              disabled={!horario.disponible}
              onClick={() => updateBooking('time', horario.hora)}
            />
          ))}
        </div>
      )}
    </div>
  </div>
</FormSection>

            {/* Client data */}
            <div data-section="client">
              <FormSection title="Datos del cliente">
                {(verificandoCliente || verificando) && (
                  <div className="mb-4 p-3 bg-[#0D0C0A] rounded-lg text-[#C9A84C] text-sm text-center">
                    Verificando si ya eres cliente...
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Nombre"
                    id="firstName"
                    required
                    placeholder="Tu nombre"
                    value={booking.client.firstName || ''}
                    onChange={(e) => { updateClient('firstName', e.target.value); setErrors(p => ({...p, firstName: ''})); }}
                    onBlur={() => handleClientBlur('firstName', booking.client.firstName)}
                    error={errors.firstName}
                  />
                  <InputField
                    label="Apellido"
                    id="lastName"
                    required
                    placeholder="Tu apellido"
                    value={booking.client.lastName || ''}
                    onChange={(e) => { updateClient('lastName', e.target.value); setErrors(p => ({...p, lastName: ''})); }}
                    onBlur={() => handleClientBlur('lastName', booking.client.lastName)}
                    error={errors.lastName}
                  />
                  <InputField
                    label="Teléfono"
                    id="phone"
                    required
                    type="tel"
                    placeholder="0981 123 456"
                    value={booking.client.phone || ''}
                    onChange={(e) => { updateClient('phone', e.target.value); setErrors(p => ({...p, phone: ''})); }}
                    onBlur={() => handleClientBlur('phone', booking.client.phone)}
                    error={errors.phone}
                  />
                  <InputField
                    label="Correo electrónico"
                    id="email"
                    required
                    type="email"
                    placeholder="tu@correo.com"
                    value={booking.client.email || ''}
                    onChange={(e) => { updateClient('email', e.target.value); setErrors(p => ({...p, email: ''})); }}
                    onBlur={() => handleClientBlur('email', booking.client.email)}
                    error={errors.email}
                  />
                </div>
                <p className="text-[#6B6357] text-xs mt-3">
                  Si ya eres cliente, te identificaremos automáticamente con tu correo o teléfono.
                </p>
              </FormSection>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                fullWidth
                size="lg"
                onClick={handleSubmit}
              >
                Revisar y confirmar →
              </Button>
              <p className="text-[#6B6357] text-xs text-center mt-3">
                Podrás revisar tu reserva antes de confirmar definitivamente.
              </p>
            </div>
          </div>

          {/* ── Right: sticky summary ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <BookingSummary booking={booking} />
              <p className="text-[#6B6357] text-xs text-center mt-4">
                El resumen se actualiza en tiempo real
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}