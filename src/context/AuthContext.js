import React, { useState, useEffect } from "react";

const AuthContext = React.createContext([{}, () => {}]);

// Load initial state from localStorage
let initialState = JSON.parse(localStorage.getItem("authState")) || {};

const AuthProvider = (props) => {
  const [state, setState] = useState(initialState);

  // Update localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify(state));
  }, [state]);

  return (
    <AuthContext.Provider value={[state, setState]}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
