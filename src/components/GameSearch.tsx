import { useEffect, useState } from 'react';
import { searchGames, type GameSuggestion } from '../lib/bgg';

interface GameSearchProps {
  onPick: (game: GameSuggestion) => void;
}

const MIN_TERM_LENGTH = 3;
const DEBOUNCE_MS = 400;

export function GameSearch({ onPick }: GameSearchProps) {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<GameSuggestion[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'failed'>('idle');

  useEffect(() => {
    const trimmed = term.trim();
    if (trimmed.length < MIN_TERM_LENGTH) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus('loading');
      try {
        setResults(await searchGames(trimmed, controller.signal));
        setStatus('idle');
      } catch {
        if (!controller.signal.aborted) setStatus('failed');
      }
    }, DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  const visible = term.trim().length >= MIN_TERM_LENGTH ? results : [];

  return (
    <div className="field">
      <label className="field__label" htmlFor="game-search">
        Chercher la couverture (BoardGameGeek)
      </label>
      <input
        id="game-search"
        className="field__input"
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Ex. Catan"
      />
      <p className="visually-hidden" role="status">
        {status === 'loading' ? 'Recherche en cours' : `${visible.length} résultats`}
      </p>
      {status === 'failed' && (
        <p className="error" role="alert">
          Recherche indisponible. Saisissez le nom du jeu à la main.
        </p>
      )}
      {visible.length > 0 && (
        <ul className="suggestions">
          {visible.map((game) => (
            <li key={game.id}>
              <button
                type="button"
                className="suggestion"
                onClick={() => {
                  onPick(game);
                  setTerm('');
                }}
              >
                {game.coverUrl ? (
                  <img src={game.coverUrl} alt="" width={40} height={40} loading="lazy" />
                ) : (
                  <span className="suggestion__placeholder" aria-hidden="true" />
                )}
                <span>
                  {game.name}
                  {game.year && ` (${game.year})`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
