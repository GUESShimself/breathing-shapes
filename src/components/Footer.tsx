import React from 'react';
import packageJson from '../../package.json';
import '../styles/Footer.css';

interface FooterProps {
  isActive: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isActive }) => {
  const currentYear = new Date().getFullYear();
  const version = packageJson.version;

  return (
    <footer className={`app-footer ${isActive ? 'app-footer--hidden' : ''}`}>
      <div className="footer-line">
        <a
          href="https://github.com/eguess/breathing-shapes"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Breathing Shapes
        </a>{' '}
        (v{version})
      </div>
      <div className="footer-line">
        © {currentYear}{' '}
        <a
          href="https://guesshimself.work"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Eric Guess
        </a>
      </div>
    </footer>
  );
};
