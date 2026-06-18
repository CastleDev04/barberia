import SectionHeader from '../../components/ui/SectionHeader';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/admin/Modal';
import { useServicios } from '../../hooks/useServicios';

export default function AdminServicios() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useServicios();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    id_servicio: '',
    nombre_servicio: '',
    descripcion: '',
    precio: '',
    duracion: ''
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      id_servicio: `s-${Date.now()}`,
      nombre_servicio: '',
      descripcion: '',
      precio: '',
      duracion: ''
    });
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item.id_servicio);
    setForm({
      id_servicio: item.id_servicio,
      nombre_servicio: item.nombre_servicio || '',
      descripcion: item.descripcion || '',
      precio: item.precio || '',
      duracion: item.duracion || ''
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!form.nombre_servicio.trim()) return alert('Nombre del servicio requerido');
    if (!form.precio) return alert('Precio requerido');
    if (parseFloat(form.precio) <= 0) return alert('El precio debe ser mayor a 0');
    if (!form.duracion) return alert('Duración requerida');
    if (parseInt(form.duracion) <= 0) return alert('La duración debe ser mayor a 0');

    const servicioData = {
      nombre_servicio: form.nombre_servicio,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      duracion: parseInt(form.duracion)
    };

    let result;
    if (editing) {
      result = await updateItem(editing, servicioData);
    } else {
      result = await createItem(servicioData);
    }

    if (result.success) {
      setIsOpen(false);
      setForm({
        id_servicio: '',
        nombre_servicio: '',
        descripcion: '',
        precio: '',
        duracion: ''
      });
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar servicio "${nombre}"?`)) return;
    const result = await deleteItem(id);
    if (!result.success) alert(result.error);
  };

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio);
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#C9A84C] animate-pulse">Cargando servicios...</div>
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
      <SectionHeader eyebrow="Servicios" title="Gestión de servicios" />

      <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
        {items.length > 0 && (
          <div className="bg-[#0D0C0A] border border-[rgba(201,168,76,0.06)] rounded-lg px-4 py-2">
            <span className="text-[#A89F8C] text-sm">Total servicios: </span>
            <span className="text-[#C9A84C] font-bold text-lg ml-2">
              {items.length}
            </span>
          </div>
        )}
        <Button onClick={openCreate}>Nuevo servicio</Button>
      </div>

      <div className="mt-4 bg-[#141210] border border-[rgba(201,168,76,0.06)] rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-[#A89F8C] border-b border-[rgba(255,255,255,0.03)]">
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Duración</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id_servicio} className="border-t border-[rgba(255,255,255,0.03)] hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#F5F1EB]">{item.nombre_servicio}</div>
                    <div className="text-[#6B6357] text-xs">ID: {item.id_servicio}</div>
                  </td>
                  <td className="px-4 py-3 text-[#6B6357] text-sm">
                    {item.descripcion || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#C9A84C] font-medium">
                      {formatPrecio(item.precio)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#F5F1EB] text-sm">
                    {item.duracion} min
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => openEdit(item)}>
                        Editar
                      </Button>
                      <Button 
                        onClick={() => handleDelete(item.id_servicio, item.nombre_servicio)} 
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
                  No hay servicios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? 'Editar servicio' : 'Nuevo servicio'}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? 'Guardar cambios' : 'Crear servicio'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Nombre del servicio *</label>
            <input
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder="Ej: Corte de cabello"
              value={form.nombre_servicio}
              onChange={e => setForm(f => ({ ...f, nombre_servicio: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Descripción</label>
            <textarea
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
              placeholder="Descripción detallada del servicio (opcional)"
              rows="3"
              value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Precio *</label>
            <input
              type="number"
              step="1000"
              min="0"
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder="0"
              value={form.precio}
              onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Duración (minutos) *</label>
            <input
              type="number"
              step="5"
              min="5"
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder="30"
              value={form.duracion}
              onChange={e => setForm(f => ({ ...f, duracion: e.target.value }))}
            />
          </div>

          {/* Vista previa del precio */}
          {form.precio && parseFloat(form.precio) > 0 && (
            <div className="mt-2 p-3 bg-[#0D0C0A] rounded-lg border border-[rgba(201,168,76,0.06)]">
              <span className="text-[#A89F8C] text-sm">Vista previa: </span>
              <span className="text-[#C9A84C] font-bold ml-2">
                {formatPrecio(form.precio)}
              </span>
              <span className="text-[#6B6357] text-xs ml-2">
                • {form.duracion || 0} minutos
              </span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}