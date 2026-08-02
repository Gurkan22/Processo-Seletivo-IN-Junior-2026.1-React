import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Heart, Eye, Star, LogOut } from 'lucide-react';
import { AuthContext } from '../../contexts/auth-context';
import './header.css';
import Logo from '../../assets/logo.png';

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery('');
  }, [location.pathname]);

  useEffect(() => {
    if (!isDropdownOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/pesquisa?q=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleUserButtonClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header-container">
      <Link to="/" className="header-logo" style={{ textDecoration: 'none' }}>
        <img src={Logo} alt="Logo do Site" />
      </Link>

      <form className="header-search" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Pesquisar..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#585861' }}>
          <Search size={20} />
        </button>
      </form>

      <button
        type="button"
        className="header-search-icon-btn"
        onClick={() => navigate('/pesquisa')}
        aria-label="Pesquisar"
      >
        <Search size={22} />
      </button>

      <div className="header-user" ref={userMenuRef}>
        <button className="user-button" onClick={handleUserButtonClick}>
          <User size={28} />
        </button>

        {isAuthenticated && isDropdownOpen && (
          <div className="user-dropdown">
            {user && (
              <Link to={`/usuario/${user.id}`} className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                <User size={18} /> Meu Perfil
              </Link>
            )}
            <Link to="/favoritos" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
              <Heart size={18} /> Favoritos
            </Link>
            <Link to="/assistidos" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
              <Eye size={18} /> Assistidos
            </Link>
            <Link to="/minhas-reviews" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
              <Star size={18} /> Avaliações
            </Link>
            <button className="dropdown-item logout" onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
              <LogOut size={18} /> Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}