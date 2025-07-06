'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Moon,
  FileText,
  LibraryBig,
  LogOut,
  Menu,
  Settings,
  X,
} from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useAuth } from '@/hooks/use-auth';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  { href: '/', label: 'Consulta', icon: Moon },
  { href: '/reports', label: 'Meus Relatórios', icon: FileText },
  { href: '/content', label: 'Mais Conteúdo', icon: LibraryBig },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

const NavLink = ({
  href,
  label,
  icon: Icon,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isActive && 'bg-muted text-primary'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};

const MobileNav = ({ onLogout }: { onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Alternar menu de navegação</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Logo className="h-6 w-6" />
            <span className="sr-only">Consultoria do Sono</span>
          </Link>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              onNavigate={() => setIsOpen(false)}
            />
          ))}
        </nav>
        <div className="mt-auto">
          <Button variant="ghost" onClick={onLogout} className="w-full justify-start gap-3 px-3 py-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Logo />
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
           <Button variant="ghost" onClick={onLogout} className="w-full justify-start gap-3 px-3 py-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar onLogout={logout} />
      <div className="flex flex-col">
         <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <MobileNav onLogout={logout} />
          <div className="w-full flex-1">
            <Logo />
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
