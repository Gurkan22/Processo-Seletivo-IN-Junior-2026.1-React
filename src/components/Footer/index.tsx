import './footer.css';
import facebookLogo from '../../assets/facebook.svg';
import instagramLogo from '../../assets/instagram.svg';
import xLogo from '../../assets/x.svg';

export function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-socials">
        <a href="#" target="_blank" rel="noopener noreferrer">
          <img src={facebookLogo} alt="Facebook" width={24} height={24} />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <img src={instagramLogo} alt="Instagram" width={24} height={24} />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <img src={xLogo} alt="X (Twitter)" width={24} height={24} />
        </a>
      </div>
    </footer>
  );
}