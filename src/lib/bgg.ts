export interface GameSuggestion {
  id: string;
  name: string;
  year?: string;
  coverUrl?: string;
}

const API_URL = 'https://boardgamegeek.com/xmlapi2';
const MAX_RESULTS = 6;

// BoardGameGeek answers 401 without an application token, so the search stays off until one is set.
const token: string | undefined = import.meta.env.VITE_BGG_TOKEN;

export const isGameSearchEnabled = Boolean(token);

const fetchXml = async (path: string, signal: AbortSignal) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  if (!response.ok) throw new Error(`BGG ${response.status}`);
  return new DOMParser().parseFromString(await response.text(), 'text/xml');
};

const attribute = (parent: Element, selector: string) =>
  parent.querySelector(selector)?.getAttribute('value') ?? undefined;

export const parseSearchResults = (xml: Document) =>
  [...xml.querySelectorAll('item')].slice(0, MAX_RESULTS).map((item) => ({
    id: item.getAttribute('id') ?? '',
    name: attribute(item, 'name') ?? '',
    year: attribute(item, 'yearpublished'),
  }));

export const parseCovers = (xml: Document) =>
  new Map(
    [...xml.querySelectorAll('item')].map((item) => [
      item.getAttribute('id') ?? '',
      item.querySelector('thumbnail')?.textContent?.trim(),
    ]),
  );

export const searchGames = async (term: string, signal: AbortSignal) => {
  const found = parseSearchResults(
    await fetchXml(`/search?type=boardgame&query=${encodeURIComponent(term)}`, signal),
  );
  if (found.length === 0) return [];
  const covers = parseCovers(
    await fetchXml(`/thing?id=${found.map((game) => game.id).join(',')}`, signal),
  );
  return found.map((game): GameSuggestion => ({ ...game, coverUrl: covers.get(game.id) }));
};
