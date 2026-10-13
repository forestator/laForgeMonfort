import { lazy, Suspense, useState } from 'react';
import { AuthProvider } from './context/AuthProvider';
import { ToastProvider } from './context/ToastProvider';
import { useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { KeyHolders } from './components/KeyHolders';
import { Settings } from './components/Settings';
import { TableList } from './components/TableList';

const CreateTableForm = lazy(() =>
  import('./components/CreateTableForm').then((module) => ({ default: module.CreateTableForm })),
);

function Content() {
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);
  const [showingKeys, setShowingKeys] = useState(false);
  const [showingSettings, setShowingSettings] = useState(false);

  return (
    <>
      <Header
        onCreate={() => setCreating(true)}
        onShowKeys={() => setShowingKeys(true)}
        onShowSettings={() => setShowingSettings(true)}
      />
      <main className="container">
        {creating && user && (
          <Suspense fallback={<p>Chargement…</p>}>
            <CreateTableForm user={user} onDone={() => setCreating(false)} />
          </Suspense>
        )}
        <TableList />
      </main>
      {showingSettings && <Settings onClose={() => setShowingSettings(false)} />}
      {showingKeys && <KeyHolders onClose={() => setShowingKeys(false)} />}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Content />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
