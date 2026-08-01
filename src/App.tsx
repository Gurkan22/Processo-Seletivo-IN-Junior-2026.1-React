import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './contexts/auth-context';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { Filme } from './pages/Filme';
import { Pesquisa } from './pages/Pesquisa';
import { Favoritos } from './pages/Favoritos';
import { Assistidos } from './pages/Assistidos';
import { MinhasReviews } from './pages/MinhasReviews';
import { Perfil } from './pages/Perfil';
import { Layout } from './components/Layout';

export default function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>

      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/cadastro" element={!isAuthenticated ? <Cadastro /> : <Navigate to="/" />} />

  
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/filme/:id" element={<Filme />} />
        <Route path="/pesquisa" element={<Pesquisa />} />
        <Route path="/usuario/:id" element={<Perfil />} />
        <Route path="/favoritos" element={isAuthenticated ? <Favoritos /> : <Navigate to="/login" />} />
        <Route path="/assistidos" element={isAuthenticated ? <Assistidos /> : <Navigate to="/login" />} />
        <Route path="/minhas-reviews" element={isAuthenticated ? <MinhasReviews /> : <Navigate to="/login" />} />
      </Route>
    </Routes>
  );
}
