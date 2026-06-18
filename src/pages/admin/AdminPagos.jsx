import SectionHeader from '../../components/ui/SectionHeader';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/admin/Modal';
import { usePagos } from '../../hooks/usePagos';

export default function AdminPagos() {
  const { items, turnos, loading, error, createItem, updateItem, deleteItem } = usePagos();
  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedPago, setSelectedPago] = useState(null);
  const [form, setForm] = useState({
    id_pago: '',
    id_turno: '',
    monto: '',
    metodo_pago: 'EFECTIVO',
    fecha: '',
    estado: 'PAGADO'
  });

  const metodosPago = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TARJETA_DEBITO', label: 'Tarjeta Débito' },
    { value: 'TARJETA_CREDITO', label: 'Tarjeta Crédito' },
    { value: 'TRANSFERENCIA', label: 'Transferencia' },
    { value: 'QR', label: 'QR' }
  ];

  const estadosPago = [
    { value: 'PAGADO', label: 'Pagado', color: 'green' },
    { value: 'PENDIENTE', label: 'Pendiente', color: 'yellow' },
    { value: 'ANULADO', label: 'Anulado', color: 'red' }
  ];

  // 🔧 Función para manejar cambio de turno y calcular monto automáticamente
  const handleTurnoChange = (e) => {
    const turnoId = e.target.value;
    const turnoSeleccionado = turnos.find(t => t.id_turno === parseInt(turnoId));
    
    if (turnoSeleccionado) {
      // Calcular monto total desde los servicios del turno
      let montoCalculado = 0;
      if (turnoSeleccionado.detalle_turno && turnoSeleccionado.detalle_turno.length > 0) {
        montoCalculado = turnoSeleccionado.detalle_turno.reduce((sum, detalle) => {
          return sum + parseFloat(detalle.precio_servicio || 0);
        }, 0);
      }
      setForm(f => ({ 
        ...f, 
        id_turno: turnoId,
        monto: montoCalculado.toString()
      }));
    } else {
      setForm(f => ({ ...f, id_turno: turnoId, monto: '' }));
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      id_pago: `p-${Date.now()}`,
      id_turno: '',
      monto: '',
      metodo_pago: 'EFECTIVO',
      fecha: new Date().toISOString().split('T')[0],
      estado: 'PAGADO'
    });
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item.id_pago);
    setForm({
      id_pago: item.id_pago,
      id_turno: item.id_turno || '',
      monto: item.monto || '',
      metodo_pago: item.metodo_pago || 'EFECTIVO',
      fecha: item.fecha || new Date().toISOString().split('T')[0],
      estado: item.estado || 'PAGADO'
    });
    setIsOpen(true);
  };

  const openView = (item) => {
    setSelectedPago(item);
    setIsViewOpen(true);
  };

  const handleSave = async () => {
    if (!form.id_turno) return alert('Debe seleccionar un turno');
    if (!form.monto) return alert('Monto requerido');
    if (parseFloat(form.monto) <= 0) return alert('El monto debe ser mayor a 0');
    if (!form.fecha) return alert('Fecha requerida');

    const pagoData = {
      id_turno: parseInt(form.id_turno),
      monto: parseFloat(form.monto),
      metodo_pago: form.metodo_pago,
      fecha: form.fecha,
      estado: form.estado
    };

    let result;
    if (editing) {
      result = await updateItem(editing, pagoData);
    } else {
      result = await createItem(pagoData);
    }

    if (result.success) {
      setIsOpen(false);
      setForm({
        id_pago: '',
        id_turno: '',
        monto: '',
        metodo_pago: 'EFECTIVO',
        fecha: '',
        estado: 'PAGADO'
      });
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id, turnoId) => {
    if (!confirm(`¿Eliminar pago del turno #${turnoId}?`)) return;
    const result = await deleteItem(id);
    if (!result.success) alert(result.error);
  };

  const formatMonto = (monto) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto);
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMetodoPagoLabel = (metodo) => {
    const metodoObj = metodosPago.find(m => m.value === metodo);
    return metodoObj ? metodoObj.label : metodo;
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'PAGADO': return 'bg-green-500/20 text-green-400';
      case 'PENDIENTE': return 'bg-yellow-500/20 text-yellow-400';
      case 'ANULADO': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getEstadoLabel = (estado) => {
    switch(estado) {
      case 'PAGADO': return 'Pagado';
      case 'PENDIENTE': return 'Pendiente';
      case 'ANULADO': return 'Anulado';
      default: return estado;
    }
  };

  const getTurnoInfo = (idTurno) => {
    const turno = turnos.find(t => t.id_turno === idTurno);
    if (turno) {
      // Calcular monto del turno para mostrar
      let montoTurno = 0;
      if (turno.detalle_turno && turno.detalle_turno.length > 0) {
        montoTurno = turno.detalle_turno.reduce((sum, detalle) => {
          return sum + parseFloat(detalle.precio_servicio || 0);
        }, 0);
      }
      return `#${turno.id_turno} - ${turno.clientes?.nombre || 'Cliente'} ${turno.clientes?.apellido || ''} - ${formatMonto(montoTurno)}`;
    }
    return `#${idTurno}`;
  };

  const getTotalPagos = () => {
    return items.reduce((total, item) => total + (parseFloat(item.monto) || 0), 0);
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#C9A84C] animate-pulse">Cargando pagos...</div>
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
      <SectionHeader eyebrow="Pagos" title="Gestión de pagos" />

      <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
        {items.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            <div className="bg-[#0D0C0A] border border-[rgba(201,168,76,0.06)] rounded-lg px-4 py-2">
              <span className="text-[#A89F8C] text-sm">Total pagos: </span>
              <span className="text-[#C9A84C] font-bold text-lg ml-2">{items.length}</span>
            </div>
            <div className="bg-[#0D0C0A] border border-[rgba(201,168,76,0.06)] rounded-lg px-4 py-2">
              <span className="text-[#A89F8C] text-sm">Monto total: </span>
              <span className="text-[#F5F1EB] font-bold text-lg ml-2">{formatMonto(getTotalPagos())}</span>
            </div>
          </div>
        )}
        <Button onClick={openCreate}>Nuevo pago</Button>
      </div>

      <div className="mt-4 bg-[#141210] border border-[rgba(201,168,76,0.06)] rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-[#A89F8C] border-b border-[rgba(255,255,255,0.03)]">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Turno</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Método</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id_pago} className="border-t border-[rgba(255,255,255,0.03)] hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-[#C9A84C]">#{item.id_pago}</td>
                  <td className="px-4 py-3 text-[#F5F1EB]">{getTurnoInfo(item.id_turno)}</td>
                  <td className="px-4 py-3 text-[#F5F1EB] font-medium">{formatMonto(item.monto)}</td>
                  <td className="px-4 py-3 text-[#6B6357]">{getMetodoPagoLabel(item.metodo_pago)}</td>
                  <td className="px-4 py-3 text-[#6B6357] text-sm">{formatFecha(item.fecha)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(item.estado)}`}>
                      {getEstadoLabel(item.estado)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => openView(item)}>Ver</Button>
                      <Button variant="outline" onClick={() => openEdit(item)}>Editar</Button>
                      <Button onClick={() => handleDelete(item.id_pago, item.id_turno)} className="bg-red-600/10 text-red-300">
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#6B6357]">
                  No hay pagos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para crear/editar pago */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? 'Editar pago' : 'Nuevo pago'}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? 'Guardar cambios' : 'Crear pago'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Turno *</label>
            <select
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              value={form.id_turno}
              onChange={handleTurnoChange}
            >
              <option value="">Seleccione un turno</option>
              {turnos.map(turno => {
                // Calcular monto del turno para mostrar
                let montoTurno = 0;
                if (turno.detalle_turno && turno.detalle_turno.length > 0) {
                  montoTurno = turno.detalle_turno.reduce((sum, detalle) => {
                    return sum + parseFloat(detalle.precio_servicio || 0);
                  }, 0);
                }
                return (
                  <option key={turno.id_turno} value={turno.id_turno}>
                    #{turno.id_turno} - {turno.clientes?.nombre || `Cliente #${turno.id_cliente}`} {turno.clientes?.apellido || ''} - {formatMonto(montoTurno)}
                  </option>
                );
              })}
            </select>
            <p className="text-[#6B6357] text-xs mt-1">
              Al seleccionar un turno, el monto se calcula automáticamente desde los servicios
            </p>
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Monto *</label>
            <input
              type="number"
              step="1000"
              min="0"
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder="0"
              value={form.monto}
              onChange={e => setForm(f => ({ ...f, monto: e.target.value }))}
            />
            <p className="text-[#6B6357] text-xs mt-1">
              Puedes modificar el monto manualmente si es necesario
            </p>
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Método de pago *</label>
            <select
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              value={form.metodo_pago}
              onChange={e => setForm(f => ({ ...f, metodo_pago: e.target.value }))}
            >
              {metodosPago.map(metodo => (
                <option key={metodo.value} value={metodo.value}>{metodo.label}</option>
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
            <label className="text-sm text-[#A89F8C] block mb-2">Estado</label>
            <select
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              value={form.estado}
              onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
            >
              {estadosPago.map(estado => (
                <option key={estado.value} value={estado.value}>{estado.label}</option>
              ))}
            </select>
          </div>

          {/* Vista previa */}
          {form.monto && parseFloat(form.monto) > 0 && (
            <div className="mt-2 p-3 bg-[#0D0C0A] rounded-lg border border-[rgba(201,168,76,0.06)]">
              <span className="text-[#A89F8C] text-sm">Vista previa: </span>
              <span className="text-[#C9A84C] font-bold ml-2">{formatMonto(form.monto)}</span>
              <span className="text-[#6B6357] text-xs ml-2">• {getMetodoPagoLabel(form.metodo_pago)}</span>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal para ver detalles */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detalles del pago"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Cerrar</Button>
            {selectedPago && (
              <Button onClick={() => {
                setIsViewOpen(false);
                openEdit(selectedPago);
              }}>Editar pago</Button>
            )}
          </div>
        }
      >
        {selectedPago && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#A89F8C] block">ID Pago</label>
                <div className="text-[#C9A84C] font-medium mt-1">#{selectedPago.id_pago}</div>
              </div>
              <div>
                <label className="text-xs text-[#A89F8C] block">Estado</label>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(selectedPago.estado)}`}>
                    {getEstadoLabel(selectedPago.estado)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs text-[#A89F8C] block">Turno</label>
                <div className="text-[#F5F1EB] mt-1">{getTurnoInfo(selectedPago.id_turno)}</div>
              </div>
              <div>
                <label className="text-xs text-[#A89F8C] block">Monto</label>
                <div className="text-[#F5F1EB] font-bold text-lg mt-1">{formatMonto(selectedPago.monto)}</div>
              </div>
              <div>
                <label className="text-xs text-[#A89F8C] block">Método de pago</label>
                <div className="text-[#F5F1EB] mt-1">{getMetodoPagoLabel(selectedPago.metodo_pago)}</div>
              </div>
              <div>
                <label className="text-xs text-[#A89F8C] block">Fecha</label>
                <div className="text-[#F5F1EB] mt-1">{formatFecha(selectedPago.fecha)}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}