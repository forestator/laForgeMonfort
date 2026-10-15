import { useState, type FormEvent } from 'react';

interface JoinFormProps {
  tableId: string;
  defaultName: string;
  submitLabel: string;
  onJoin: (name: string) => void;
}

export function JoinForm({ tableId, defaultName, submitLabel, onJoin }: JoinFormProps) {
  // Undefined until the user types, so late-arriving defaults (login) still show up.
  const [typedName, setTypedName] = useState<string>();
  const name = typedName ?? defaultName;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onJoin(trimmed);
  };

  return (
    <form className="inline-form" onSubmit={submit}>
      <label className="visually-hidden" htmlFor={`name-${tableId}`}>
        Votre nom
      </label>
      <input
        id={`name-${tableId}`}
        className="field__input"
        placeholder="Votre nom"
        value={name}
        onChange={(event) => setTypedName(event.target.value)}
        maxLength={40}
        required
      />
      <button className="button button--primary" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
