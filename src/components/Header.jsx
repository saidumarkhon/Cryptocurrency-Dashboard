import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useCoins } from "../context/coinsSlice";
import { CountriesDrawer } from "./ChosenCoins";
import { Bell, Menu, Search } from 'lucide-react';

export default function Header() {
  const { setCoins, setLoading, setError, setCurrency, currency } = useCoins();

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
        );
        if (!response.ok) throw new Error("Error fetching cryptocurrency data");
        const fetchedCoins = await response.json();
        setCoins(fetchedCoins);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, [currency, setCoins, setLoading, setError]);

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white lg:hidden">
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-white font-bold text-xl hidden md:block">CRYPTOFOLIO</span>
            </Link>
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/markets" className="text-gray-300 hover:text-white">Markets</Link>
              <Link to="/trade" className="text-gray-300 hover:text-white">Trade</Link>
            </nav>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search markets"
                className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="rub">RUB</option>
            </select>
            <button className="text-gray-400 hover:text-white">
              <Bell size={24} />
            </button>
            <CountriesDrawer />
          </div>
        </div>
      </div>
    </header>
  );
}