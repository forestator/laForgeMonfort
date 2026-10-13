interface TimeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const pad = (value: number) => String(value).padStart(2, '0');
const HOURS = Array.from({ length: 24 }, (_, hour) => pad(hour));
const MINUTES = ['00', '15', '30', '45'];

// Native time inputs follow the browser locale (12h in some), so 24h is enforced with selects.
export function TimeField({ label, value, onChange }: TimeFieldProps) {
  const [hour = '', minute = ''] = value.split(':');

  const update = (nextHour: string, nextMinute: string) =>
    onChange(nextHour ? `${nextHour}:${nextMinute || '00'}` : '');

  return (
    <fieldset className="field time-field">
      <legend className="field__label">{label}</legend>
      <div className="time-field__inputs">
        <select
          className="field__input"
          aria-label="Heures"
          value={hour}
          onChange={(event) => update(event.target.value, minute)}
        >
          <option value="">--</option>
          {HOURS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span aria-hidden="true">:</span>
        <select
          className="field__input"
          aria-label="Minutes"
          value={minute}
          disabled={!hour}
          onChange={(event) => update(hour, event.target.value)}
        >
          {!hour && <option value="">--</option>}
          {MINUTES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}
