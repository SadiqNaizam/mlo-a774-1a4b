import React, { useState, useEffect } from 'react';

// Custom Layout Components
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import ChatListSidebar from '@/components/layout/ChatListSidebar';

// Custom Chat Components
import ActiveChatHeader from '@/components/ActiveChatHeader';
import ChatMessageBubble from '@/components/ChatMessageBubble';
import MessageInputArea from '@/components/MessageInputArea';

// Shadcn/ui Components
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Helper function to get initials from a name
const getInitials = (name: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
};

// Interfaces for page state
interface Chat {
  id: string;
  name: string;
  avatarUrl?: string;
  status?: string;
  isMuted?: boolean;
  lastMessage?: string; // For consistency if needed by ChatListSidebar structure
  timestamp?: string;   // For consistency
  unreadCount?: number; // For consistency
}

type MessageMediaType = 'image' | 'video' | 'document' | 'audio';
type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

interface Message {
  id: string;
  chatId: string;
  content?: string;
  timestamp: string;
  isSent: boolean;
  status?: MessageStatus;
  senderName?: string;
  mediaUrl?: string;
  mediaType?: MessageMediaType;
  mediaFileName?: string;
}

// Sample data for Chats (IDs should align with ChatListSidebar's internal data if it calls onChatSelect)
const sampleChatsData: Chat[] = [
  { id: '1', name: 'Alice Wonderland', avatarUrl: 'https://i.pravatar.cc/150?u=alice', status: 'Online', isMuted: false, lastMessage: "Hey, how's it going?", timestamp: '10:30 AM', unreadCount: 2 },
  { id: '2', name: 'Bob The Builder', avatarUrl: 'https://i.pravatar.cc/150?u=bob', status: 'Last seen 2 hours ago', isMuted: true, lastMessage: "Can we fix it?", timestamp: 'Yesterday', unreadCount: 0 },
  { id: '3', name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?u=charlie', status: 'Typing...', isMuted: false, lastMessage: "Good grief!", timestamp: 'Mon', unreadCount: 5 },
  { id: '4', name: 'Project Group Alpha', status: '5 members', isMuted: false, lastMessage: "Meeting at 3PM", timestamp: '9:15 AM', unreadCount: 1 },
];

// Sample data for Messages
const allMessages: Message[] = [
  // Alice (chatId '1')
  { id: 'm1', chatId: '1', content: 'Hey, how are you?', timestamp: '10:30 AM', isSent: false },
  { id: 'm2', chatId: '1', content: 'I am good, thanks! You?', timestamp: '10:31 AM', isSent: true, status: 'read' },
  { id: 'm3', chatId: '1', content: 'Doing well. Check out this picture!', timestamp: '10:32 AM', isSent: false, mediaUrl: 'https://picsum.photos/seed/catpic/400/300', mediaType: 'image', mediaFileName: 'landscape.jpg' },
  { id: 'm4', chatId: '1', content: 'Wow, nice!', timestamp: '10:33 AM', isSent: true, status: 'delivered' },

  // Bob (chatId '2')
  { id: 'm5', chatId: '2', content: 'Can we fix it?', timestamp: 'Yesterday', isSent: false },
  { id: 'm6', chatId: '2', content: 'Yes, we can!', timestamp: 'Yesterday', isSent: true, status: 'read' },
  { id: 'm7', chatId: '2', content: 'Here is the project plan document.', timestamp: 'Yesterday', isSent: true, status: 'read', mediaUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', mediaType: 'document', mediaFileName: 'project_plan.pdf' },

  // Charlie (chatId '3')
  { id: 'm8', chatId: '3', content: 'Good grief! Lost my kite again.', timestamp: 'Mon', isSent: false },

  // Project Group Alpha (chatId '4')
  { id: 'm9', chatId: '4', content: 'Alice W.: Meeting at 3 PM.', timestamp: '9:00 AM', isSent: false, senderName: 'Alice W.' },
  { id: 'm10', chatId: '4', content: 'Bob B.: Roger that!', timestamp: '9:01 AM', isSent: false, senderName: 'Bob B.' },
  { id: 'm11', chatId: '4', content: 'Okay, I will be there.', timestamp: '9:02 AM', isSent: true, status: 'sent' },
  { id: 'm12', chatId: '4', content: 'Charlie B.: Also, I found this cool video about our project topic.', timestamp: '9:05 AM', isSent: false, senderName: 'Charlie B.', mediaUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', mediaType: 'video', mediaFileName: 'project_vid.mp4'},
];


const ChatInterfacePage = () => {
  console.log('ChatInterfacePage loaded');

  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    if (activeChat) {
      setDisplayedMessages(allMessages.filter(msg => msg.chatId === activeChat.id));
    } else {
      setDisplayedMessages([]);
    }
  }, [activeChat]);

  const handleSelectChat = (chatId: string) => {
    const selectedChatDetails = sampleChatsData.find(c => c.id === chatId);
    setActiveChat(selectedChatDetails || null);
    console.log(`ChatInterfacePage: Selected chat ${chatId}`);
  };

  const handleSendMessage = (messageContent: string, type: 'text' | 'media', file?: File) => {
    if (!activeChat) return;
    console.log(`ChatInterfacePage: Sending message to ${activeChat.id}: ${messageContent}`, type, file);
    setIsSendingMessage(true);

    // Simulate sending delay & add to messages
    setTimeout(() => {
      const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        chatId: activeChat.id,
        content: type === 'text' ? messageContent : (file ? messageContent : ''), // Caption for media, or text for text messages
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: true,
        status: 'sent',
      };

      if (type === 'media' && file) {
        newMessage.mediaUrl = URL.createObjectURL(file); // Temporary local URL for preview
        if (file.type.startsWith('image/')) newMessage.mediaType = 'image';
        else if (file.type.startsWith('video/')) newMessage.mediaType = 'video';
        else if (file.type.startsWith('audio/')) newMessage.mediaType = 'audio';
        else newMessage.mediaType = 'document'; // Fallback
        newMessage.mediaFileName = file.name;
      }
      
      // Optimistically add to displayed messages
      setDisplayedMessages(prevMessages => [...prevMessages, newMessage]);
      // Add to the "source of truth" for this demo
      allMessages.push(newMessage); 

      setIsSendingMessage(false);
    }, 1000);
  };

  const handleMediaClick = (url: string, mediaType: MessageMediaType) => {
    console.log(`ChatInterfacePage: Media clicked - URL: ${url}, Type: ${mediaType}`);
    // In a real app, you might open a modal/dialog for a larger preview or specific action
    window.open(url, '_blank'); // Simple new tab preview for now
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* ChatListSidebar */}
        <div className="flex-shrink-0 w-full max-w-xs border-r border-gray-200 dark:border-gray-700 bg-background">
          <ChatListSidebar
            activeChatId={activeChat?.id}
            onChatSelect={handleSelectChat}
            // ChatListSidebar uses its own internal placeholder chats
          />
        </div>

        {/* ActiveChatPanel */}
        <main className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-800/50">
          {activeChat ? (
            <>
              <ActiveChatHeader
                chatName={activeChat.name}
                avatarUrl={activeChat.avatarUrl}
                avatarFallback={getInitials(activeChat.name)}
                status={activeChat.status || "Online"}
                isGroup={activeChat.name.toLowerCase().includes("group")} // Simple check for group
                onSearchClick={() => alert("Search in chat clicked")}
                onVoiceCallClick={() => alert("Voice call clicked")}
                onVideoCallClick={() => alert("Video call clicked")}
                onViewContactInfo={() => alert("View contact info for " + activeChat.name)}
                onClearChat={() => {
                    setDisplayedMessages([]);
                    // Also remove from allMessages for this demo
                    const otherMessages = allMessages.filter(m => m.chatId !== activeChat.id);
                    allMessages.length = 0; // Clear array
                    allMessages.push(...otherMessages); // Repopulate
                    alert("Chat cleared for " + activeChat.name);
                }}
                isMuted={activeChat.isMuted}
                onMuteChat={() => {
                    setActiveChat(prev => prev ? {...prev, isMuted: true} : null);
                    alert("Mute chat: " + activeChat.name);
                }}
                onUnmuteChat={() => {
                    setActiveChat(prev => prev ? {...prev, isMuted: false} : null);
                    alert("Unmute chat: " + activeChat.name);
                }}
              />
              <ScrollArea className="flex-1 p-4 space-y-3 bg-transparent"> {/* Chat message area */}
                {displayedMessages.map((msg) => (
                  <ChatMessageBubble
                    key={msg.id}
                    id={msg.id}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    isSent={msg.isSent}
                    status={msg.status}
                    senderName={msg.senderName}
                    mediaUrl={msg.mediaUrl}
                    mediaType={msg.mediaType}
                    mediaFileName={msg.mediaFileName}
                    onMediaClick={handleMediaClick}
                  />
                ))}
                {displayedMessages.length === 0 && (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-sm text-muted-foreground">No messages yet in this chat.</p>
                  </div>
                )}
              </ScrollArea>
              <MessageInputArea
                onSendMessage={handleSendMessage}
                isSending={isSendingMessage}
                // typingIndicator={activeChat.status === 'Typing...' ? `${activeChat.name} is typing...` : null}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-100 dark:bg-gray-800/30">
              <img 
                src="https://www.gstatic.com/images/branding/product/1x/messages_ TrivialBits_2022_192dp.png" // Placeholder similar to WhatsApp Web's intro image
                alt="WhatsApp Web" 
                className="w-48 h-48 mb-6 opacity-80" 
              />
              <h2 className="text-2xl font-light text-gray-700 dark:text-gray-300 mb-2">WhatsApp Web Clone</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-1">
                Send and receive messages right from your computer.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Select a chat to start messaging.
              </p>
              <Separator className="my-8 w-1/2 max-w-xs bg-gray-300 dark:bg-gray-700" />
              <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                End-to-end encrypted (simulated)
              </p>
            </div>
          )}
        </main>
      </div>
      <AppFooter />
    </div>
  );
};

export default ChatInterfacePage;