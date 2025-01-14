import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Countries from "./pages/Coins";
import Header from "./components/Header";
import SingleCoin from "./pages/SingleCoin";
import Markets from "./pages/Markets";
import Trade from "./pages/Trade";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Countries />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/coin/:id" element={<SingleCoin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
