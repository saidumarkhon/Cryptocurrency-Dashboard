import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useCoins } from "../context/coinsSlice";

const HeartbeatChart = ({ data, timeframe, currency }) => {
  const [pathLength, setPathLength] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const pathRef = useRef(null);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [data]);

  const CustomizedLine = (props) => {
    const { points } = props;
    let path = "";
    const amplitude = 20; // Amplitude of the heartbeat spike

    points.forEach((point, index) => {
      if (index === 0) {
        path += `M ${point.x},${point.y}`;
      } else {
        const prev = points[index - 1];
        const midX = (prev.x + point.x) / 2;

        if (timeframe === '24h') {
          // Create more pronounced heartbeat effect for 24h view
          const spikeY = point.y - amplitude;
          path += ` L ${midX - 10},${prev.y}`;
          path += ` Q ${midX - 5},${spikeY} ${midX},${point.y}`;
          path += ` Q ${midX + 5},${spikeY} ${midX + 10},${point.y}`;
        } else {
          // Smoother curve for other timeframes
          const controlY = (prev.y + point.y) / 2 + (Math.random() - 0.5) * amplitude;
          path += ` Q ${midX},${controlY} ${point.x},${point.y}`;
        }
      }
    });

    return (
      <path
        ref={pathRef}
        d={path}
        stroke="#7dd3fc" // Tailwind's sky-300 color
        strokeWidth={2}
        fill="none"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength}
      >
        <animate
          attributeName="stroke-dashoffset"
          from={pathLength}
          to={0}
          dur="2s"
          key={animationKey}
        />
      </path>
    );
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'usd': return '$';
      case 'eur': return '€';
      case 'rub': return '₽';
      default: return '';
    }
  };

  const formatPrice = (value) => {
    return `${getCurrencySymbol(currency)}${value.toFixed(2)}`;
  };

  return (
    <ResponsiveContainer width="100%" height={300} className="p-5">
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" tickFormatter={formatPrice} />
        <Tooltip
          contentStyle={{ backgroundColor: '#F3F4F6', border: 'none' }}
          formatter={(value) => [formatPrice(value), "Price"]}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#7dd3fc"
          dot={false}
          activeDot={false}
          shape={<CustomizedLine />}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default function SingleCoin() {
  const { id } = useParams();
  const { currency } = useCoins();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceData, setPriceData] = useState({});
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch coin data
        const coinResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        if (!coinResponse.ok) {
          throw new Error('Failed to fetch coin data');
        }
        const coinData = await coinResponse.json();
        setCoin(coinData);

        // Fetch price data
        const priceResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=365`);
        if (!priceResponse.ok) {
          throw new Error('Failed to fetch price data');
        }
        const priceData = await priceResponse.json();

        // Process price data for different timeframes
        const processedData = {
          '24h': priceData.prices.slice(-24).map(([timestamp, price]) => ({
            date: new Date(timestamp).toLocaleTimeString(),
            price
          })),
          '30d': priceData.prices.slice(-30).map(([timestamp, price]) => ({
            date: new Date(timestamp).toLocaleDateString(),
            price
          })),
          '3m': priceData.prices.slice(-90).map(([timestamp, price]) => ({
            date: new Date(timestamp).toLocaleDateString(),
            price
          })),
          '1y': priceData.prices.map(([timestamp, price]) => ({
            date: new Date(timestamp).toLocaleDateString(),
            price
          }))
        };
        setPriceData(processedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, currency]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!coin) return <div>No coin data found</div>;

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'usd': return '$';
      case 'eur': return '€';
      case 'rub': return '₽';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-4">
      <div className="w-full lg:w-2/5 pr-4 text-white border-b-2 lg:border-r-2 lg:border-b-0 px-5">
        <img src={coin.image?.small} alt={`Image of ${coin.name}`} className="w-24 h-24 m-auto" />
        <h1 className="text-2xl font-bold text-center">{coin.name}</h1>
        <p><strong>Rank:</strong> {coin.market_cap_rank}</p>
        <p><strong>Current price:</strong> {getCurrencySymbol(currency)}{coin.market_data.current_price[currency]}</p>
        <p><strong>Market cap:</strong> {getCurrencySymbol(currency)}{coin.market_data.market_cap[currency].toLocaleString()}</p>
      </div>
      <div className="w-full lg:w-3/5 px-4 mt-4 lg:mt-0">
        <h2 className="text-xl text-sky-300 font-bold mb-4">Price (Past {selectedTimeframe}) ({currency.toUpperCase()})</h2>
        {priceData[selectedTimeframe] && (
          <HeartbeatChart
            data={priceData[selectedTimeframe]}
            timeframe={selectedTimeframe}
            currency={currency}
          />
        )}
        <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start font-bold">
          <button
            onClick={() => setSelectedTimeframe('24h')}
            className={`px-12 py-1 rounded ${selectedTimeframe === '24h' ? 'bg-sky-300 ' : 'bg-gray-200'}`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setSelectedTimeframe('30d')}
            className={`px-12 py-1 rounded ${selectedTimeframe === '30d' ? 'bg-sky-300' : 'bg-gray-200'}`}
          >
            30 Days
          </button>
          <button
            onClick={() => setSelectedTimeframe('3m')}
            className={`px-12 py-1 rounded ${selectedTimeframe === '3m' ? 'bg-sky-300 ' : 'bg-gray-200'}`}
          >
            3 Months
          </button>
          <button
            onClick={() => setSelectedTimeframe('1y')}
            className={`px-12 py-1 rounded ${selectedTimeframe === '1y' ? 'bg-sky-300 ' : 'bg-gray-200'}`}
          >
            1 Year
          </button>
        </div>
      </div>
    </div>
  );
}
