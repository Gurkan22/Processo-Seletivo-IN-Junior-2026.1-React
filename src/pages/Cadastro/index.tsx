import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../contexts/auth-context';
import '../auth.css';

export function Cadastro() {
  const { signup } = useContext(AuthContext);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (fullName.trim().length === 0) {
      setErrors({ fullName: 'Informe seu nome completo.' });
      return;
    }

    setLoading(true);

    try {
      await signup({ fullName: fullName.trim(), email, password, passwordConfirmation });
    } catch (err) {
      const error = err as { response?: { status?: number; data?: { errors?: Array<{ field: string; message: string }> } } };
      if (error.response?.status === 422 && error.response.data?.errors) {
        const fieldErrors: { [key: string]: string } = {};
        for (const apiErr of error.response.data.errors) {
          fieldErrors[apiErr.field] = apiErr.message;
        }
        setErrors(fieldErrors);
      } else {
        setErrors({ general: 'Erro ao realizar o cadastro. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="auth-logo">Film{'{IN}'}hos</Link>

      <div className="auth-card">
        <h1>Cadastro</h1>
        <p className="auth-subtitle">
          Já possui uma conta? <Link to="/login">Login</Link>
        </p>

        {errors.general && <p className="error-message">{errors.general}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nome completo</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Pedro Lucas"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper">
              <input
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

          <div className="input-group">
            <label>Confirme a senha</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="*******"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>
            {errors.passwordConfirmation && <span className="error-message">{errors.passwordConfirmation}</span>}
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Enviando...' : 'Cadastre-se'}
          </button>
        </form>
      </div>
    </div>
  );
}