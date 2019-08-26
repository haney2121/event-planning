import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

let cacheUser = localStorage.getItem('auth.user');

const initialState = JSON.parse(cacheUser) || {};

export const UserProvider = props => {
  const [user, setUser] = useState(initialState);

  const updateCache = () => {
    localStorage.setItem('auth.user', JSON.stringify(user));
  };

  useEffect(() => {
    updateCache();
    return () => {};
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};
