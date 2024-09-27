import { NavDropdown } from 'react-bootstrap';
import { Container, Nav, Navbar } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './navigation-bar.css';
import { useTheme } from '../../hooks';
import { ThemeToggleButton } from '../button';

export const NavigationBar = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <Navbar className='nav-bar custom-navbar' variant='dark'>
      <Container>
        <Navbar.Brand href='/'>AI/ML Management Dashboard</Navbar.Brand>
        <Nav>
          <NavDropdown title='Training Jobs' className='nav-drop-down'>
            <NavDropdown.Item href='/TrainingJob/TrainingJobsStatus'>Training Job</NavDropdown.Item>
            <NavDropdown.Item href='/TrainingJob/Pipeline'>Training Function</NavDropdown.Item>
            <NavDropdown.Item href='/TrainingJob/ListFeatureGroups'>Feature Group</NavDropdown.Item>
          </NavDropdown>
          <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        </Nav>
      </Container>
    </Navbar>
  );
};
