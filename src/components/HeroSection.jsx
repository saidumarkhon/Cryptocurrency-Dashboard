import React, { useEffect, useState } from "react";
import { Carousel } from "flowbite-react";
import { useCoins } from "../context/coinsSlice";

const customCarouselTheme = {
  "root": {
    "leftControl": "hidden",
    "rightControl": "hidden"
  },
};

export default function HeroSection() {
  const { selectedCoins, currency, coins } = useCoins();
  const [updatedSelectedCoins, setUpdatedSelectedCoins] = useState([]);

  useEffect(() => {
    const fetchUpdatedCoins = async () => {
      const coinIds = selectedCoins.map(coin => coin.id).join(',');
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coinIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
        if (!response.ok) {
          throw new Error('Failed to fetch updated coin data');
        }
        const updatedCoins = await response.json();
        setUpdatedSelectedCoins(updatedCoins);
      } catch (error) {
        console.error('Error fetching updated coin data:', error);
      }
    };

    if (selectedCoins.length > 0) {
      fetchUpdatedCoins();
    }
  }, [selectedCoins, currency]);

  const groupedCoins = updatedSelectedCoins.reduce((acc, coin, index) => {
    const groupIndex = Math.floor(index / 4);
    if (!acc[groupIndex]) {
      acc[groupIndex] = [];
    }
    acc[groupIndex].push(coin);
    return acc;
  }, []);

  const getCurrencySymbol = (currency) => {
    switch(currency) {
      case 'usd': return '$';
      case 'eur': return '€';
      case 'rub': return '₽';
      default: return '';
    }
  };

  return (
    <div className="h-44 sm:h-64 xl:h-[260px] 2xl:h-96 hero">
      {updatedSelectedCoins.length > 0 ? (
        <Carousel indicators={false} theme={customCarouselTheme}>
          {groupedCoins.map((group, groupIndex) => (
            <div key={groupIndex} className="flex justify-center items-center h-full ">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-24 p-4">
                {group.map((coin) => (
                  <div key={coin.id} className="flex flex-col items-center ">
                    <img 
                      src={`${coin.image}`} 
                      alt={`Flag of ${coin.name}`} 
                      className="w-28 h-28 object-cover shadow"
                    />
                    <div className="flex items-center justify-center gap-2 ">
                    <p className=" text-white font-semibold text-sm uppercase">{coin.symbol}</p>
                    <p className={coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}>
                        {coin.price_change_percentage_24h > 0 ? `+${coin.price_change_percentage_24h.toFixed(2)}` : `${coin.price_change_percentage_24h.toFixed(2)}`}%
                    </p>
                    </div>
                    <p className="mt-2 text-white text-center font-bold text-sm">
                      {getCurrencySymbol(currency)}{coin.current_price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="flex justify-center items-center h-full bg-gray-100 hero">
        </div>
      )}
    </div>
  );
}