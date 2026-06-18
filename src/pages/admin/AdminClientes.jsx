import SectionHeader from '../../components/ui/SectionHeader';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/admin/Modal';
import { useClientes } from '../../hooks/useClientes';

export default function AdminClientes() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useClientes();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    password: ''
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      id: `c-${Date.now()}`,
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      password: ''
    });
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      id: item.id,
      nombre: item.nombre || '',
      apellido: item.apellido || '',
      telefono: item.telefono || '',
      correo: item.correo || '',
      password: ''
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) return alert('Nombre requerido');
    if (!form.apellido.trim()) return alert('Apellido requerido');
    if (!form.correo.trim()) return alert('Correo requerido');
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.correo)) return alert('Correo electrónico inválido');
    
    if (!editing && !form.password.trim()) return alert('Contraseña requerida');

    const clienteData = {
      nombre: form.nombre,
      apellido: form.apellido,
      telefono: form.telefono,
      correo: form.correo,
    };

    if (form.password) {
      clienteData.password = form.password;
    }

    let result;
    if (editing) {
      result = await updateItem(editing, clienteData);
    } else {
      result = await createItem(clienteData);
    }

    if (result.success) {
      setIsOpen(false);
      setForm({ nombre: '', apellido: '', telefono: '', correo: '', password: '', id: '' });
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar cliente ${nombre}?`)) return;
    const result = await deleteItem(id);
    if (!result.success) alert(result.error);
  };

  // Mostrar loading
  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#C9A84C] animate-pulse">Cargando clientes...</div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader eyebrow="Clientes" title="Gestión de clientes" />

      <div className="mt-6 flex items-center justify-end">
        <Button onClick={openCreate}>Nuevo cliente</Button>
      </div>

      <div className="mt-4 bg-[#141210] border border-[rgba(201,168,76,0.06)] rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-[#A89F8C] border-b border-[rgba(255,255,255,0.03)]">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="border-t border-[rgba(255,255,255,0.03)] hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#F5F1EB]">
                      {item.nombre} {item.apellido}
                    </div>
                    <div className="text-[#6B6357] text-xs">ID: {item.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[#C9A84C] text-sm">{item.correo}</div>
                  </td>
                  <td className="px-4 py-3 text-[#6B6357] text-sm">
                    {item.telefono || 'No especificado'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => openEdit(item)}>
                        Editar
                      </Button>
                      <Button 
                        onClick={() => handleDelete(item.id, item.nombre)} 
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
                <td colSpan={4} className="px-4 py-8 text-center text-[#6B6357]">
                  No hay clientes registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para crear/editar */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? 'Editar cliente' : 'Nuevo cliente'}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? 'Guardar cambios' : 'Crear cliente'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Nombre *</label>
            <input
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder="Nombre"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Apellido *</label>
            <input
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder="Apellido"
              value={form.apellido}
              onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Correo electrónico *</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder="correo@ejemplo.com"
              value={form.correo}
              onChange={e => setForm(f => ({ ...f, correo: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Teléfono</label>
            <input
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder="0981222333"
              value={form.telefono}
              onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">
              Contraseña {!editing && '*'}
            </label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder={editing ? "Dejar en blanco para mantener" : "Contraseña requerida"}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}