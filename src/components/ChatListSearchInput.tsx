import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface ChatListSearchInputProps {
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
  initialValue?: string;
}

const ChatListSearchInput: React.FC<ChatListSearchInputProps> = ({
  onSearchChange,
  placeholder = "Search or start new chat",
  initialValue = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    console.log('ChatListSearchInput loaded');
  }, []);

  useEffect(() => {
    // If the initialValue prop changes, update the internal state
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    onSearchChange(newSearchTerm);
  };

  return (
    <div className="relative w-full p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          className="w-full pl-10 pr-3 py-2 h-9 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
          aria-label="Search chats"
        />
      </div>
    </div>
  );
};

export default ChatListSearchInput;