import { Link, useLocation } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import Button from '../ui/Button';

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Backdrop blur bar */}
      <div className="absolute inset-0 bg-[rgba(13,12,10,0.85)] backdrop-blur-xl border-b border-[rgba(201,168,76,0.08)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8A6A1F] flex items-center justify-center shadow-[0_2px_12px_rgba(201,168,76,0.3)]">
            <Scissors size={14} className="text-black rotate-45" />
          </div>
          <span className="font-display text-lg font-semibold tracking-wide gold-gradient-text">
            Barbería
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={`text-sm font-medium transition-colors duration-200 ${isHome ? 'text-[#C9A84C]' : 'text-[#A89F8C] hover:text-[#F5F1EB]'}`}>
            Inicio
          </Link>
          <Link to="/reservar" className={`text-sm font-medium transition-colors duration-200 ${!isHome ? 'text-[#C9A84C]' : 'text-[#A89F8C] hover:text-[#F5F1EB]'}`}>
            Reservas
          </Link>
        </nav>

        {/* CTA */}
        <Link to="/reservar">
          <Button size="sm" variant={isHome ? 'primary' : 'outline'}>
            Reservar
          </Button>
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[rgba(201,168,76,0.08)] bg-[#070605]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8A6A1F] flex items-center justify-center">
              <Scissors size={12} className="text-black rotate-45" />
            </div>
            <span className="font-display text-base font-semibold gold-gradient-text">Barbería</span>
          </div>

          <p className="text-[#6B6357] text-sm">
            © {new Date().getFullYear()} Barbería Premium · Todos los derechos reservados
          </p>

          <Link to="/reservar">
            <Button size="sm" variant="outline">
              Reservar turno
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0D0C0A] flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
