import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import "./Navbar.css";
import { signout } from "../../auth/token";
import { isbuttonopen } from "../../features/isopen";
function Navbar() {
  const dispatch = useDispatch();
  const [displayMenu, SetDisplayMenu] = useState(false);
  const handleMenu = () => {
    if (displayMenu) {
      SetDisplayMenu(false);
    } else {
      SetDisplayMenu(true);
    }
    dispatch(isbuttonopen(displayMenu));
  };
  const NavbarBlock = () => {
    return (
      <div className="Navbar">
        <div className="Navbar__leftArea">
          <button className="Navbar__button">
            <MenuRoundedIcon
              className="Navbar__icon"
              style={{ fontSize: 30 }}
              onClick={handleMenu}
            />
          </button>
          <h2><span className="Navbar__logo">A</span>ce<span className="Navbar__logo">D</span>esk</h2>
        </div>
        <div className="Navbar__rightArea">
          <NavLink onClick={() => signout()} to="/" className="Navbar__link">
            <span className="Navbar__title">Logout</span>
            <PowerSettingsNewIcon className="Navbar__icon" />
          </NavLink>
        </div>
      </div>
    );
  };
  return <NavbarBlock />;
}

export default Navbar;
