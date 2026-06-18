import SectionHeader from '../../components/ui/SectionHeader';
import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/admin/Modal';
import { useBarberos } from '../../hooks/useBarberos';

export default function AdminBarberos() {
  const { barberos, loading, error, createBarbero, updateBarbero, deleteBarbero, refreshBarberos } = useBarberos();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombres: '',
    apellido: '',
    telefono: '',
    correo: '',
    password: '',
    salario: '',
    especialidad: '',
    estado: 'Disponible'
  });

  // Recargar datos cuando el componente monta
  useEffect(() => {
    refreshBarberos();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      nombres: '',
      apellido: '',
      telefono: '',
      correo: '',
      password: '',
      salario: '',
      especialidad: '',
      estado: 'Disponible'
    });
    setIsOpen(true);
  };

  const openEdit = (barbero) => {
    setEditing(barbero.id_barbero);
    setForm({
      nombres: barbero.nombres,
      apellido: barbero.apellido,
      telefono: barbero.telefono,
      correo: barbero.correo,
      password: '',
      salario: barbero.salario,
      especialidad: barbero.especialidad,
      estado: barbero.estado
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!form.nombres) return alert('Nombre requerido');
    if (!form.apellido) return alert('Apellido requerido');
    if (!form.correo) return alert('Correo requerido');

    const barberoData = {
      nombres: form.nombres,
      apellido: form.apellido,
      telefono: form.telefono,
      correo: form.correo,
      salario: parseFloat(form.salario),
      especialidad: form.especialidad,
      estado: form.estado
    };

    if (form.password) {
      barberoData.password = form.password;
    }

    let result;
    if (editing) {
      result = await updateBarbero(editing, barberoData);
    } else {
      result = await createBarbero(barberoData);
    }

    if (result.success) {
      setIsOpen(false);
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar barbero?')) return;
    const result = await deleteBarbero(id);
    if (!result.success) {
      alert(result.error);
    }
  };

  if (loading && barberos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#C9A84C]">Cargando...</div>
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
      <SectionHeader eyebrow="Barberos" title="Gestión de barberos" />
      
      <div className="mt-6 flex items-center justify-end">
        <Button onClick={openCreate}>Nuevo barbero</Button>
      </div>

      <div className="mt-4 bg-[#141210] border border-[rgba(201,168,76,0.06)] rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-[#A89F8C] border-b border-[rgba(255,255,255,0.03)]">
              <th className="px-4 py-3">Barbero</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Especialidad</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {barberos.map(barbero => (
              <tr key={barbero.id_barbero} className="border-t border-[rgba(255,255,255,0.03)] hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-[#F5F1EB]">
                    {barbero.nombres} {barbero.apellido}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-[#C9A84C] text-sm">{barbero.correo}</div>
                  <div className="text-[#6B6357] text-xs">{barbero.telefono}</div>
                </td>
                <td className="px-4 py-3 text-[#6B6357] text-sm">{barbero.especialidad}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    barbero.estado === 'Disponible' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {barbero.estado}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => openEdit(barbero)}>Editar</Button>
                    <Button onClick={() => handleDelete(barbero.id_barbero)} className="bg-red-600/10 text-red-300">
                      Eliminar
                    </Button>
                  </div>
                </td>
               </tr>
            ))}
            {barberos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#6B6357]">
                  No hay barberos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? 'Editar barbero' : 'Nuevo barbero'}
        footer={(
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? 'Guardar cambios' : 'Crear barbero'}</Button>
          </div>
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Nombres *</label>
            <input 
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors" 
              value={form.nombres} 
              onChange={(e) => setForm(f => ({...f, nombres: e.target.value}))} 
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Apellidos *</label>
            <input 
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors" 
              value={form.apellido} 
              onChange={(e) => setForm(f => ({...f, apellido: e.target.value}))} 
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Teléfono</label>
            <input 
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors" 
              value={form.telefono} 
              onChange={(e) => setForm(f => ({...f, telefono: e.target.value}))} 
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Correo electrónico *</label>
            <input 
              type="email"
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors" 
              value={form.correo} 
              onChange={(e) => setForm(f => ({...f, correo: e.target.value}))} 
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">
              Contraseña {!editing && '*'}
            </label>
            <input 
              type="password"
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors" 
              value={form.password} 
              onChange={(e) => setForm(f => ({...f, password: e.target.value}))}
              placeholder={editing ? "Dejar en blanco para mantener" : "Contraseña requerida"}
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Salario</label>
            <input 
              type="number"
              step="1000"
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors" 
              value={form.salario} 
              onChange={(e) => setForm(f => ({...f, salario: e.target.value}))}
            />
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Especialidad</label>
            <select 
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              value={form.especialidad}
              onChange={(e) => setForm(f => ({...f, especialidad: e.target.value}))}
            >
              <option value="">Seleccionar especialidad</option>
              <option value="barbero">Barbero</option>
              <option value="estilista">Estilista</option>
              <option value="colorista">Colorista</option>
              <option value="manicurista">Manicurista</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Estado</label>
            <select 
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              value={form.estado}
              onChange={(e) => setForm(f => ({...f, estado: e.target.value}))}
            >
              <option value="Disponible">Disponible</option>
              <option value="Ocupado">Ocupado</option>
              <option value="Descanso">Descanso</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}