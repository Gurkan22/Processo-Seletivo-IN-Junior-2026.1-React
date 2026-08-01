import { MovieListPage } from '../MovieListPage';

export function Favoritos() {
  return (
    <MovieListPage
      title="Favoritos"
      endpoint="/account/favorites"
      emptyMessage="Você ainda não favoritou nenhum filme."
    />
  );
}
