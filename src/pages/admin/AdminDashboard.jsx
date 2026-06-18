import SectionHeader from '../../components/ui/SectionHeader';

export default function AdminDashboard() {
  return (
    <div>
      <SectionHeader eyebrow="Admin" title="Dashboard" subtitle="Resumen rápido" />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#141210] border border-[rgba(201,168,76,0.06)] rounded-xl">Total turnos</div>
        <div className="p-4 bg-[#141210] border border-[rgba(201,168,76,0.06)] rounded-xl">Ingresos</div>
        <div className="p-4 bg-[#141210] border border-[rgba(201,168,76,0.06)] rounded-xl">Barberos</div>
      </div>
    </div>
  );
}
