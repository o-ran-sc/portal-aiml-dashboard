// ==================================================================================

//        Copyright (c) 2022 Samsung Electronics Co., Ltd. All Rights Reserved.

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//           http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

// ==================================================================================

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
          <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        </Nav>
      </Container>
    </Navbar>
  );
};
