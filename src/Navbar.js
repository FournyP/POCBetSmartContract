import React from "react";
import propTypes from "prop-types";

function Navbar(props) {
  const { account } = props;

  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-light">
      &nbsp; POC Bet Smart Contract
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <small className="text-secondary">
            <small id="account">{account}</small>
          </small>
        </li>
      </ul>
    </nav>
  );
}

Navbar.propTypes = {
  account: propTypes.string.isRequired,
};

export default Navbar;
