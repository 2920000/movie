import React, { useEffect, useRef, useState } from "react";
import { nav } from "../header/navName";
import { NavItem } from "../header/HeaderNav";
import { HiChevronDown } from "react-icons/hi";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import ReactDOM from "react-dom";
import LoginMoal from "../header/LoginModal";
import Button from "../button/Button";
import "./nav-sidebar.scss";
function NavSide(props) {
  const {
    translateSidebarHeader,
    setTranslateSidebarHeader,
    overlay,
    setOverlay,
    opacityOverlay,
    setOpacityOverlay,
  } = props;

  const boxLogoutStyle = {
    transform: "translateY(10px)",
    opacity: "1",
    position: "relative",
    zIndex: "1",
  };

  const initialBoxLogoutStyle = {
    transform: "translateY(-10px)",
    opacity: "0",
    position: "absolute",
    zIndex: "-10",
  };
  
  const refSidebarHeader = useRef();
  const boxLogoutRef = useRef();
  const auth = getAuth();
  const [loginModal, setLoginModal] = useState(false);
  const [user, setUser] = useState({});
  const [loadAvatar, setLoadAvatar] = useState(false);
  const [signOutBox, setSignOutBox] = useState(false);
  const [boxLogout, setBoxLogout] = useState(false);
  const styleSidebar = {
    transform: `translateX(${translateSidebarHeader})`,
  };
  const styleOverlay = {
    opacity: opacityOverlay,
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoadAvatar(true);
      setLoginModal(false);
      setSignOutBox(false);
    });
    return () => {
      setSignOutBox(false);
    };
  }, []);
  const overlayRef = useRef();
  useEffect(() => {
    const mousedown = (e) => {
      if (e.target === overlayRef.current) {
        document.body.style.overflowY = "auto";
        document.body.style.marginRight = "0";
        setOverlay(false);
        setTranslateSidebarHeader("-250px");
        setOpacityOverlay("0");
      }
    };
    const mousedownEvent = window.addEventListener("mousedown", mousedown);
    return () => {
      window.removeEventListener("mousedown", mousedownEvent);
    };
  });
  const handLeOffNav = () => {
    setOverlay(false);
    setTranslateSidebarHeader("-250px");
    setOpacityOverlay("0");
  };
  const handleShowLoginModal = () => {
    setLoginModal(true);
  };
  const handleShowLogoutBox = () => {
    setBoxLogout(!boxLogout);
  };
  const handleLogout = () => {
    signOut(auth);
  };

  return ReactDOM.createPortal(
    <>
      {overlay && (
        <div ref={overlayRef} style={styleOverlay} className="overlay"></div>
      )}
      <div style={styleSidebar} className="header-sidebar-mobile">
        <div ref={refSidebarHeader} className="header-sidebar-link">
          {user ? (
            <div>
              {loadAvatar ? (
                <div className="logged-user">
                  <div onClick={handleShowLogoutBox} className="user-infor">
                    {" "}
                    <img className="user-avatar" src={user.photoURL} alt="" />
                    <span>{user.displayName}</span>
                    <HiChevronDown />
                  </div>
                  <div
                    onClick={handleLogout}
                    ref={boxLogoutRef}
                    style={boxLogout ? boxLogoutStyle : initialBoxLogoutStyle}
                    className="sidebar-sign-out"
                  >
                    <span>Log out</span>
                  </div>
                </div>
              ) : (
                <div className="skeleton-avatar"></div>
              )}
            </div>
          ) : (
            <Button onClick={handleShowLoginModal} className="mobile">
              Đăng nhập
            </Button>
          )}
          <LoginMoal loginModal={loginModal} setLoginModal={setLoginModal} />
          {nav.map((e, i) => (
            <NavItem
              key={i}
              index={i}
              e={e}
              type="sidebar"
              onClick={handLeOffNav}
            />
          ))}
        </div>
        <LoginMoal loginModal={loginModal} setLoginModal={setLoginModal} />
      </div>
    </>,
    document.getElementById("sidebar")
  );
}

export default NavSide;
