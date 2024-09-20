import React, { useEffect } from 'react';
import { CountriesDrawer } from "./ChosenCoins";
import { Link } from "react-router-dom";
import { useCoins } from "../context/coinsSlice";

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
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`);

        if (!response.ok) {
          throw new Error("Error fetching cryptocurrency data");
        }
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
    <div className="flex justify-around items-center mx-auto p-2 px-4">
      <Link
        to="/"
        className="text-lg font-medium text-sky-300 hover:text-sky-600 transition duration-300"
      >
        CRYPTOFOLIO      
      </Link>
      
      <div className="header-wrap flex justify-center items-center gap-4">
        <select
          value={currency}
          onChange={handleCurrencyChange}
          className="border-none rounded-md text-sky-300 transition duration-300 bg-transparent"
        >
          <option value="usd">USD</option>
          <option value="rub">RUB</option>
          <option value="eur">EUR</option>
        </select>
        <CountriesDrawer />
      </div>
    </div>
  );
}