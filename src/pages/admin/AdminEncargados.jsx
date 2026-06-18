import SectionHeader from '../../components/ui/SectionHeader';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/admin/Modal';
import { useEncargados } from '../../hooks/useEncargados';

export default function AdminEncargados() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useEncargados();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    password: '',
    salario: '',
    estado: 'ACTIVO'
  });

  const estados = ['ACTIVO', 'INACTIVO', 'VACACIONES'];

  const openCreate = () => {
    setEditing(null);
    setForm({
      id: `e-${Date.now()}`,
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      password: '',
      salario: '',
      estado: 'ACTIVO'
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
      password: '',
      salario: item.salario || '',
      estado: item.estado || 'ACTIVO'
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) return alert('Nombre requerido');
    if (!form.apellido.trim()) return alert('Apellido requerido');
    if (!form.correo.trim()) return alert('Correo requerido');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.correo)) return alert('Correo electrónico inválido');
    
    if (!editing && !form.password.trim()) return alert('Contraseña requerida');

    const encargadoData = {
      nombre: form.nombre,
      apellido: form.apellido,
      telefono: form.telefono,
      correo: form.correo,
      salario: parseFloat(form.salario) || 0,
      estado: form.estado
    };

    if (form.password) {
      encargadoData.password = form.password;
    }

    let result;
    if (editing) {
      result = await updateItem(editing, encargadoData);
    } else {
      result = await createItem(encargadoData);
    }

    if (result.success) {
      setIsOpen(false);
      setForm({
        id: '',
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        password: '',
        salario: '',
        estado: 'ACTIVO'
      });
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar encargado ${nombre}?`)) return;
    const result = await deleteItem(id);
    if (!result.success) alert(result.error);
  };

  const formatSalario = (salario) => {
    if (!salario) return 'No especificado';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salario);
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'ACTIVO': return 'bg-green-500/20 text-green-400';
      case 'INACTIVO': return 'bg-red-500/20 text-red-400';
      case 'VACACIONES': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#C9A84C] animate-pulse">Cargando encargados...</div>
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
      <SectionHeader eyebrow="Encargados" title="Gestión de encargados" />

      <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
        {items.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            <div className="bg-[#0D0C0A] border border-[rgba(201,168,76,0.06)] rounded-lg px-4 py-2">
              <span className="text-[#A89F8C] text-sm">Total encargados: </span>
              <span className="text-[#C9A84C] font-bold text-lg ml-2">
                {items.length}
              </span>
            </div>
            <div className="bg-[#0D0C0A] border border-[rgba(201,168,76,0.06)] rounded-lg px-4 py-2">
              <span className="text-[#A89F8C] text-sm">Activos: </span>
              <span className="text-green-400 font-bold text-lg ml-2">
                {items.filter(i => i.estado === 'ACTIVO').length}
              </span>
            </div>
          </div>
        )}
        <Button onClick={openCreate}>Nuevo encargado</Button>
      </div>

      <div className="mt-4 bg-[#141210] border border-[rgba(201,168,76,0.06)] rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-[#A89F8C] border-b border-[rgba(255,255,255,0.03)]">
              <th className="px-4 py-3">Encargado</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Salario</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
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
                  <td className="px-4 py-3 text-[#F5F1EB] text-sm">
                    {formatSalario(item.salario)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(item.estado)}`}>
                      {item.estado}
                    </span>
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
                <td colSpan={6} className="px-4 py-8 text-center text-[#6B6357]">
                  No hay encargados registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? 'Editar encargado' : 'Nuevo encargado'}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? 'Guardar cambios' : 'Crear encargado'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="0981123456"
              value={form.telefono}
              onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Salario</label>
            <input
              type="number"
              step="100000"
              min="0"
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder="5000000"
              value={form.salario}
              onChange={e => setForm(f => ({ ...f, salario: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Estado</label>
            <select
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              value={form.estado}
              onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
            >
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
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

          {/* Vista previa del salario */}
          {form.salario && parseFloat(form.salario) > 0 && (
            <div className="md:col-span-2 mt-2 p-3 bg-[#0D0C0A] rounded-lg border border-[rgba(201,168,76,0.06)]">
              <span className="text-[#A89F8C] text-sm">Vista previa: </span>
              <span className="text-[#C9A84C] font-bold ml-2">
                {formatSalario(form.salario)}
              </span>
              <span className="text-[#6B6357] text-xs ml-2">
                • {form.estado}
              </span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}