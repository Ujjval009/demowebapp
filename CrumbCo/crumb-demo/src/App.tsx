import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DemoTour } from './components/layout/DemoTour';
import { ToastStack } from './components/ui/ToastStack';
import { DashboardView } from './components/views/DashboardView';
import { PosView } from './components/views/PosView';
import { InventoryView } from './components/views/InventoryView';
import { ExpiryView } from './components/views/ExpiryView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { CrmView } from './components/views/CrmView';
import { FranchiseView } from './components/views/FranchiseView';

function Main() {
  const { view, tourActive } = useApp();
  return (
    <div className="main" style={tourActive ? { paddingTop: '18px' } : undefined}>
      <Topbar />
      <div className="view" key={view}>
        {view === 'dashboard' && <DashboardView />}
        {view === 'pos' && <PosView />}
        {view === 'inventory' && <InventoryView />}
        {view === 'expiry' && <ExpiryView />}
        {view === 'analytics' && <AnalyticsView />}
        {view === 'crm' && <CrmView />}
        {view === 'franchise' && <FranchiseView />}
      </div>
    </div>
  );
}

function Shell() {
  return (
    <div className="app">
      <Sidebar />
      <Main />
      <ToastStack />
      <DemoTour />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}