import { Button } from 'react-bootstrap';

export const ThemeToggleButton = ({ theme, toggleTheme }) => {
  return (
    <Button onClick={toggleTheme} variant={theme === 'dark' ? 'light' : 'dark'} className='theme-toggle'>
      {theme === 'dark' ? <i className='bi bi-sun-fill me-2'></i> : <i className='bi bi-moon-stars-fill me-2'></i>}
    </Button>
  );
};
