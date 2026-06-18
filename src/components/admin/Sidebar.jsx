import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/barberos', label: 'Barberos' },
  { to: '/admin/encargados', label: 'Encargados' },
  { to: '/admin/servicios', label: 'Servicios' },
  { to: '/admin/clientes', label: 'Clientes' },
  { to: '/admin/turnos', label: 'Turnos' },
  { to: '/admin/horarios', label: 'Horarios' },
  { to: '/admin/gastos', label: 'Gastos' },
  { to: '/admin/pagos', label: 'Pagos' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0F0E0C] border-r border-[rgba(255,255,255,0.03)] min-h-screen px-4 py-6">
      <div className="mb-8">
        <div className="text-[#C9A84C] font-display text-xl font-semibold">Barbería</div>
        <div className="text-[#6B6357] text-xs">Panel administrativo</div>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/admin'}
            className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-[rgba(201,168,76,0.08)] text-[#C9A84C]' : 'text-[#A89F8C] hover:bg-[rgba(255,255,255,0.02)]'}`}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
