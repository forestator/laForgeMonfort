import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { deleteTable, joinTable, leaveTable } from '../lib/tables';
import type { GameTable, Player } from '../lib/types';
import { JoinForm } from './JoinForm';

interface TableCardProps {
  table: GameTable;
  player: Player | null;
  onRegister: (name: string) => Player;
}

export function TableCard({ table, player, onRegister }: TableCardProps) {
  const { user } = useAuth();
  const notify = useToast();
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const myEntry = table.players.find((entry) => entry.id === player?.id);
  const isFull = table.players.length >= table.maxPlayers;
  const isHost = user?.uid === table.hostId;
  const fillPercent = Math.min(100, (table.players.length / table.maxPlayers) * 100);
  const defaultName = player?.name ?? user?.displayName ?? '';

  const run = async (action: () => Promise<unknown>, successMessage: string) => {
    setError('');
    try {
      await action();
      notify(successMessage);
    } catch {
      setError('Action impossible. Réessayez.');
    }
  };

  return (
    <article className="card">
      <div className="card__header">
        {table.coverUrl && (
          <img className="cover" src={table.coverUrl} alt="" width={72} height={72} />
        )}
        <div>
          <h3 className="card__title">{table.gameName}</h3>
          <p className="card__meta">
            Proposé par {table.hostName}
            {table.startTime && ` · à ${table.startTime}`}
          </p>
        </div>
      </div>
      <div className="meter">
        <div className="meter__track" aria-hidden="true">
          <div className="meter__fill" style={{ width: `${fillPercent}%` }} />
        </div>
        <span className="meter__label">
          {table.players.length}/{table.maxPlayers} joueurs
        </span>
      </div>
      {table.notes && <p>{table.notes}</p>}

      {table.players.length > 0 && (
        <ul className="players" aria-label="Joueurs inscrits">
          {table.players.map((entry) => (
            <li key={entry.id} className="chip">
              {entry.name}
            </li>
          ))}
        </ul>
      )}

      {myEntry && (
        <button
          className="button button--ghost"
          onClick={() => run(() => leaveTable(table.id, myEntry), 'Inscription annulée')}
        >
          Me désinscrire
        </button>
      )}
      {!myEntry && isFull && <p className="badge">Table complète</p>}
      {!myEntry && !isFull && (
        <JoinForm
          tableId={table.id}
          defaultName={defaultName}
          onJoin={(name) =>
            run(() => joinTable(table.id, onRegister(name)), 'Inscription enregistrée')
          }
        />
      )}

      {isHost && !confirmingDelete && (
        <button className="button button--danger" onClick={() => setConfirmingDelete(true)}>
          Supprimer la table
        </button>
      )}
      {isHost && confirmingDelete && (
        <div className="confirm" role="alertdialog" aria-label="Confirmer la suppression">
          <p className="confirm__text">
            Supprimer « {table.gameName} » ? Cette action est définitive.
          </p>
          <button
            className="button button--danger"
            onClick={() => run(() => deleteTable(table.id), 'Table supprimée')}
          >
            Oui, supprimer
          </button>
          <button className="button button--ghost" onClick={() => setConfirmingDelete(false)}>
            Annuler
          </button>
        </div>
      )}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </article>
  );
}
