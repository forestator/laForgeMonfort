import { useState } from 'react';
import { formatDateKey } from '../lib/dates';
import { usePlayer } from '../lib/player';
import { useUpcomingTables } from '../lib/tables';
import { DateTabs } from './DateTabs';
import { TableCard } from './TableCard';

export function TableList() {
  const { tables, loading, failed } = useUpcomingTables();
  const { player, register } = usePlayer();
  const [chosenDate, setChosenDate] = useState<string>();

  if (loading) return <p className="state">Chargement…</p>;
  if (failed)
    return (
      <p className="state error" role="alert">
        Impossible de charger les tables.
      </p>
    );
  if (tables.length === 0) {
    return (
      <p className="state">
        Aucune table ouverte pour le moment. Connectez-vous pour en ouvrir une !
      </p>
    );
  }

  const dates = [...new Set(tables.map((table) => table.date))];
  // Falls back to the first date when the chosen one no longer has tables.
  const selectedDate = chosenDate && dates.includes(chosenDate) ? chosenDate : dates[0];

  return (
    <>
      <DateTabs dates={dates} selected={selectedDate} onSelect={setChosenDate} />
      <section id="tab-panel" className="day" role="tabpanel" aria-labelledby="day-title">
        <h2 id="day-title" className="day__title">
          {formatDateKey(selectedDate)}
        </h2>
        {tables
          .filter((table) => table.date === selectedDate)
          .map((table) => (
            <TableCard key={table.id} table={table} player={player} onRegister={register} />
          ))}
      </section>
    </>
  );
}
