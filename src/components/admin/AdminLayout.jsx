import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './Header';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-[#0B0A09] text-[#F5F1EB]">
      <Sidebar />

      <div className="flex-1 p-6">
        <AdminHeader />
        <main className="mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
