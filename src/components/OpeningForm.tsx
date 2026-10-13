import { useMemo, useState, type FormEvent } from 'react';
import { useToast } from '../context/ToastContext';
import { formatDateKey, upcomingGameDays } from '../lib/dates';
import { announceOpening, clearOpening } from '../lib/keyHolders';
import type { Opening } from '../lib/types';
import { TimeField } from './TimeField';

interface OpeningFormProps {
  userId: string;
  current?: Opening;
}

const PROPOSED_DAYS = 4;

export function OpeningForm({ userId, current }: OpeningFormProps) {
  const notify = useToast();
  const days = useMemo(() => upcomingGameDays(PROPOSED_DAYS), []);
  const [date, setDate] = useState(current?.date ?? days[0]);
  const [time, setTime] = useState(current?.time ?? '');
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<void>, successMessage: string) => {
    setBusy(true);
    try {
      await action();
      notify(successMessage);
    } catch {
      notify('Action impossible. Réessaie.');
    } finally {
      setBusy(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (time) run(() => announceOpening(userId, { date, time }), 'Ouverture annoncée');
  };

  return (
    <form className="form keys__opening" onSubmit={submit}>
      <label className="field">
        <span className="field__label">Jour d’ouverture</span>
        <select
          className="field__input"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        >
          {/* A past announced date stays selectable until it is changed. */}
          {!days.includes(date) && <option value={date}>{formatDateKey(date)}</option>}
          {days.map((day) => (
            <option key={day} value={day}>
              {formatDateKey(day)}
            </option>
          ))}
        </select>
      </label>
      <TimeField label="Heure d’ouverture" value={time} onChange={setTime} />
      <div className="keys__actions">
        <button className="button button--primary" type="submit" disabled={busy || !time}>
          Annoncer l’ouverture
        </button>
        {current && (
          <button
            className="button button--ghost"
            type="button"
            disabled={busy}
            onClick={() => run(() => clearOpening(userId), 'Annonce retirée')}
          >
            Retirer l’annonce
          </button>
        )}
      </div>
    </form>
  );
}
