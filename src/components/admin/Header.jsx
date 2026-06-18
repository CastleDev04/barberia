import { useNavigate } from 'react-router-dom';

export default function AdminHeader({ user = { name: 'Admin' } }) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-transparent border-b border-[rgba(255,255,255,0.02)]">
      <div className="flex items-center gap-3">
        <div className="text-[#F5F1EB] font-display font-semibold">Panel</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-[#6B6357]">{user.name}</div>
        <button
          className="text-sm text-[#C9A84C] bg-[rgba(201,168,76,0.08)] px-3 py-1 rounded-md"
          onClick={() => navigate('/')}
        >Cerrar sesión</button>
      </div>
    </header>
  );
}
