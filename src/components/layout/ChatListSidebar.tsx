import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatListSearchInput from '@/components/ChatListSearchInput'; // Assuming this path is correct
import ChatListItem from '@/components/ChatListItem'; // Assuming this path is correct

// Placeholder data for ChatListItems
const placeholderChats = [
  {
    id: '1',
    avatarSrc: 'https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp',
    name: 'Alice Wonderland',
    lastMessage: "Hey, how's it going? Planning anything for the weekend?",
    timestamp: '10:30 AM',
    unreadCount: 2,
    isActive: false,
  },
  {
    id: '2',
    avatarSrc: 'https://cdn.iconscout.com/icon/free/png-256/free-avatar-372-456324.png',
    name: 'Bob The Builder',
    lastMessage: "Can we fix it? Yes, we can!",
    timestamp: 'Yesterday',
    unreadCount: 0,
    isActive: true, // Example of an active chat
  },
  {
    id: '3',
    avatarSrc: 'https://cdn.iconscout.com/icon/free/png-256/free-avatar-369-456321.png',
    name: 'Charlie Brown',
    lastMessage: "Good grief! Lost my kite again.",
    timestamp: 'Mon',
    unreadCount: 5,
    isActive: false,
  },
  {
    id: '4',
    name: 'Project Group Alpha',
    lastMessage: "Alice: Don't forget the deadline is tomorrow!",
    timestamp: '9:15 AM',
    unreadCount: 1,
    isGroup: true, // Assuming ChatListItem can handle group differentiation
    isActive: false,
  }
];

interface ChatListSidebarProps {
  // Props can be added here if needed, e.g., actual chat data, activeChatId
  onChatSelect?: (chatId: string) => void;
  activeChatId?: string | null;
}

const ChatListSidebar: React.FC<ChatListSidebarProps> = ({ onChatSelect, activeChatId }) => {
  console.log('ChatListSidebar loaded');

  const handleChatClick = (chatId: string) => {
    if (onChatSelect) {
      onChatSelect(chatId);
    }
    console.log(`Chat selected: ${chatId}`);
    // Navigation or state update logic would go here typically
  };

  return (
    <aside className="flex h-full w-full max-w-xs flex-col border-r bg-muted/40">
      <div className="p-3 border-b">
        <ChatListSearchInput 
          onSearchChange={(query) => console.log('Search query:', query)} 
          placeholder="Search or start new chat"
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">
          {placeholderChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              id={chat.id}
              avatarSrc={chat.avatarSrc}
              name={chat.name}
              lastMessage={chat.lastMessage}
              timestamp={chat.timestamp}
              unreadCount={chat.unreadCount}
              isActive={activeChatId === chat.id}
              isGroup={!!chat.isGroup}
              onClick={() => handleChatClick(chat.id)}
            />
          ))}
           {/* Example of an empty state or more items */}
           {placeholderChats.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No chats yet. Start a new conversation!
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default ChatListSidebar;