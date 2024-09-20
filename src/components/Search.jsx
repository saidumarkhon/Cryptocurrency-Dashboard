import React from 'react';
import { TextInput } from 'flowbite-react';
import { Search } from 'lucide-react';

const customTheme = {
  "root": {
    "base": "flex"
  },
  "field": {
    "base": "relative w-full",
    "input": {
      "base": "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
      "sizes": {
        "sm": "p-2 sm:text-xs",
        "md": "p-2.5 text-sm",
        "lg": "sm:text-md p-4"
      },
      "colors": {
        "gray": "bg-transparent border-gray-600 text-gray-400 focus:border-white focus:ring-gray-400 dark:border-gray-400 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-400 dark:focus:ring-gray-400"
      },
    },
    "icon": {
      "base": "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
      "svg": "h-5 w-5 text-gray-500 dark:text-gray-400"
    }
  }
};

const SearchComponent = ({ onSearch }) => {
  return (
    <div className="max-w-[1140px] mx-auto mb-4">
      <TextInput
        theme={customTheme}
        id="search"
        type="text"
        icon={Search}
        placeholder="Search For a Crypto Currency.."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full"
        sizing="lg"
      />
    </div>
  );
};

export default SearchComponent;