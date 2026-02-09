import { Outlet, Link, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-6 py-3 flex items-center justify-between backdrop-blur-sm bg-[var(--bg-primary)]/80 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <img src="/probe.svg" alt="Probe" className="w-6 h-6" />
          <h1 className="text-sm font-semibold tracking-tight text-[var(--text-primary)] m-0 group-hover:opacity-80 transition-opacity">
            Probe
          </h1>
          <span className="hidden sm:inline text-[10px] text-[var(--text-tertiary)] font-['JetBrains_Mono'] border-l border-[var(--border)] pl-2.5 ml-0.5">
            API Test Runner
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`text-xs no-underline px-3 py-1.5 rounded transition-all font-medium tracking-wide uppercase ${
              isHome
                ? 'bg-white text-black'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            Dashboard
          </Link>
        </nav>
      </header>

      {/* Hero — only on home */}
      {isHome && (
        <div className="border-b border-[var(--border)] px-6 py-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Probe
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed m-0">
            Define API tests in YAML, run them from the CLI or web, and track results over time.
            Fast, lightweight, zero-config.
          </p>
          <div className="flex items-center justify-center gap-4 mt-5">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-[var(--text-tertiary)] font-['JetBrains_Mono'] uppercase tracking-widest">
              <span className="w-1 h-1 rounded-full bg-[var(--success)]"></span>
              YAML-driven
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-[var(--text-tertiary)] font-['JetBrains_Mono'] uppercase tracking-widest">
              <span className="w-1 h-1 rounded-full bg-[var(--success)]"></span>
              CLI + Web
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-[var(--text-tertiary)] font-['JetBrains_Mono'] uppercase tracking-widest">
              <span className="w-1 h-1 rounded-full bg-[var(--success)]"></span>
              Run History
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-3 flex items-center justify-between">
        <span className="text-[10px] text-[var(--text-tertiary)] tracking-widest uppercase font-['JetBrains_Mono']">
          Probe
        </span>
        <span className="text-[10px] text-[var(--text-tertiary)] font-['JetBrains_Mono']">
          API Test Runner
        </span>
      </footer>
    </div>
  );
}
