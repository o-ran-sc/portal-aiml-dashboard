import { NavDropdown } from 'react-bootstrap';
import { Container, Nav, Navbar } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './navigation-bar.css';
import { useDarkMode } from '../../hooks';
import { ThemeToggleButton } from '../button';

export const NavigationBar = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  return (
    <Navbar className='nav-bar custom-navbar' variant='dark'>
      <Container>
        <Navbar.Brand href='/'>AI/ML Management Dashboard</Navbar.Brand>
        <Nav>
          <NavDropdown title='Training Jobs' className='nav-drop-down'>
            <NavDropdown.Item href='/TrainingJob/CreateTrainingJob'>Create Training Job</NavDropdown.Item>
            <NavDropdown.Item href='/TrainingJob/TrainingJobsStatus'>Training Job Status</NavDropdown.Item>
            <NavDropdown.Item href='/TrainingJob/Pipeline'>Training function</NavDropdown.Item>
            <NavDropdown.Item href='/TrainingJob/CreateFeatureGroup'>Create Feature Group</NavDropdown.Item>
            <NavDropdown.Item href='/TrainingJob/ListFeatureGroups'>List Feature Group</NavDropdown.Item>
          </NavDropdown>
          <ThemeToggleButton isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </Nav>
      </Container>
    </Navbar>
  );
};
