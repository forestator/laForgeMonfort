import type { User } from 'firebase/auth';
import { useMemo, useState, type FormEvent } from 'react';
import { formatDateKey, upcomingGameDays } from '../lib/dates';
import { useToast } from '../context/ToastContext';
import { isGameSearchEnabled } from '../lib/bgg';
import { usePlayer } from '../lib/player';
import { createTable } from '../lib/tables';
import { GameSearch } from './GameSearch';
import { TimeField } from './TimeField';

interface CreateTableFormProps {
  user: User;
  onDone: () => void;
}

const DEFAULT_MAX_PLAYERS = 4;
const PROPOSED_DAYS = 8;
const GAME_NAME_MAX_LENGTH = 80;

export function CreateTableForm({ user, onDone }: CreateTableFormProps) {
  const notify = useToast();
  const days = useMemo(() => upcomingGameDays(PROPOSED_DAYS), []);
  const [date, setDate] = useState(days[0]);
  const { player, register } = usePlayer();
  // The name is edited in the settings, so the form only reads it.
  const hostName = player?.name ?? user.displayName ?? 'Anonyme';
  const [gameName, setGameName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(DEFAULT_MAX_PLAYERS);
  const [notes, setNotes] = useState('');
  const [startTime, setStartTime] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createTable({
        date,
        gameName: gameName.trim(),
        hostId: user.uid,
        hostName,
        maxPlayers,
        notes: notes.trim(),
        // Registering reuses the browser's player id, so the host can leave or rejoin like anyone.
        players: [register(hostName)],
        // Firestore rejects undefined, so optional fields are only sent when filled.
        ...(startTime && { startTime }),
        ...(coverUrl && { coverUrl }),
      });
      notify('Table créée');
      onDone();
    } catch {
      setError('Impossible de créer la table. Réessayez.');
      setSaving(false);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2 className="card__title">Ouvrir une table</h2>

      <p className="card__meta">
        Table ouverte au nom de {hostName} (modifiable dans les paramètres).
      </p>

      <label className="field">
        <span className="field__label">Soirée</span>
        <select
          className="field__input"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {formatDateKey(day)}
            </option>
          ))}
        </select>
      </label>

      {isGameSearchEnabled && (
        <GameSearch
          onPick={(game) => {
            setGameName(game.name.slice(0, GAME_NAME_MAX_LENGTH));
            setCoverUrl(game.coverUrl ?? '');
          }}
        />
      )}

      <label className="field">
        <span className="field__label">Jeu</span>
        <input
          className="field__input"
          value={gameName}
          onChange={(event) => setGameName(event.target.value)}
          maxLength={GAME_NAME_MAX_LENGTH}
          required
        />
      </label>

      {coverUrl && (
        <div className="cover-preview">
          <img className="cover" src={coverUrl} alt="" width={64} height={64} />
          <button className="button button--ghost" type="button" onClick={() => setCoverUrl('')}>
            Retirer la couverture
          </button>
        </div>
      )}

      <TimeField label="Heure de début (optionnel)" value={startTime} onChange={setStartTime} />

      <label className="field">
        <span className="field__label">Nombre de joueurs maximum</span>
        <input
          className="field__input"
          type="number"
          min={2}
          max={20}
          value={maxPlayers}
          onChange={(event) => setMaxPlayers(Number(event.target.value))}
          required
        />
      </label>

      <label className="field">
        <span className="field__label">Remarques (optionnel)</span>
        <textarea
          className="field__input"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          maxLength={300}
          rows={2}
        />
      </label>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <div className="form__actions">
        <button className="button button--primary" type="submit" disabled={saving}>
          Créer la table
        </button>
        <button className="button" type="button" onClick={onDone}>
          Annuler
        </button>
      </div>
    </form>
  );
}
