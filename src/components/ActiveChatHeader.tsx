import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Phone, Video, MoreVertical, User, Trash2, VolumeX, Volume2 } from 'lucide-react';

interface ActiveChatHeaderProps {
  chatName: string;
  avatarUrl?: string;
  avatarFallback: string;
  status: string; // e.g., "online", "last seen 2 hours ago", "typing...", "5 members"
  isGroup?: boolean;
  onSearchClick?: () => void;
  onVoiceCallClick?: () => void;
  onVideoCallClick?: () => void;
  onViewContactInfo?: () => void;
  onClearChat?: () => void;
  onMuteChat?: () => void;
  onUnmuteChat?: () => void;
  isMuted?: boolean;
}

const ActiveChatHeader: React.FC<ActiveChatHeaderProps> = ({
  chatName,
  avatarUrl,
  avatarFallback,
  status,
  isGroup = false,
  onSearchClick,
  onVoiceCallClick,
  onVideoCallClick,
  onViewContactInfo,
  onClearChat,
  onMuteChat,
  onUnmuteChat,
  isMuted = false,
}) => {
  console.log('ActiveChatHeader loaded for:', chatName);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-16">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} alt={chatName} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{chatName}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">{status}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {onSearchClick && (
          <Button variant="ghost" size="icon" onClick={onSearchClick} aria-label="Search in chat">
            <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Button>
        )}
        {onVoiceCallClick && (
          <Button variant="ghost" size="icon" onClick={onVoiceCallClick} aria-label="Start voice call">
            <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Button>
        )}
        {onVideoCallClick && (
          <Button variant="ghost" size="icon" onClick={onVideoCallClick} aria-label="Start video call">
            <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="More options">
              <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onViewContactInfo && (
              <DropdownMenuItem onClick={onViewContactInfo}>
                <User className="mr-2 h-4 w-4" />
                <span>{isGroup ? 'Group info' : 'Contact info'}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {isMuted ? (
                onUnmuteChat && (
                    <DropdownMenuItem onClick={onUnmuteChat}>
                        <Volume2 className="mr-2 h-4 w-4" />
                        <span>Unmute</span>
                    </DropdownMenuItem>
                )
            ) : (
                onMuteChat && (
                    <DropdownMenuItem onClick={onMuteChat}>
                        <VolumeX className="mr-2 h-4 w-4" />
                        <span>Mute</span>
                    </DropdownMenuItem>
                )
            )}
            {onClearChat && (
              <DropdownMenuItem onClick={onClearChat} className="text-red-600 hover:!text-red-600 focus:!text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Clear chat</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ActiveChatHeader;