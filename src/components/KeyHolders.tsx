import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { returnKey, takeKey, useKeyHolders } from '../lib/keyHolders';
import { usePlayer } from '../lib/player';
import { formatDateKey } from '../lib/dates';
import { useToday } from '../lib/useToday';
import { Modal } from './Modal';
import { OpeningForm } from './OpeningForm';

interface KeyHoldersProps {
  onClose: () => void;
}

export function KeyHolders({ onClose }: KeyHoldersProps) {
  const { user } = useAuth();
  const notify = useToast();
  const { holders, loading, failed } = useKeyHolders();
  const [busy, setBusy] = useState(false);
  const { player } = usePlayer();
  const currentDay = useToday();

  const myHolder = holders.find((holder) => holder.id === user?.uid);
  const iHaveKey = myHolder !== undefined;

  const toggleKey = async () => {
    if (!user) return;
    setBusy(true);
    try {
      if (iHaveKey) {
        await returnKey(user.uid);
        notify('Tu as rendu ta clé… Gollum est triste.');
      } else {
        await takeKey({ id: user.uid, name: player?.name ?? user.displayName ?? 'Anonyme' });
        notify('Une précieuse de plus est à toi !');
      }
    } catch {
      notify('Impossible de mettre à jour tes clés.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal titleId="keys-title" onClose={onClose}>
      <span className="keys__gollum" aria-hidden="true">
        🔑
      </span>
      <h2 id="keys-title" className="keys__title">
        Qui a les clés du local ?
      </h2>
      {failed ? (
        <p className="error" role="alert">
          Impossible de charger la liste.
        </p>
      ) : loading ? (
        <p className="keys__quote">Chargement…</p>
      ) : holders.length === 0 ? (
        <p className="keys__quote">
          « Perdues… elles sont perdues, mes précieuses ! » Personne n’a déclaré de clé.
        </p>
      ) : (
        <>
          <p className="keys__quote">« Mes précieuses… nous les gardons, oui, oui ! »</p>
          <ul className="keys__list">
            {holders.map((holder) => (
              <li key={holder.id} className="chip">
                {holder.name}
                {/* Past announcements are hidden rather than deleted. */}
                {holder.opening && holder.opening.date >= currentDay && (
                  <>
                    {' '}
                    · ouvre {formatDateKey(holder.opening.date)} à {holder.opening.time}
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {user && myHolder && <OpeningForm userId={user.uid} current={myHolder.opening} />}
      <div className="keys__actions">
        {user ? (
          <button className="button button--primary" onClick={toggleKey} disabled={busy || failed}>
            {iHaveKey ? 'Je rends ma clé' : 'J’ai une clé'}
          </button>
        ) : (
          <p className="keys__quote">Connecte-toi pour déclarer que tu as une clé.</p>
        )}
      </div>
    </Modal>
  );
}
