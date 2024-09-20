import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CoinsProvider } from './context/coinsSlice.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CoinsProvider>
        <App />
    </CoinsProvider>
  </React.StrictMode>
);
