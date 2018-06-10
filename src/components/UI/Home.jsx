import React from 'react';
import { NavLink } from 'react-router-dom';
import * as routes from '../../constants/routes';

export const Home = (isSignedIn) => {
  const userSignedIn = isSignedIn.isSignedIn;

  if (userSignedIn === undefined) {
    return (
      <div>
        <div className="spinner">
          <div className="dot1" />
          <div className="dot2" />
        </div>
        <p className="loading-screen-text">Loading...</p>
      </div>
    );
  }
  return (
    <div className="background-container">
      {userSignedIn ? (
        <div className="home-container">
          <p className="home-header">Welcome back</p>
          <p className="home-text">Continue working or open one of your saved project</p>
          <div className="home-buttons">
            <NavLink to={routes.TABLE}>
              <button className="home-continue-button"> Continue working </button>
            </NavLink>
            <NavLink to={routes.SAVED_WORKS}>
              <button className="home-secondary-button">See saved projects</button>
            </NavLink>
          </div>
        </div>
      ) : (
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
              <button className="home-secondary-button">Start working without signing</button>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
