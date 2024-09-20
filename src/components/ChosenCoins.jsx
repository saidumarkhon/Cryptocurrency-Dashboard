"use client";
import React from "react";
import { Button, Drawer, Card } from "flowbite-react";
import { useState } from "react";
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useCoins } from "../context/coinsSlice";

const customTheme = {
  "color": {
    "sky": "border border-transparent bg-sky-300 uppercase focus:ring-4 focus:ring-sky-400 enabled:hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-600 dark:focus:ring-sky-600"
  }
}

export function CountriesDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedCoins, unselectCoin } = useCoins();

  const handleClose = () => setIsOpen(false);

  const handleUnselect = (id) => {
    unselectCoin(id);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <Button 
          theme={customTheme}
          onClick={() => setIsOpen(true)} 
          color={'sky'}
        >
          Watchlist
        </Button>
      </div>
      
      <Drawer 
        open={isOpen} 
        onClose={handleClose} 
        position="right" 
        className="w-full sm:w-[450px] bg-[#515151]"
      >
        <Drawer.Header title="Coins" />
        <Drawer.Items>
          {selectedCoins.length === 0 ? (
            <p className="text-gray-500 text-center">No coins selected</p>
          ) : (
            <div>
              <div className="flex items-center justify-center text-white text-2xl sm:text-3xl mb-4 sm:mb-6 uppercase">
                <h1>Watchlist</h1>
              </div>

              {/* Responsive grid for coins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-8">
                {selectedCoins.map((coin) => (
                  <Card key={coin.symbol} className="bg-[#15171B] border-none">
                    <div className="flex flex-col items-center text-white">
                      <img
                        alt={`${coin.name} logo`}
                        src={coin.image}
                        className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] mb-2 shadow-lg object-cover"
                      />
                      <p className="text-xs sm:text-sm font-bold uppercase">{coin.symbol}</p>
                      <p className="text-xs sm:text-sm font-bold uppercase">{coin.current_price}</p>
                      <div className="mt-2">
                        <Button 
                          gradientMonochrome="failure"
                          onClick={() => handleUnselect(coin.id)}
                          variant="destructive" 
                          size={'xs'}
                          className="flex items-center text-xs"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Drawer.Items>
      </Drawer>
    </>
  );
}
