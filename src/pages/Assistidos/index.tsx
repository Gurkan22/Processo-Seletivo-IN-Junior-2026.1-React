import { MovieListPage } from '../MovieListPage';

export function Assistidos() {
  return (
    <MovieListPage
      title="Assistidos"
      endpoint="/account/watched"
      emptyMessage="Você ainda não marcou nenhum filme como assistido."
    />
  );
}
