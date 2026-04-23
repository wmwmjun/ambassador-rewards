'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/app/components/Icon';
import type { IconName } from '@/app/components/Icon';

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/admin',                  label: 'Dashboard',    icon: 'dashboard'  },
  { href: '/admin/registrations',    label: 'Registrations',icon: 'shield'     },
  { href: '/admin/users',            label: 'Users',        icon: 'users'      },
  { href: '/admin/points',           label: 'Points',       icon: 'wallet'     },
  { href: '/admin/egift',            label: 'eGift',        icon: 'gift'       },
  { href: '/admin/transfers',        label: 'Transfers',    icon: 'bank'       },
  { href: '/admin/products',         label: 'Products',     icon: 'layers'     },
  { href: '/admin/reports',          label: 'Reports',      icon: 'file-text'  },
  { href: '/admin/audit',            label: 'Audit Log',    icon: 'log'        },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="admin-root">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="grad-text" style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>GliaCircle</div>
          <div style={{ fontSize: 10, color: '#A8A5C8', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>Admin Panel</div>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className={`admin-nav-item${path === n.href ? ' active' : ''}`}
            >
              <Icon name={n.icon} size={17} color={path === n.href ? '#7B72E8' : '#A8A5C8'} sw={path === n.href ? 2.2 : 1.8} />
              {n.label}
            </Link>
          ))}

          <div style={{ flex: 1 }} />

          <Link href="/" className="admin-nav-item" style={{ marginTop: 8 }}>
            <Icon name="arrow-left" size={17} color="#A8A5C8" sw={1.8} />
            Back to App
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 13 }}>A</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1740', lineHeight: 1.2 }}>Ayesha Khan</div>
            <div style={{ fontSize: 11, color: '#A8A5C8' }}>Super Admin</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
