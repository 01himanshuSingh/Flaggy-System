
import Providers from "@/app/provider";
import { Navbar } from "@/components/dashboard-Component/Navbar";
import { ProjectProvider } from "@/components/dashboard-Component/projectswitcher/ProjectProvider";
import Sidebar from "@/components/dashboard-Component/sidebar/Sidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectProvider>


    <div className="flex min-h-screen ">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-1 flex-col md:ml-64">
        
        {/* Top Navigation */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
    </ProjectProvider>
  
  );  
}
