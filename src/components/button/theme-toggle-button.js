import { Button } from 'react-bootstrap';

export const ThemeToggleButton = ({ theme, toggleTheme }) => {
  return (
    <Button onClick={toggleTheme} style={{ backgroundColor: theme === 'dark' ? '#fff' : '#6282f6', color: theme === 'dark' ? '#000' : '#fff', border: 'none' }}>
      {theme === 'dark' ? <i className='bi bi-sun-fill' /> : <i className='bi bi-moon-stars-fill' />}
    </Button>
  );
};
