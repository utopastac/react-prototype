import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './index.module.sass';

const MainNav: React.FC = () => {
  return (
    <nav className={styles.nav} aria-label="Main">
      <ul className={styles.list}>
        <li>
          <NavLink
            to="/platform"
            className={({ isActive }) => isActive ? styles.active : styles.link}
          >
            Platform
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/patterns"
            className={({ isActive }) => isActive ? styles.active : styles.link}
          >
            Patterns
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/flows"
            className={({ isActive }) => isActive ? styles.active : styles.link}
          >
            Flows
          </NavLink>
        </li>
        <li className={styles.right}
        >
          <a href="#/admin" className={styles.link}>Builder</a>
        </li>
      </ul>
    </nav>
  );
};

export default MainNav;


