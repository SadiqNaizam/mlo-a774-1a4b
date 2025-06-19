import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useToast } from "@/components/ui/use-toast";
import { Smile, Paperclip, Send, Image, FileText, Video } from 'lucide-react';

// Assuming EmojiPickerPanel is an existing component that would be imported if used directly
// import EmojiPickerPanel from '@/components/EmojiPickerPanel';

interface MessageInputAreaProps {
  onSendMessage: (message: string, type: 'text' | 'media', file?: File) => void;
  typingIndicator?: string | null;
  isSending?: boolean;
}

const MessageInputArea: React.FC<MessageInputAreaProps> = ({
  onSendMessage,
  typingIndicator,
  isSending = false,
}) => {
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  console.log('MessageInputArea loaded');

  const handleSendMessage = () => {
    if (selectedFile) {
      onSendMessage(messageText, 'media', selectedFile); // messageText can serve as a caption
      setSelectedFile(null);
      setMessageText('');
    } else if (messageText.trim() !== '') {
      onSendMessage(messageText.trim(), 'text');
      setMessageText('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video' | 'document') => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} selected: ${file.name}`,
        description: "Ready to be sent with your message.",
      });
      // Clear the input value to allow selecting the same file again if cleared
      event.target.value = '';
    }
  };

  return (
    <div className="border-t bg-gray-50 dark:bg-gray-950 p-3 sm:p-4">
      {typingIndicator && (
        <div className="mb-1.5 px-1 text-xs text-muted-foreground italic">
          {typingIndicator}
        </div>
      )}
      <div className="flex items-end space-x-2">
        {/* Emoji Picker Trigger */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-foreground">
              <Smile className="h-5 w-5" />
              <span className="sr-only">Open emoji picker</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-none shadow-lg">
            {/* Placeholder for EmojiPickerPanel component. 
                It would be rendered here, e.g.:
                <EmojiPickerPanel onEmojiSelect={(emoji) => setMessageText(prev => prev + emoji.native)} /> 
            */}
            <div className="p-4 text-sm bg-background rounded-md">
              Emoji Picker Panel would appear here.
            </div>
          </PopoverContent>
        </Popover>

        {/* Attachment Button with Popover for options */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-foreground">
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Attach file</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-1 bg-background border shadow-lg rounded-md">
            <div className="grid gap-1">
              <label className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md cursor-pointer text-sm">
                <Image className="h-4 w-4 text-muted-foreground" />
                <span>Photos & Videos</span>
                <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleFileSelect(e, 'image')} />
              </label>
              <label className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md cursor-pointer text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Document</span>
                <input type="file" accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar" className="hidden" onChange={(e) => handleFileSelect(e, 'document')} />
              </label>
            </div>
          </PopoverContent>
        </Popover>

        {/* Message Textarea */}
        <Textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 resize-none min-h-[40px] max-h-[120px] bg-background rounded-lg border-input focus-visible:ring-1 focus-visible:ring-ring"
          rows={1}
        />

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={isSending || (messageText.trim() === '' && !selectedFile)}
          size="icon"
          className="flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-10 h-10"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
      {selectedFile && (
        <div className="mt-2 px-1 text-xs text-muted-foreground flex items-center justify-between">
          <span>File: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
          <Button variant="ghost" size="sm" className="h-auto p-1 text-xs text-destructive hover:text-destructive/80" onClick={() => setSelectedFile(null)}>Clear</Button>
        </div>
      )}
    </div>
  );
};

export default MessageInputArea;