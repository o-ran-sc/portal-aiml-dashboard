import { Button } from 'react-bootstrap';

export const ThemeToggleButton = ({ theme, toggleTheme }) => {
  return (
    <Button onClick={toggleTheme} variant={theme === 'dark' ? 'dark' : 'primary'}>
      {theme === 'dark' ? <i className='bi bi-sun-fill' /> : <i className='bi bi-moon-stars-fill' />}
    </Button>
  );
};
