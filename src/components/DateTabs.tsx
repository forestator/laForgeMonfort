import { formatDateKey } from '../lib/dates';

interface DateTabsProps {
  dates: string[];
  selected: string;
  onSelect: (date: string) => void;
}

export function DateTabs({ dates, selected, onSelect }: DateTabsProps) {
  const moveTo = (index: number) => {
    const target = dates[(index + dates.length) % dates.length];
    onSelect(target);
    document.getElementById(`tab-${target}`)?.focus();
  };

  const handleKey = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowRight') moveTo(index + 1);
    else if (event.key === 'ArrowLeft') moveTo(index - 1);
    else if (event.key === 'Home') moveTo(0);
    else if (event.key === 'End') moveTo(dates.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <div className="tabs" role="tablist" aria-label="Soirées">
      {dates.map((date, index) => {
        const active = date === selected;
        return (
          <button
            key={date}
            id={`tab-${date}`}
            className="tab"
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls="tab-panel"
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(date)}
            onKeyDown={(event) => handleKey(event, index)}
          >
            {formatDateKey(date)}
          </button>
        );
      })}
    </div>
  );
}
