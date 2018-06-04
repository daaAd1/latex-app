import React from 'react';
import { NavLink } from 'react-router-dom';
import * as routes from './constants/routes';

export const Home = () => {
  return (
    <div className="background-container">
      <div className="home-container">
        <p className="home-header">Convert advanced structures to LaTeX easily</p>
        <p className="home-text">
          Creating tables, sequent proofs and Taylor diagrams in LaTeX editor is not simple. This
          tool will help you create this strucutres swiftly.
        </p>
        <div className="home-buttons">
          <NavLink to={routes.SIGN_UP}>
            <button className="home-main-button"> Sign up</button>
          </NavLink>
          <NavLink to={routes.TABLE}>
            <button className="home-secondary-button">Start working immediately</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Home;
