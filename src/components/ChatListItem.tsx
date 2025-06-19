import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import clsx from 'clsx';

interface ChatListItemProps {
  id: string;
  avatarUrl?: string;
  name: string;
  lastMessageSnippet: string;
  lastMessageTimestamp: string; // e.g., "10:30 AM" or "Yesterday"
  unreadCount?: number;
  isActive?: boolean;
  onClick: (id: string) => void;
}

const getInitials = (name: string): string => {
  if (!name) return '?'; // Return a placeholder if name is empty
  const parts = name.trim().split(/\s+/).filter(Boolean); // Split by whitespace, remove empty parts

  if (parts.length === 0) return '?'; // If only whitespace, return placeholder
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  // For multiple words, take the first letter of the first and last significant word
  return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
};

const ChatListItem: React.FC<ChatListItemProps> = ({
  id,
  avatarUrl,
  name,
  lastMessageSnippet,
  lastMessageTimestamp,
  unreadCount = 0,
  isActive = false,
  onClick,
}) => {
  console.log(`ChatListItem loaded for chat ID: ${id}, Name: ${name}`);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open chat with ${name}`}
      onClick={() => onClick(id)}
      onKeyDown={(e) => { 
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Prevent scrolling on spacebar
          onClick(id);
        }
      }}
      className={clsx(
        "flex items-stretch p-3 space-x-3 cursor-pointer transition-colors duration-150 ease-in-out w-full",
        "border-b border-gray-200 dark:border-gray-700",
        isActive 
          ? "bg-blue-100 dark:bg-blue-900/50" // Distinct active state background
          : "hover:bg-gray-100 dark:hover:bg-gray-800",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-900"
      )}
    >
      <div className="flex-shrink-0 flex items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={`${name}'s avatar`} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 min-w-0 py-1"> {/* min-w-0 for truncation, py-1 for vertical centering if text is short */}
        <div className="flex justify-between items-center mb-0.5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {name}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
            {lastMessageTimestamp}
          </span>
        </div>
        <div className="flex justify-between items-start">
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate pr-2">
            {lastMessageSnippet}
          </p>
          {unreadCount > 0 && (
            <Badge 
              variant="default" // 'default' is typically primary color (e.g., blue)
              className="flex-shrink-0 h-5 min-w-[20px] px-1.5 flex items-center justify-center text-xs rounded-full"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;