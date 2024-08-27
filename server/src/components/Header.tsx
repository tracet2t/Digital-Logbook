import React from 'react';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>T2T Digital Logbook</div>
      <div className={styles.userInfo}>
        <img src="/path/to/avatar.jpg" alt="User Avatar" className={styles.avatar} />
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            User
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/profile">Profile</Dropdown.Item>
            <Dropdown.Item href="#/logout">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
