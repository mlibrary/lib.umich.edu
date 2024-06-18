import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => {
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
};

StateProvider.propTypes = {
  children: PropTypes.node,
  initialState: PropTypes.object,
  reducer: PropTypes.object
};

export const useStateValue = () => {
  return useContext(StateContext);
};
