import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, X } from 'lucide-react';
import { api } from '../../services/api';
import { MovieGrid } from '../../components/MovieGrid';
import { Pagination } from '../../components/Pagination';
import type { Genre, MovieLight, Paginated } from '../../types/api';
import './pesquisa.css';

export function Pesquisa() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [showGenrePicker, setShowGenrePicker] = useState(false);

  const [movies, setMovies] = useState<MovieLight[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/genres').then((res) => setAllGenres(res.data.data));
  }, []);

  const runSearch = useCallback(async (targetPage: number, targetQuery: string, targetGenreIds: number[]) => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page: targetPage, perPage: 10 };
      if (targetQuery.trim()) params.q = targetQuery.trim();
      if (targetGenreIds.length > 0) params['genreIds[]'] = targetGenreIds;

      const res = await api.get<Paginated<MovieLight>>('/movies', { params });
      setMovies(res.data.data);
      setLastPage(res.data.metadata.lastPage);
      setPage(res.data.metadata.currentPage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchParams(query ? { q: query } : {});
      runSearch(1, query, selectedGenreIds);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);


  useEffect(() => {
    runSearch(1, query, selectedGenreIds);
  }, [selectedGenreIds, runSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    runSearch(1, query, selectedGenreIds);
  };

  const addGenre = (genreId: number) => {
    if (!selectedGenreIds.includes(genreId)) {
      setSelectedGenreIds([...selectedGenreIds, genreId]);
    }
    setShowGenrePicker(false);
  };

  const removeGenre = (genreId: number) => {
    setSelectedGenreIds(selectedGenreIds.filter((id) => id !== genreId));
  };

  const clearGenres = () => {
    setSelectedGenreIds([]);
  };

  const availableGenres = allGenres.filter((g) => !selectedGenreIds.includes(g.id));

  return (
    <div className="pesquisa-container">
      <form className="pesquisa-input-wrapper" onSubmit={handleSubmit}>
        <Search size={20} color="#585861" />
        <input
          type="text"
          placeholder="Pesquisar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <div className="pesquisa-filters">
        {selectedGenreIds.map((id) => {
          const genre = allGenres.find((g) => g.id === id);
          if (!genre) return null;
          return (
            <span key={id} className="pesquisa-filter-chip">
              {genre.name}
              <button onClick={() => removeGenre(id)} aria-label={`Remover filtro ${genre.name}`}>
                <X size={14} />
              </button>
            </span>
          );
        })}

        <div className="pesquisa-add-filter-wrapper">
          <button className="pesquisa-add-filter-btn" onClick={() => setShowGenrePicker(!showGenrePicker)}>
            <Plus size={16} /> Adicionar Filtro
          </button>

          {showGenrePicker && (
            <div className="pesquisa-genre-picker">
              {availableGenres.length === 0 && <span className="pesquisa-genre-empty">Sem mais filtros</span>}
              {availableGenres.map((genre) => (
                <button key={genre.id} onClick={() => addGenre(genre.id)}>
                  {genre.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedGenreIds.length > 0 && (
          <button className="pesquisa-clear-filters-btn" onClick={clearGenres}>
            <X size={16} /> Remover Filtros
          </button>
        )}
      </div>

      {loading ? (
        <p className="pesquisa-loading">Buscando...</p>
      ) : (
        <>
          <MovieGrid movies={movies} emptyMessage="Nenhum filme encontrado para esses filtros." />
          <Pagination currentPage={page} lastPage={lastPage} onPageChange={(p) => runSearch(p, query, selectedGenreIds)} />
        </>
      )}
    </div>
  );
}
