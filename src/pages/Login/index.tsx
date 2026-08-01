import { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../contexts/auth-context';
import '../auth.css';

export function Login() {
  const { login } = useContext(AuthContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      const error = err as { response?: { status?: number; data?: { errors?: Array<{ field?: string; message: string }> } } };
      const apiErrors = error.response?.data?.errors;
      if (apiErrors && Array.isArray(apiErrors)) {
        if (error.response?.status === 400) {
          setErrors({ general: apiErrors[0]?.message || 'Credenciais inválidas.' });
        } else {
          const fieldErrors: { [key: string]: string } = {};
          for (const err of apiErrors) {
            if (err.field) fieldErrors[err.field] = err.message;
          }
          setErrors(fieldErrors);
        }
      } else {
        setErrors({ general: 'Erro ao fazer login. Tente novamente mais tarde.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="auth-logo">Film{'{IN}'}hos</Link>
      
      <div className="auth-card">
        <h1>Login</h1>
        <p className="auth-subtitle">
          Não possui uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>

        {errors.general && <p className="error-message">{errors.general}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper">
              <input 
                ref={emailInputRef}
                type="email" 
                placeholder="email@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label>Senha</label>
            <div className="input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="*******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="input-icon" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="auth-actions">
            <label>
              <input type="checkbox" /> Mantenha-me conectado
            </label>
            <a href="#">Esqueceu a senha?</a>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Entrando...' : 'Log In'}</button>
        </form>
      </div>
    </div>
  );
}