import { Button } from 'react-bootstrap';

export const ThemeToggleButton = ({ isDarkMode, toggleDarkMode }) => (
  <Button onClick={toggleDarkMode} variant={isDarkMode ? 'dark' : 'primary'}>
    {isDarkMode ? <i className='bi bi-sun-fill'></i> : <i className='bi bi-moon-stars-fill'></i>}
  </Button>
);
