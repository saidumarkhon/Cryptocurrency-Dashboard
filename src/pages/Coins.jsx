import { useEffect, useState, useCallback } from "react";
import HeroSection from "../components/HeroSection";
import { CustomPagination } from "../components/Pagination"; 
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import SearchComponent from "../components/Search";
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
} from "flowbite-react";
import { useCoins } from "../context/coinsSlice";
import Subtitle from "../components/Subtitle";
import TableSkeleton from '../components/TableSkeletonRow';

const customTheme = {
  root: {
    base: "w-full text-left text-sm text-white dark:text-gray-400",
    shadow: "absolute bg-white dark:bg-gray-800 rounded-lg drop-shadow-md dark:drop-shadow-lg",
    wrapper: "relative",
  },
  body: {
    base: "group/body",
    cell: {
      base: "px-2 py-4 whitespace-nowrap sm:px-4 md:px-6", // Responsive padding
    },
  },
  head: {
    base: "group/head text-xs uppercase text-white dark:text-gray-400",
    cell: {
      base: "bg-sky-300 px-2 py-3 sm:px-4 md:px-6", // Responsive padding for head cells
    },
  },
  row: {
    base: "group/row",
    striped: "odd:bg-transparent even:bg-transparent",
  },
};

export default function Cryptocurrencies() {
  const { 
    coins, 
    loading, 
    selectedCoins, 
    setCoins, 
    setLoading, 
    setError, 
    selectCoin, 
    unselectCoin,
    currency 
  } = useCoins();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCoins = useCallback(async () => {
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
  }, [setCoins, setLoading, setError, currency]);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const handleSelectCoin = useCallback((coin, selected) => {
    if (selected) {
      unselectCoin(coin.id);
    } else {
      selectCoin({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        rank: coin.market_cap_rank,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        price_change_24h: coin.price_change_percentage_24h,
      });
    }
  }, [selectCoin, unselectCoin]);

  const isCoinSelected = useCallback((id) => {
    return selectedCoins.some((coin) => coin.id === id);
  }, [selectedCoins]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); 
  };

  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCoins = filteredCoins.slice(indexOfFirstItem, indexOfLastItem);
  
  const totalPages = Math.ceil(filteredCoins.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'usd':
        return '$';
      case 'rub':
        return '₽';
      case 'eur':
        return '€';
      default:
        return '';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8"> {/* Responsive padding for the container */}
      <HeroSection />
      <Subtitle subtitle='Cryptocurrency Prices by Market Cap'/>
      <SearchComponent onSearch={handleSearch} />
      
      {loading ? (
        <TableSkeleton rows={10} /> 
      ) : (
        <div className='max-w-full lg:max-w-[1140px] mx-auto mt-4'> 
          <Table striped theme={customTheme}>
            <TableHead className="text-gray-900 normal-case">
              <TableHeadCell>Coin</TableHeadCell>
              <TableHeadCell>Price</TableHeadCell>
              <TableHeadCell>24h Change</TableHeadCell>
              {/* Conditionally render Market Cap based on screen size */}
              <TableHeadCell className="hidden sm:table-cell">Market Cap</TableHeadCell>
            </TableHead>
            <TableBody className='divide-y'>
              {currentCoins.map((coin) => {
                const selected = isCoinSelected(coin.id);
                return (
                  <Table.Row
                    key={coin.id}
                    className='bg-white dark:border-gray-800 border-gray-700'
                  >
                    <Table.Cell className='whitespace-nowrap font-medium text-white dark:text-white flex items-center gap-2'>
                      <img
                        alt={`${coin.name} flag`}
                        src={coin.image}
                        className="w-[30px] h-[30px] mb-2 shadow-lg object-cover"
                      />
                      <div>
                        <Link to={`/coin/${coin.id}`} className="hover:underline uppercase">
                          {coin.symbol}
                        </Link>
                        <p className="font-medium normal-case text-gray-400">{coin.name}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-gray-400 mr-1">{getCurrencySymbol(currency)}</span>
                      {coin.current_price.toLocaleString()}
                    </Table.Cell>
                    <Table.Cell className="flex items-center h-full py-6 gap-2">
                      <Eye
                        size={24}
                        color={selected ? 'green' : 'white'}
                        onClick={() => handleSelectCoin(coin, selected)}
                        className="cursor-pointer transition-colors duration-200"
                      />
                      <p className={coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}>
                        {coin.price_change_percentage_24h > 0 ? `+${coin.price_change_percentage_24h.toFixed(2)}` : `${coin.price_change_percentage_24h.toFixed(2)}`}% 
                      </p>
                    </Table.Cell>
                    {/* Conditionally render Market Cap cell */}
                    <Table.Cell className="hidden sm:table-cell">
                      <span className="text-gray-400 mr-1">{getCurrencySymbol(currency)}</span>
                      {coin.market_cap.toLocaleString()}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </TableBody>
          </Table>
          <div className="mt-4">
            <CustomPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
