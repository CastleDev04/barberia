import SectionHeader from '../../components/ui/SectionHeader';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/admin/Modal';
import { useTurnos } from '../../hooks/useTurnos';

export default function AdminTurnos() {
  const { items, clientes, barberos, servicios, loading, error, createItem, cancelItem, deleteItem, updateEstado } = useTurnos();
  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEstadoOpen, setIsEstadoOpen] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [selectedServicios, setSelectedServicios] = useState([]);
  const [duracionTotal, setDuracionTotal] = useState(0);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [nuevoEstado, setNuevoEstado] = useState('');
  
  const [form, setForm] = useState({
    id_turno: '',
    id_cliente: '',
    id_barbero: '',
    fecha: '',
    hora_inicio: '09:00',
    servicios: []
  });

  // Estados disponibles para cambiar
  const estadosDisponibles = [
    { value: 'PENDIENTE', label: 'Pendiente', color: 'yellow' },
    { value: 'CONFIRMADO', label: 'Confirmado', color: 'blue' },
    { value: 'EN_CURSO', label: 'En curso', color: 'purple' },
    { value: 'COMPLETADO', label: 'Completado', color: 'green' },
    { value: 'CANCELADO', label: 'Cancelado', color: 'red' }
  ];

  // 🔧 Función para corregir fecha (suma 1 día)
  const corregirFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const [year, month, day] = fechaStr.split('T')[0].split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    fecha.setDate(fecha.getDate() + 1);
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
  };

  // 🔧 Función para corregir hora (suma 1 hora)
  const corregirHora = (horaStr) => {
    if (!horaStr) return '';
    const [hour, minute] = horaStr.split(':').map(Number);
    let nuevaHora = hour;
    if (nuevaHora >= 24) nuevaHora = nuevaHora - 24;
    return `${String(nuevaHora).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  // 🔧 Función para formatear fecha mostrada
  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    const fechaCorregida = corregirFecha(fecha);
    const [year, month, day] = fechaCorregida.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 🔧 Función para formatear hora mostrada
  const formatHora = (hora) => {
    if (!hora) return '—';
    let horaStr = hora;
    if (hora.includes('T')) {
      horaStr = hora.substring(11, 16);
    }
    return corregirHora(horaStr);
  };

  const openCreate = () => {
    setIsOpen(true);
    setSelectedServicios([]);
    setDuracionTotal(0);
    setPrecioTotal(0);
    
    const hoy = new Date();
    const fechaActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    
    setForm({
      id_turno: `t-${Date.now()}`,
      id_cliente: '',
      id_barbero: '',
      fecha: fechaActual,
      hora_inicio: '09:00',
      servicios: []
    });
  };

  const openView = (item) => {
    setSelectedTurno(item);
    setIsViewOpen(true);
  };

  const openCambiarEstado = (item) => {
    setSelectedTurno(item);
    setNuevoEstado(item.estado);
    setIsEstadoOpen(true);
  };

  const handleCambiarEstado = async () => {
    if (!selectedTurno) return;
    const result = await updateEstado(selectedTurno.id_turno, nuevoEstado);
    if (result.success) {
      setIsEstadoOpen(false);
      alert(`Turno ${selectedTurno.id_turno} actualizado a ${getEstadoLabel(nuevoEstado)}`);
    } else {
      alert(result.error);
    }
  };

  const handleServicioToggle = (servicio) => {
    const exists = selectedServicios.find(s => s.id_servicio === servicio.id_servicio);
    let nuevosServicios;
    if (exists) {
      nuevosServicios = selectedServicios.filter(s => s.id_servicio !== servicio.id_servicio);
    } else {
      nuevosServicios = [...selectedServicios, servicio];
    }
    setSelectedServicios(nuevosServicios);
    
    const totalDuracion = nuevosServicios.reduce((sum, s) => sum + (s.duracion || 0), 0);
    const totalPrecio = nuevosServicios.reduce((sum, s) => sum + parseFloat(s.precio || 0), 0);
    setDuracionTotal(totalDuracion);
    setPrecioTotal(totalPrecio);
    
    setForm(f => ({ ...f, servicios: nuevosServicios.map(s => s.id_servicio) }));
  };

  const handleSave = async () => {
    if (!form.id_cliente) return alert('Debe seleccionar un cliente');
    if (!form.id_barbero) return alert('Debe seleccionar un barbero');
    if (!form.fecha) return alert('Fecha requerida');
    if (!form.hora_inicio) return alert('Hora de inicio requerida');
    if (selectedServicios.length === 0) return alert('Debe seleccionar al menos un servicio');

    const turnoData = {
      id_cliente: parseInt(form.id_cliente),
      id_barbero: parseInt(form.id_barbero),
      fecha: form.fecha,
      hora_inicio: form.hora_inicio,
      servicios: selectedServicios.map(s => s.id_servicio)
    };

    const result = await createItem(turnoData);

    if (result.success) {
      setIsOpen(false);
      setSelectedServicios([]);
      setForm({
        id_turno: '',
        id_cliente: '',
        id_barbero: '',
        fecha: '',
        hora_inicio: '09:00',
        servicios: []
      });
    } else {
      alert(result.error);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('¿Cancelar este turno?')) return;
    const result = await cancelItem(id);
    if (!result.success) alert(result.error);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este turno permanentemente?')) return;
    const result = await deleteItem(id);
    if (!result.success) alert(result.error);
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'PENDIENTE': return 'bg-yellow-500/20 text-yellow-400';
      case 'CONFIRMADO': return 'bg-blue-500/20 text-blue-400';
      case 'EN_CURSO': return 'bg-purple-500/20 text-purple-400';
      case 'COMPLETADO': return 'bg-green-500/20 text-green-400';
      case 'CANCELADO': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getEstadoLabel = (estado) => {
    switch(estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'CONFIRMADO': return 'Confirmado';
      case 'EN_CURSO': return 'En curso';
      case 'COMPLETADO': return 'Completado';
      case 'CANCELADO': return 'Cancelado';
      default: return estado;
    }
  };

  const getClienteNombre = (id) => {
    const cliente = clientes.find(c => c.id === id);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : `Cliente #${id}`;
  };

  const getBarberoNombre = (id) => {
    const barbero = barberos.find(b => b.id_barbero === id);
    return barbero ? `${barbero.nombres} ${barbero.apellido}` : `Barbero #${id}`;
  };

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio);
  };

  const getTurnosHoy = () => {
    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    return items.filter(i => {
      if (!i.fecha) return false;
      const fechaCorregida = corregirFecha(i.fecha);
      return fechaCorregida === hoyStr;
    }).length;
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#C9A84C] animate-pulse">Cargando turnos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader eyebrow="Turnos" title="Gestión de turnos" />

      <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
        {items.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            <div className="bg-[#0D0C0A] border border-[rgba(201,168,76,0.06)] rounded-lg px-4 py-2">
              <span className="text-[#A89F8C] text-sm">Total turnos: </span>
              <span className="text-[#C9A84C] font-bold text-lg ml-2">{items.length}</span>
            </div>
            <div className="bg-[#0D0C0A] border border-[rgba(201,168,76,0.06)] rounded-lg px-4 py-2">
              <span className="text-[#A89F8C] text-sm">Pendientes: </span>
              <span className="text-yellow-400 font-bold text-lg ml-2">
                {items.filter(i => i.estado === 'PENDIENTE').length}
              </span>
            </div>
            <div className="bg-[#0D0C0A] border border-[rgba(201,168,76,0.06)] rounded-lg px-4 py-2">
              <span className="text-[#A89F8C] text-sm">Confirmados: </span>
              <span className="text-blue-400 font-bold text-lg ml-2">
                {items.filter(i => i.estado === 'CONFIRMADO').length}
              </span>
            </div>
            <div className="bg-[#0D0C0A] border border-[rgba(201,168,76,0.06)] rounded-lg px-4 py-2">
              <span className="text-[#A89F8C] text-sm">Completados: </span>
              <span className="text-green-400 font-bold text-lg ml-2">
                {items.filter(i => i.estado === 'COMPLETADO').length}
              </span>
            </div>
            <div className="bg-[#0D0C0A] border border-[rgba(201,168,76,0.06)] rounded-lg px-4 py-2">
              <span className="text-[#A89F8C] text-sm">Hoy: </span>
              <span className="text-[#F5F1EB] font-bold text-lg ml-2">{getTurnosHoy()}</span>
            </div>
          </div>
        )}
        <Button onClick={openCreate}>Nuevo turno</Button>
      </div>

      <div className="mt-4 bg-[#141210] border border-[rgba(201,168,76,0.06)] rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-[#A89F8C] border-b border-[rgba(255,255,255,0.03)]">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Barbero</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Hora</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id_turno} className="border-t border-[rgba(255,255,255,0.03)] hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-[#C9A84C]">#{item.id_turno}</td>
                  <td className="px-4 py-3 text-[#F5F1EB]">{getClienteNombre(item.id_cliente)}</td>
                  <td className="px-4 py-3 text-[#F5F1EB]">{getBarberoNombre(item.id_barbero)}</td>
                  <td className="px-4 py-3 text-[#6B6357] text-sm">{formatFecha(item.fecha)}</td>
                  <td className="px-4 py-3 text-[#F5F1EB] text-sm">
                    {formatHora(item.hora_inicio)} - {formatHora(item.hora_fin)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getEstadoColor(item.estado)}`}
                          onClick={() => openCambiarEstado(item)}>
                      {getEstadoLabel(item.estado)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => openView(item)}>Ver</Button>
                      <Button variant="outline" onClick={() => openCambiarEstado(item)} className="bg-blue-600/10 text-blue-300">
                        Estado
                      </Button>
                      {item.estado !== 'CANCELADO' && item.estado !== 'COMPLETADO' && (
                        <Button onClick={() => handleCancel(item.id_turno)} className="bg-yellow-600/10 text-yellow-300">
                          Cancelar
                        </Button>
                      )}
                      <Button onClick={() => handleDelete(item.id_turno)} className="bg-red-600/10 text-red-300">
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#6B6357]">
                  No hay turnos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para crear turno */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Nuevo turno"
        size="large"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Crear turno</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Cliente *</label>
            <select
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              value={form.id_cliente}
              onChange={e => setForm(f => ({ ...f, id_cliente: e.target.value }))}
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} {cliente.apellido} - {cliente.correo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Barbero *</label>
            <select
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              value={form.id_barbero}
              onChange={e => setForm(f => ({ ...f, id_barbero: e.target.value }))}
            >
              <option value="">Seleccione un barbero</option>
              {barberos.map(barbero => (
                <option key={barbero.id_barbero} value={barbero.id_barbero}>
                  {barbero.nombres} {barbero.apellido} - {barbero.especialidad}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Fecha *</label>
            <input
              type="date"
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              value={form.fecha}
              onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Hora de inicio *</label>
            <input
              type="time"
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              value={form.hora_inicio}
              onChange={e => setForm(f => ({ ...f, hora_inicio: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-[#A89F8C] block mb-2">Servicios *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-[#0D0C0A] rounded-lg p-3 border border-[rgba(255,255,255,0.03)]">
              {servicios.map(servicio => (
                <label key={servicio.id_servicio} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedServicios.some(s => s.id_servicio === servicio.id_servicio)}
                    onChange={() => handleServicioToggle(servicio)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-[#F5F1EB] text-sm">{servicio.nombre_servicio}</span>
                  <span className="text-[#C9A84C] text-xs">{formatPrecio(servicio.precio)} - {servicio.duracion}min</span>
                </label>
              ))}
            </div>
          </div>

          {selectedServicios.length > 0 && (
            <div className="md:col-span-2 mt-2 p-3 bg-[#0D0C0A] rounded-lg border border-[rgba(201,168,76,0.06)]">
              <h4 className="text-[#C9A84C] text-sm font-medium mb-2">Resumen del turno</h4>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[#A89F8C] text-xs">Servicios: </span>
                  <span className="text-[#F5F1EB] text-sm">{selectedServicios.length}</span>
                </div>
                <div>
                  <span className="text-[#A89F8C] text-xs">Duración total: </span>
                  <span className="text-[#F5F1EB] text-sm">{duracionTotal} min</span>
                </div>
                <div>
                  <span className="text-[#A89F8C] text-xs">Total a pagar: </span>
                  <span className="text-[#C9A84C] font-bold text-sm">{formatPrecio(precioTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal para cambiar estado */}
      <Modal
        isOpen={isEstadoOpen}
        onClose={() => setIsEstadoOpen(false)}
        title="Cambiar estado del turno"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEstadoOpen(false)}>Cancelar</Button>
            <Button onClick={handleCambiarEstado}>Actualizar estado</Button>
          </div>
        }
      >
        {selectedTurno && (
          <div className="space-y-4">
            <div className="bg-[#0D0C0A] rounded-lg p-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-[#A89F8C]">Turno #:</span>
                  <span className="text-[#C9A84C] ml-2">#{selectedTurno.id_turno}</span>
                </div>
                <div>
                  <span className="text-[#A89F8C]">Cliente:</span>
                  <span className="text-[#F5F1EB] ml-2">{getClienteNombre(selectedTurno.id_cliente)}</span>
                </div>
                <div>
                  <span className="text-[#A89F8C]">Fecha:</span>
                  <span className="text-[#F5F1EB] ml-2">{formatFecha(selectedTurno.fecha)}</span>
                </div>
                <div>
                  <span className="text-[#A89F8C]">Hora:</span>
                  <span className="text-[#F5F1EB] ml-2">{formatHora(selectedTurno.hora_inicio)}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-[#A89F8C] block mb-2">Nuevo estado</label>
              <select
                className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
                value={nuevoEstado}
                onChange={e => setNuevoEstado(e.target.value)}
              >
                {estadosDisponibles.map(estado => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={`p-3 rounded-lg border ${
              nuevoEstado === 'COMPLETADO' ? 'bg-green-500/10 border-green-500/30' :
              nuevoEstado === 'CANCELADO' ? 'bg-red-500/10 border-red-500/30' :
              nuevoEstado === 'CONFIRMADO' ? 'bg-blue-500/10 border-blue-500/30' :
              nuevoEstado === 'EN_CURSO' ? 'bg-purple-500/10 border-purple-500/30' :
              'bg-yellow-500/10 border-yellow-500/30'
            }`}>
              <p className="text-xs text-center">
                {nuevoEstado === 'COMPLETADO' && '⚠️ Al completar el turno, se generará el pago pendiente.'}
                {nuevoEstado === 'CANCELADO' && '⚠️ El turno cancelado no podrá ser reactivado.'}
                {nuevoEstado === 'CONFIRMADO' && '✓ El cliente recibirá una notificación de confirmación.'}
                {nuevoEstado === 'EN_CURSO' && '✂️ El barbero está atendiendo este turno.'}
                {nuevoEstado === 'PENDIENTE' && '⏳ El turno está esperando confirmación.'}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para ver detalles */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detalles del turno"
        size="large"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Cerrar</Button>
            {selectedTurno && selectedTurno.estado !== 'CANCELADO' && selectedTurno.estado !== 'COMPLETADO' && (
              <Button onClick={() => {
                setIsViewOpen(false);
                openCambiarEstado(selectedTurno);
              }} className="bg-blue-600/10 text-blue-300">
                Cambiar estado
              </Button>
            )}
          </div>
        }
      >
        {selectedTurno && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#A89F8C] block">ID Turno</label>
                <div className="text-[#C9A84C] font-medium mt-1">#{selectedTurno.id_turno}</div>
              </div>
              <div>
                <label className="text-xs text-[#A89F8C] block">Estado</label>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(selectedTurno.estado)}`}>
                    {getEstadoLabel(selectedTurno.estado)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs text-[#A89F8C] block">Cliente</label>
                <div className="text-[#F5F1EB] mt-1">{getClienteNombre(selectedTurno.id_cliente)}</div>
              </div>
              <div>
                <label className="text-xs text-[#A89F8C] block">Barbero</label>
                <div className="text-[#F5F1EB] mt-1">{getBarberoNombre(selectedTurno.id_barbero)}</div>
              </div>
              <div>
                <label className="text-xs text-[#A89F8C] block">Fecha</label>
                <div className="text-[#F5F1EB] mt-1">{formatFecha(selectedTurno.fecha)}</div>
              </div>
              <div>
                <label className="text-xs text-[#A89F8C] block">Horario</label>
                <div className="text-[#F5F1EB] mt-1">
                  {formatHora(selectedTurno.hora_inicio)} - {formatHora(selectedTurno.hora_fin)}
                </div>
              </div>
            </div>

            {selectedTurno.detalle_turno && selectedTurno.detalle_turno.length > 0 && (
              <div>
                <h4 className="text-[#C9A84C] text-sm font-medium mb-2">Servicios</h4>
                <div className="space-y-2">
                  {selectedTurno.detalle_turno.map(detalle => (
                    <div key={detalle.id_detalle} className="flex justify-between items-center bg-[#0D0C0A] p-2 rounded">
                      <span className="text-[#F5F1EB] text-sm">
                        {detalle.servicios?.nombre_servicio || `Servicio #${detalle.id_servicio}`}
                      </span>
                      <span className="text-[#C9A84C] text-sm">
                        {formatPrecio(detalle.precio_servicio)} - {detalle.duracion}min
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}