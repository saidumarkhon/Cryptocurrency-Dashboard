import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Countries from "./pages/Coins";
import Header from "./components/Header";
import { useState } from "react";
import SingleCoin from "./pages/SingleCoin";
import Markets from "./pages/Markets";
import Trade from "./pages/Trade";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Router>
        <Header setIsOpen={setIsOpen} />
        <Routes>
          <Route
            path='/'
            element={<Countries isOpen={isOpen} setIsOpen={setIsOpen} />}
          />
          <Route path='/markets' element={<Markets />} />
          <Route path='/trade' element={<Trade />} />
          <Route path='/coin/:id' element={<SingleCoin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
