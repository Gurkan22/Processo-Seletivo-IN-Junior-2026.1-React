import { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../services/api';
import { MovieGrid } from '../../components/MovieGrid';
import { Pagination } from '../../components/Pagination';
import type { MovieLight, Paginated } from '../../types/api';
import './movielistpage.css';

interface MovieListPageProps {
  title: string;
  endpoint: '/account/favorites' | '/account/watched';
  emptyMessage: string;
}

export function MovieListPage({ title, endpoint, emptyMessage }: MovieListPageProps) {
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState<MovieLight[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (targetPage: number, targetSearch: string) => {
    setLoading(true);
    try {
      const res = await api.get<Paginated<MovieLight>>(endpoint, {
        params: { page: targetPage, perPage: 10, search: targetSearch || undefined },
      });
      setMovies(res.data.data);
      setLastPage(res.data.metadata.lastPage);
      setPage(res.data.metadata.currentPage);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load(1, search);
  }, [search]);

  const handleRemove = async (movieId: number) => {
    await api.delete(`${endpoint}/${movieId}`);
    const remaining = movies.filter((movie) => movie.id !== movieId);
    if (remaining.length === 0 && page > 1) {
      await load(page - 1, search);
    } else {
      setMovies(remaining);
    }
  };

  const removeIcon = endpoint === '/account/favorites' ? 'heart' : 'x';
  const removeLabel = endpoint === '/account/favorites' ? 'Desfavoritar' : 'Remover de assistidos';

  return (
    <div className="movie-list-page">
      <h1>{title}</h1>

      <div className="movie-list-search">
        <Search size={18} color="#585861" />
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="movie-list-loading">Carregando...</p>
      ) : (
        <>
          <MovieGrid
            movies={movies}
            emptyMessage={emptyMessage}
            onRemove={handleRemove}
            removeIcon={removeIcon}
            removeLabel={removeLabel}
          />
          <Pagination currentPage={page} lastPage={lastPage} onPageChange={(p) => load(p, search)} />
        </>
      )}
    </div>
  );
}
