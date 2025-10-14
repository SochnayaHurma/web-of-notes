import React, { createContext, useContext } from 'react';

const CallbackContext = createContext(() => {});

export const useGlobalCallback = () => useContext(CallbackContext);

const CallbackProvider = ({ callback, children }) => {
  const memoizedCallback = React.useMemo(() => callback, [callback]);
  return (
    <CallbackContext.Provider setToast={memoizedCallback}>
      {children}
    </CallbackContext.Provider>
  );
};

export default CallbackProvider;