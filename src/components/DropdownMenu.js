import React, { useEffect, useRef, useState } from "react";
import "../style/dropdownmenu.css"; // Import your CSS file for styling
import Spinner from "./Spinner";

const DropdownMenu = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSkip = () => {
    props.handleClick();
    setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button className="dropdown-button" onClick={toggleMenu}>
        Danger Zone
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button className="skip-button" onClick={handleSkip}>
            {props.skipping ? (
              <Spinner
                color="#fff"
                style={{ height: 12, width: 12, marginRight: 6 }}
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Z" />
              </svg>
            )}
            <span>Skip This Problem</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
