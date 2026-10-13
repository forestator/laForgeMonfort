import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { takeKey, useKeyHolders } from '../lib/keyHolders';
import { usePlayer } from '../lib/player';
import { Modal } from './Modal';

interface SettingsProps {
  onClose: () => void;
}

const NAME_MAX_LENGTH = 40;

export function Settings({ onClose }: SettingsProps) {
  const { user } = useAuth();
  const notify = useToast();
  const { player, register } = usePlayer();
  const { holders } = useKeyHolders();
  const [typedName, setTypedName] = useState<string>();
  const name = typedName ?? player?.name ?? user?.displayName ?? '';

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    register(trimmed);
    try {
      // Keeps the name shown in the key holders list in sync.
      if (user && holders.some((holder) => holder.id === user.uid)) {
        await takeKey({ id: user.uid, name: trimmed });
      }
      notify('Paramètres enregistrés');
    } catch {
      notify('Nom enregistré, mais pas mis à jour dans la liste des clés.');
    }
    onClose();
  };

  return (
    <Modal titleId="settings-title" onClose={onClose}>
      <h2 id="settings-title" className="modal__title">
        Paramètres
      </h2>
      <form className="form" onSubmit={submit}>
        <label className="field">
          <span className="field__label">Votre nom</span>
          <input
            className="field__input"
            value={name}
            onChange={(event) => setTypedName(event.target.value)}
            maxLength={NAME_MAX_LENGTH}
            required
          />
        </label>
        <p className="modal__hint">
          Ce nom est utilisé pour vos inscriptions, vos tables et la liste des clés. Il est mémorisé
          sur cet appareil.
        </p>
        <button className="button button--primary" type="submit">
          Enregistrer
        </button>
      </form>
    </Modal>
  );
}
