import SectionHeader from '../../components/ui/SectionHeader';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/admin/Modal';
import { useHorarios } from '../../hooks/useHorarios';

export default function AdminHorarios() {
  const { items, barberos, loading, error, createItem, updateItem, deleteItem } = useHorarios();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    id_horario: '',
    id_barbero: '',
    dia_semana: 1,
    hora_inicio: '09:00',
    hora_fin: '17:00'
  });

  const diasSemana = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 7, label: 'Domingo' }
  ];

  const openCreate = () => {
    setEditing(null);
    setForm({
      id_horario: `h-${Date.now()}`,
      id_barbero: '',
      dia_semana: 1,
      hora_inicio: '09:00',
      hora_fin: '17:00'
    });
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item.id_horario);
    setForm({
      id_horario: item.id_horario,
      id_barbero: item.id_barbero || '',
      dia_semana: item.dia_semana || 1,
      hora_inicio: item.hora_inicio ? item.hora_inicio.substring(0, 5) : '09:00',
      hora_fin: item.hora_fin ? item.hora_fin.substring(0, 5) : '17:00'
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!form.id_barbero) return alert('Debe seleccionar un barbero');
    if (!form.hora_inicio) return alert('Hora de inicio requerida');
    if (!form.hora_fin) return alert('Hora de fin requerida');
    
    if (form.hora_inicio >= form.hora_fin) {
      return alert('La hora de inicio debe ser menor que la hora de fin');
    }

    const horarioData = {
      id_barbero: parseInt(form.id_barbero),
      dia_semana: parseInt(form.dia_semana),
      hora_inicio: form.hora_inicio,
      hora_fin: form.hora_fin
    };

    let result;
    if (editing) {
      result = await updateItem(editing, horarioData);
    } else {
      result = await createItem(horarioData);
    }

    if (result.success) {
      setIsOpen(false);
      setForm({
        id_horario: '',
        id_barbero: '',
        dia_semana: 1,
        hora_inicio: '09:00',
        hora_fin: '17:00'
      });
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id, barberoNombre) => {
    if (!confirm(`¿Eliminar horario de ${barberoNombre}?`)) return;
    const result = await deleteItem(id);
    if (!result.success) alert(result.error);
  };

  const getDiaSemanaLabel = (dia) => {
    const diaObj = diasSemana.find(d => d.value === dia);
    return diaObj ? diaObj.label : `Día ${dia}`;
  };

  const getBarberoNombre = (idBarbero) => {
    const barbero = barberos.find(b => b.id_barbero === idBarbero);
    if (barbero) {
      return `${barbero.nombres} ${barbero.apellido}`;
    }
    return `Barbero #${idBarbero}`;
  };

  const formatHora = (hora) => {
    if (!hora) return '—';
    return hora.substring(0, 5);
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#C9A84C] animate-pulse">Cargando horarios...</div>
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
      <SectionHeader eyebrow="Horarios" title="Horarios de barberos" />

      <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
        {items.length > 0 && (
          <div className="bg-[#0D0C0A] border border-[rgba(201,168,76,0.06)] rounded-lg px-4 py-2">
            <span className="text-[#A89F8C] text-sm">Total horarios: </span>
            <span className="text-[#C9A84C] font-bold text-lg ml-2">
              {items.length}
            </span>
          </div>
        )}
        <Button onClick={openCreate}>Nuevo horario</Button>
      </div>

      <div className="mt-4 bg-[#141210] border border-[rgba(201,168,76,0.06)] rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-[#A89F8C] border-b border-[rgba(255,255,255,0.03)]">
              <th className="px-4 py-3">Barbero</th>
              <th className="px-4 py-3">Día</th>
              <th className="px-4 py-3">Hora inicio</th>
              <th className="px-4 py-3">Hora fin</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id_horario} className="border-t border-[rgba(255,255,255,0.03)] hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#F5F1EB]">
                      {getBarberoNombre(item.id_barbero)}
                    </div>
                    <div className="text-[#6B6357] text-xs">ID Barbero: {item.id_barbero}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#C9A84C] text-sm">
                      {getDiaSemanaLabel(item.dia_semana)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#F5F1EB] text-sm">
                    {formatHora(item.hora_inicio)}
                  </td>
                  <td className="px-4 py-3 text-[#F5F1EB] text-sm">
                    {formatHora(item.hora_fin)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => openEdit(item)}>
                        Editar
                      </Button>
                      <Button 
                        onClick={() => handleDelete(item.id_horario, getBarberoNombre(item.id_barbero))} 
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
                  No hay horarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de horarios agrupados por barbero */}
      {items.length > 0 && barberos.length > 0 && (
        <div className="mt-6">
          <h3 className="text-[#F5F1EB] font-medium mb-3">Horarios por barbero</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {barberos.map(barbero => {
              const horariosBarbero = items.filter(h => h.id_barbero === barbero.id_barbero);
              if (horariosBarbero.length === 0) return null;
              return (
                <div key={barbero.id_barbero} className="bg-[#141210] border border-[rgba(201,168,76,0.06)] rounded-lg p-4">
                  <h4 className="text-[#C9A84C] font-medium mb-3">
                    {barbero.nombres} {barbero.apellido}
                  </h4>
                  <div className="space-y-2">
                    {horariosBarbero.map(horario => (
                      <div key={horario.id_horario} className="flex justify-between items-center text-sm">
                        <span className="text-[#A89F8C]">{getDiaSemanaLabel(horario.dia_semana)}</span>
                        <span className="text-[#F5F1EB]">
                          {formatHora(horario.hora_inicio)} - {formatHora(horario.hora_fin)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? 'Editar horario' : 'Nuevo horario'}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? 'Guardar cambios' : 'Crear horario'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4">
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
                  {barbero.nombres} {barbero.apellido} - {barbero.especialidad || 'Barbero'}
                </option>
              ))}
            </select>
            {barberos.length === 0 && (
              <p className="text-[#6B6357] text-xs mt-1">No hay barberos disponibles. Crea un barbero primero.</p>
            )}
          </div>

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Día de la semana *</label>
            <select
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              value={form.dia_semana}
              onChange={e => setForm(f => ({ ...f, dia_semana: parseInt(e.target.value) }))}
            >
              {diasSemana.map(dia => (
                <option key={dia.value} value={dia.value}>{dia.label}</option>
              ))}
            </select>
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

          <div>
            <label className="text-sm text-[#A89F8C] block mb-2">Hora de fin *</label>
            <input
              type="time"
              className="w-full p-3 rounded-lg bg-[#0D0C0A] border border-[rgba(255,255,255,0.03)] text-[#F5F1EB] focus:outline-none focus:border-[#C9A84C] transition-colors"
              value={form.hora_fin}
              onChange={e => setForm(f => ({ ...f, hora_fin: e.target.value }))}
            />
          </div>

          {/* Vista previa del horario */}
          {form.id_barbero && form.hora_inicio && form.hora_fin && (
            <div className="mt-2 p-3 bg-[#0D0C0A] rounded-lg border border-[rgba(201,168,76,0.06)]">
              <span className="text-[#A89F8C] text-sm">Vista previa: </span>
              <span className="text-[#C9A84C] ml-2">
                {getBarberoNombre(parseInt(form.id_barbero))}
              </span>
              <span className="text-[#F5F1EB] text-sm ml-2">
                {getDiaSemanaLabel(form.dia_semana)} {form.hora_inicio} - {form.hora_fin}
              </span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}