import React, { createContext, useState } from "react";

// Create a new context for reqCall
const ReqCallContext = createContext();

// Create a ReqCallProvider to wrap your components
const ReqCallProvider = ({ children }) => {
  const [reqCall, setReqCall] = useState(0);

  return (
    <ReqCallContext.Provider value={[reqCall, setReqCall]}>
      {children}
    </ReqCallContext.Provider>
  );
};
export { ReqCallContext, ReqCallProvider };
