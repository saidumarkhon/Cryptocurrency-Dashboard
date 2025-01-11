import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useCoins } from "../context/coinsSlice";
import SingleCoinSkeleton from '../components/SingleCoinSkeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
    const amplitude = 20;

    points.forEach((point, index) => {
      if (index === 0) {
        path += `M ${point.x},${point.y}`;
      } else {
        const prev = points[index - 1];
        const midX = (prev.x + point.x) / 2;

        if (timeframe === '24h') {
          const spikeY = point.y - amplitude;
          path += ` L ${midX - 10},${prev.y}`;
          path += ` Q ${midX - 5},${spikeY} ${midX},${point.y}`;
          path += ` Q ${midX + 5},${spikeY} ${midX + 10},${point.y}`;
        } else {
          const controlY = (prev.y + point.y) / 2 + (Math.random() - 0.5) * amplitude;
          path += ` Q ${midX},${controlY} ${point.x},${point.y}`;
        }
      }
    });

    return (
      <path
        ref={pathRef}
        d={path}
        stroke="#7dd3fc"
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
        <XAxis 
          dataKey="date" 
          stroke="#9CA3AF"
          fontSize={12}
          tickMargin={10}
        />
        <YAxis 
          stroke="#9CA3AF"
          tickFormatter={formatPrice}
          fontSize={12}
          tickMargin={10}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
            padding: '0.75rem'
          }}
          labelStyle={{ color: '#9CA3AF' }}
          itemStyle={{ color: '#7dd3fc' }}
          formatter={(value) => [formatPrice(value), "Price"]}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#7dd3fc"
          dot={false}
          activeDot={{ r: 4, fill: '#7dd3fc' }}
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
        const [coinData, priceData] = await Promise.all([
          fetch(`https://api.coingecko.com/api/v3/coins/${id}`).then(res => res.json()),
          fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=365`).then(res => res.json())
        ]);

        setCoin(coinData);

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

  if (loading) return <SingleCoinSkeleton />;
  if (error) return (
    <div className="flex items-center justify-center h-96 text-red-400">
      <p className="text-lg">Error: {error}</p>
    </div>
  );
  if (!coin) return (
    <div className="flex items-center justify-center h-96 text-gray-400">
      <p className="text-lg">No coin data found</p>
    </div>
  );

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'usd': return '$';
      case 'eur': return '€';
      case 'rub': return '₽';
      default: return '';
    }
  };

  const priceChange24h = coin.market_data.price_change_percentage_24h;
  const isPriceUp = priceChange24h >= 0;

  return (
    <div className="flex flex-col lg:flex-row p-4  rounded-xl">
      <div className="w-full lg:w-2/5 pr-4 text-white border-b-2 lg:border-r-2 lg:border-b-0 border-gray-700/30 px-5">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <img 
            src={coin.image?.small} 
            alt={`${coin.name} logo`} 
            className="w-24 h-24 m-auto rounded-full shadow-lg p-2 bg-gray-800"
          />
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-sky-400 to-sky-200 bg-clip-text text-transparent">
            {coin.name}
          </h1>
        </div>
        
        <div className="space-y-6 bg-gray-800/50 p-6 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Rank</span>
            <span className="font-semibold">#{coin.market_cap_rank}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Price</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {getCurrencySymbol(currency)}{coin.market_data.current_price[currency].toLocaleString()}
              </span>
              <span className={`flex items-center ${isPriceUp ? 'text-green-400' : 'text-red-400'}`}>
                {isPriceUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(priceChange24h).toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Market Cap</span>
            <span className="font-semibold">
              {getCurrencySymbol(currency)}{coin.market_data.market_cap[currency].toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-3/5 px-4 mt-8 lg:mt-0">
        <h2 className="text-xl text-sky-300 font-bold mb-6">
          Price Chart ({currency.toUpperCase()})
        </h2>
        
        <div className="bg-gray-800/30 rounded-xl p-4">
          {priceData[selectedTimeframe] && (
            <HeartbeatChart
              data={priceData[selectedTimeframe]}
              timeframe={selectedTimeframe}
              currency={currency}
            />
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
          {[
            { key: '24h', label: '24 Hours' },
            { key: '30d', label: '30 Days' },
            { key: '3m', label: '3 Months' },
            { key: '1y', label: '1 Year' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedTimeframe(key)}
              className={`px-8 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedTimeframe === key 
                  ? 'bg-sky-300 text-gray-900 shadow-lg shadow-sky-500/20' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}