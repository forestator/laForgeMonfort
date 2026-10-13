import { useAuth } from '../context/AuthContext';
import logo from '../assets/logoForge.jpg';

interface HeaderProps {
  onCreate: () => void;
  onShowKeys: () => void;
  onShowSettings: () => void;
}

export function Header({ onCreate, onShowKeys, onShowSettings }: HeaderProps) {
  const { user, loading, error, signIn, signOut } = useAuth();

  return (
    <header className="hero">
      <div className="container hero__inner">
        <div className="brand">
          <img className="brand__logo" src={logo} alt="" width={84} height={84} />
          <div>
            <h1 className="brand__title">La Forge</h1>
            <p className="brand__tagline">Soirées jeux · jeudi et samedi</p>
          </div>
        </div>

        {!loading && (
          <div className="hero__actions">
            <button className="button button--ghost" onClick={onShowKeys}>
              🔑 Clés du local
            </button>
            <button className="button button--ghost" onClick={onShowSettings}>
              ⚙️ Paramètres
            </button>
            {user ? (
              <>
                <button className="button button--primary" onClick={onCreate}>
                  Ouvrir une table
                </button>
                <button className="button button--ghost" onClick={signOut}>
                  Se déconnecter
                </button>
              </>
            ) : (
              <button className="button button--primary" onClick={signIn}>
                Se connecter pour ouvrir une table
              </button>
            )}
          </div>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>
    </header>
  );
}
