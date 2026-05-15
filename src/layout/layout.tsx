import Header from "./header";
import Sidebar from "./sidebar"; // ¡Nuevo componente!

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // Cambiamos a flex-row para poner Sidebar a la izq y contenido a la der
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header />
        
        {/* Page content */}
        <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-12">
          {children}
        </main>
        
        {/* Simple footer */}
        <footer className="py-6 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 mt-auto">
          Built by Juan José Sánchez | AI Engineer
        </footer>
      </div>

    </div>
  );
}