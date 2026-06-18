import SectionHeader from '../../components/ui/SectionHeader';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/admin/Modal';
import { useGastos } from '../../hooks/useGastos';

export default function AdminGastos() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useGastos();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    id_gasto: '',
    concepto: '',
    monto: '',
    fecha: '',
    observacion: ''
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      id_gasto: "",
      concepto: '',
      monto: '',
      fecha: new Date().toISOString().split('T')[0],  // ✅ CORREGIDO: formato YYYY-MM-DD
      observacion: ''
    });
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item.id_gasto);
    // Formatear la fecha si viene del backend
    const formattedFecha = item.fecha 
      ? new Date(item.fecha).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    
    setForm({
      id_gasto: item.id_gasto,
      concepto: item.concepto || '',
      monto: item.monto || '',
      fecha: formattedFecha,  // ✅ CORREGIDO: string en formato YYYY-MM-DD
      observacion: item.observacion || ''
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!form.concepto.trim()) return alert('Concepto requerido');
    if (!form.monto) return alert('Monto requerido');
    if (parseFloat(form.monto) <= 0) return alert('El monto debe ser mayor a 0');
    if (!form.fecha) return alert('Fecha requerida');

    const gastoData = {
      concepto: form.concepto,
      monto: parseFloat(form.monto),
      fecha: form.fecha,  // ✅ Ya viene en formato correcto YYYY-MM-DD
      observacion: form.observacion || null
    };

    let result;
    if (editing) {
      result = await updateItem(editing, gastoData);
    } else {
      result = await createItem(gastoData);
    }

    if (result.success) {
      setIsOpen(false);
      setForm({
        id_gasto: '',
        concepto: '',
        monto: '',
        fecha: '',
        observacion: ''
      });
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id, concepto) => {
    if (!confirm(`¿Eliminar gasto "${concepto}"?`)) return;
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

  const getTotalGastos = () => {
    return items.reduce((total, item) => total + (parseFloat(item.monto) || 0), 0);
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#C9A84C] animate-pulse">Cargando gastos...</div>
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
      <SectionHeader eyebrow="Gastos" title="Gestión de gastos" />

      <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
        {items.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            <div className="bg-[#0D0C0A] border border-[rgba(201,168,76,0.06)] rounded-lg px-4 py-2">
              <span className="text-[#A89F8C] text-sm">Total gastos: </span>
              <span className="text-[#C9A84C] font-bold text-lg ml-2">
                {items.length}
              </span>
            </div>
            <div className="bg-[#0D0C0A] border border-[rgba(201,168,76,0.06)] rounded-lg px-4 py-2">
              <span className="text-[#A89F8C] text-sm">Monto total: </span>
              <span className="text-[#F5F1EB] font-bold text-lg ml-2">
                {formatMonto(getTotalGastos())}
              </span>
            </div>
          </div>
        )}
        <Button onClick={openCreate}>Nuevo gasto</Button>
      </div>

      <div className="mt-4 bg-[#141210] border border-[rgba(201,168,76,0.06)] rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-[#A89F8C] border-b border-[rgba(255,255,255,0.03)]">
              <th className="px-4 py-3">Concepto</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Observación</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id_gasto} className="border-t border-[rgba(255,255,255,0.03)] hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#F5F1EB]">{item.concepto}</div>
                    <div className="text-[#6B6357] text-xs">ID: {item.id_gasto}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#C9A84C] font-medium">
                      {formatMonto(item.monto)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B6357] text-sm">
                    {formatFecha(item.fecha)}
                  </td>
                  <td className="px-4 py-3 text-[#6B6357] text-sm max-w-xs truncate">
                    {item.observacion || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => openEdit(item)}>
                        Editar
                      </Button>
                      <Button 
                        onClick={() => handleDelete(item.id_gasto, item.concepto)} 
                        className="bg-red-600/10 text-red-300 hover:bg-red-600/20"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#6B6357]">
                  No hay gastos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? 'Editar gasto' : 'Nuevo gasto'}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? 'Guardar cambios' : 'Crear gasto'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Concepto *</label>
            <input
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder="Ej: Compra de insumos, Pago de servicios, etc."
              value={form.concepto}
              onChange={e => setForm(f => ({ ...f, concepto: e.target.value }))}
            />
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
            <p className="text-[#6B6357] text-xs mt-1">Monto en pesos colombianos (COP)</p>
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
            <label className="text-sm text-[#A89F8C] block mb-2">Observación</label>
            <textarea
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
              placeholder="Detalles adicionales del gasto (opcional)"
              rows="3"
              value={form.observacion}
              onChange={e => setForm(f => ({ ...f, observacion: e.target.value }))}
            />
          </div>

          {/* Vista previa */}
          {form.concepto && form.monto && parseFloat(form.monto) > 0 && (
            <div className="mt-2 p-3 bg-[#0D0C0A] rounded-lg border border-[rgba(201,168,76,0.06)]">
              <span className="text-[#A89F8C] text-sm">Vista previa: </span>
              <span className="text-[#C9A84C] font-bold ml-2">
                {form.concepto}
              </span>
              <span className="text-[#F5F1EB] text-sm ml-2">
                {formatMonto(form.monto)}
              </span>
              <span className="text-[#6B6357] text-xs ml-2">
                • {form.fecha || 'Sin fecha'}
              </span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}