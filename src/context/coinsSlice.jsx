import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  coins: [],
  loading: false,
  error: null,
  selectedCoins: JSON.parse(localStorage.getItem("selectedCoins")) || [],
  currency: 'usd', // Add default currency
};

// Action types
const SET_COINS = 'SET_COINS';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const SELECT_COIN = 'SELECT_COIN';
const UNSELECT_COIN = 'UNSELECT_COIN';
const SET_CURRENCY = 'SET_CURRENCY'; // New action type

// Reducer
const coinsReducer = (state, action) => {
  switch (action.type) {
    case SET_COINS:
      return { ...state, coins: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case SELECT_COIN:
      const updatedSelectedCoins = [...state.selectedCoins, action.payload];
      localStorage.setItem("selectedCoins", JSON.stringify(updatedSelectedCoins));
      return { ...state, selectedCoins: updatedSelectedCoins };
    case UNSELECT_COIN:
      const filteredSelectedCoins = state.selectedCoins.filter(
        (coin) => coin.id !== action.payload
      );
      localStorage.setItem("selectedCoins", JSON.stringify(filteredSelectedCoins));
      return { ...state, selectedCoins: filteredSelectedCoins };
    case SET_CURRENCY: // New case
      return { ...state, currency: action.payload };
    default:
      return state;
  }
};

// Create context
const CoinsContext = createContext();

// Context provider component
export const CoinsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(coinsReducer, initialState);

  // Action creators
  const setCoins = useCallback((coins) => 
    dispatch({ type: SET_COINS, payload: coins }), []);
  const setLoading = useCallback((isLoading) => 
    dispatch({ type: SET_LOADING, payload: isLoading }), []);
  const setError = useCallback((error) => 
    dispatch({ type: SET_ERROR, payload: error }), []);
  const selectCoin = useCallback((coin) => 
    dispatch({ type: SELECT_COIN, payload: coin }), []);
  const unselectCoin = useCallback((id) => 
    dispatch({ type: UNSELECT_COIN, payload: id }), []);
  const setCurrency = useCallback((currency) => 
    dispatch({ type: SET_CURRENCY, payload: currency }), []); 

  const value = {
    ...state,
    setCoins,
    setLoading,
    setError,
    selectCoin,
    unselectCoin,
    setCurrency, 
  };

  return (
    <CoinsContext.Provider value={value}>
      {children}
    </CoinsContext.Provider>
  );
};

// Custom hook to use the coins context
export const useCoins = () => {
  const context = useContext(CoinsContext);
  if (context === undefined) {
    throw new Error('useCoins must be used within a CoinsProvider');
  }
  return context;
};