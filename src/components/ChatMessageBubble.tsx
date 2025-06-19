import React from 'react';
import clsx from 'clsx';
import { Clock, Check, CheckCheck } from 'lucide-react';
import MediaPreviewItem from '@/components/MediaPreviewItem'; // Assuming this path and its props

// Props for the ChatMessageBubble component
interface ChatMessageBubbleProps {
  id: string; // Unique ID for the message, useful for list keys
  content?: string; // Text content of the message or caption for media
  timestamp: string; // Formatted timestamp string, e.g., "10:30 AM"
  isSent: boolean; // True if the message was sent by the current user, false if received
  status?: 'sending' | 'sent' | 'delivered' | 'read'; // Message status, only relevant if isSent is true
  senderName?: string; // Optional: For group chats, display name of sender if message is received
  mediaUrl?: string; // Optional: URL for media content
  mediaType?: 'image' | 'video' | 'document' | 'audio'; // Optional: Type of media
  mediaFileName?: string; // Optional: File name for 'document' or 'audio' media types
  onMediaClick?: (url: string, type: 'image' | 'video' | 'document' | 'audio') => void; // Optional: Callback for when media is clicked
}

// Internal component for rendering status icons
const MessageStatusIcon: React.FC<{ status: ChatMessageBubbleProps['status'] }> = ({ status }) => {
  if (!status) return null;

  const iconProps = { size: 16, className: "ml-0.5" }; // Common props for icons

  switch (status) {
    case 'sending':
      return <Clock {...iconProps} className={clsx(iconProps.className, "text-gray-400 dark:text-gray-500")} />;
    case 'sent':
      return <Check {...iconProps} className={clsx(iconProps.className, "text-gray-400 dark:text-gray-500")} />;
    case 'delivered':
      return <CheckCheck {...iconProps} className={clsx(iconProps.className, "text-gray-400 dark:text-gray-500")} />;
    case 'read':
      return <CheckCheck {...iconProps} className={clsx(iconProps.className, "text-sky-500 dark:text-sky-400")} />; // Blue ticks for 'read'
    default:
      return null;
  }
};

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  id,
  content,
  timestamp,
  isSent,
  status,
  senderName,
  mediaUrl,
  mediaType,
  mediaFileName,
  onMediaClick,
}) => {
  console.log(`ChatMessageBubble loaded for message ID: ${id}, content: "${content ? content.substring(0,20) : 'MEDIA'}"`);

  const bubbleContainerClasses = clsx(
    'flex mb-2',
    isSent ? 'justify-end' : 'justify-start'
  );

  const bubbleClasses = clsx(
    'p-2 px-3 rounded-lg shadow-sm max-w-[75%] sm:max-w-[70%] md:max-w-[60%]', // Responsive max width
    isSent
      ? 'bg-green-100 dark:bg-green-700 text-gray-800 dark:text-gray-50'
      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-50'
  );

  const handleMediaItemClick = () => {
    if (mediaUrl && mediaType && onMediaClick) {
      onMediaClick(mediaUrl, mediaType);
    }
  };

  // Ensure content and mediaUrl are not both undefined/empty, otherwise render nothing or a placeholder
  if (!content && !mediaUrl) {
    // Or return a placeholder for an empty message if that's a possible state
    return null; 
  }

  return (
    <div className={bubbleContainerClasses}>
      <div className={bubbleClasses}>
        {/* Sender Name for received messages in group chats */}
        {!isSent && senderName && (
          <p className="text-xs font-semibold mb-1 text-pink-600 dark:text-pink-400">
            {senderName}
          </p>
        )}

        {/* Media Content */}
        {mediaUrl && mediaType && (
          <div className={clsx("mb-1", { "cursor-pointer": !!onMediaClick })} onClick={onMediaClick ? handleMediaItemClick : undefined}>
            <MediaPreviewItem
              src={mediaUrl}
              type={mediaType}
              fileName={mediaFileName}
              // onClick prop for MediaPreviewItem assumed to be handled internally or via this wrapper div click
            />
          </div>
        )}

        {/* Text Content (can be caption for media or the message itself) */}
        {content && (
          <p className="text-sm whitespace-pre-wrap break-words leading-snug">
            {content}
          </p>
        )}

        {/* Timestamp and Status */}
        <div className="text-xs mt-1 flex justify-end items-center space-x-1 clear-both">
          <span className="text-gray-500 dark:text-gray-400 opacity-90">
            {timestamp}
          </span>
          {isSent && status && <MessageStatusIcon status={status} />}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBubble;