import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // TabsContent not used directly, content managed by activeTab state
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Smile, Cat, Utensils, LampDeck, Trees, Pizza, Construction } from 'lucide-react';

interface Emoji {
  symbol: string;
  name: string;
}

interface EmojiCategory {
  name: string;
  icon: React.ElementType;
  emojis: Emoji[];
}

// A sample list of emojis. In a real application, this would be much larger and potentially fetched.
const EMOJI_DATA: EmojiCategory[] = [
  {
    name: 'Smileys',
    icon: Smile,
    emojis: [
      { symbol: '😀', name: 'Grinning Face' }, { symbol: '😃', name: 'Grinning Face with Big Eyes' },
      { symbol: '😄', name: 'Grinning Face with Smiling Eyes' }, { symbol: '😁', name: 'Beaming Face with Smiling Eyes' },
      { symbol: '😆', name: 'Grinning Squinting Face' }, { symbol: '😅', name: 'Grinning Face with Sweat' },
      { symbol: '🤣', name: 'Rolling on the Floor Laughing' }, { symbol: '😂', name: 'Face with Tears of Joy' },
      { symbol: '🙂', name: 'Slightly Smiling Face' }, { symbol: '🙃', name: 'Upside-Down Face' },
      { symbol: '😉', name: 'Winking Face' }, { symbol: '😊', name: 'Smiling Face with Smiling Eyes' },
      { symbol: '😇', name: 'Smiling Face with Halo' }, { symbol: '🥰', name: 'Smiling Face with Hearts' },
      { symbol: '😍', name: 'Smiling Face with Heart-Eyes' }, { symbol: '🤩', name: 'Star-Struck' },
      { symbol: '😘', name: 'Face Blowing a Kiss' }, { symbol: '😗', name: 'Kissing Face' },
      { symbol: '🤔', name: 'Thinking Face' }, { symbol: '🫡', name: 'Saluting Face' },
    ],
  },
  {
    name: 'Nature',
    icon: Trees,
    emojis: [
      { symbol: '🐶', name: 'Dog Face' }, { symbol: '🐱', name: 'Cat Face' }, { symbol: '🐭', name: 'Mouse Face' },
      { symbol: '🐹', name: 'Hamster Face' }, { symbol: '🐰', name: 'Rabbit Face' }, { symbol: '🦊', name: 'Fox Face' },
      { symbol: '🐻', name: 'Bear Face' }, { symbol: '🐼', name: 'Panda Face' }, { symbol: '🐨', name: 'Koala' },
      { symbol: '🐯', name: 'Tiger Face' }, { symbol: '🦁', name: 'Lion Face' }, { symbol: '🐮', name: 'Cow Face' },
      { symbol: '🐷', name: 'Pig Face' }, { symbol: '🐵', name: 'Monkey Face' }, { symbol: '🌿', name: 'Herb' },
      { symbol: '🌸', name: 'Cherry Blossom' }, { symbol: '🍁', name: 'Maple Leaf' }, { symbol: '🍄', name: 'Mushroom' },
    ],
  },
  {
    name: 'Food',
    icon: Pizza,
    emojis: [
      { symbol: '🍏', name: 'Green Apple' }, { symbol: '🍎', name: 'Red Apple' }, { symbol: '🍐', name: 'Pear' },
      { symbol: '🍊', name: 'Tangerine' }, { symbol: '🍋', name: 'Lemon' }, { symbol: '🍌', name: 'Banana' },
      { symbol: '🍉', name: 'Watermelon' }, { symbol: '🍇', name: 'Grapes' }, { symbol: '🍓', name: 'Strawberry' },
      { symbol: '🍕', name: 'Pizza' }, { symbol: '🍔', name: 'Hamburger' }, { symbol: '🍟', name: 'French Fries' },
      { symbol: '🍹', name: 'Tropical Drink' }, { symbol: '☕', name: 'Hot Beverage' }, { symbol: '🍦', name: 'Ice Cream' },
    ],
  },
  {
    name: 'Objects',
    icon: LampDeck, // Using LampDeck as Lamp is not available, Construction as another fallback
    emojis: [
      { symbol: '⌚', name: 'Watch' }, { symbol: '📱', name: 'Mobile Phone' }, { symbol: '💻', name: 'Laptop' },
      { symbol: '⌨️', name: 'Keyboard' }, { symbol: '🖨️', name: 'Printer' }, { symbol: '🖱️', name: 'Computer Mouse' },
      { symbol: '💡', name: 'Light Bulb' }, { symbol: '🎉', name: 'Party Popper' }, { symbol: '🎁', name: 'Wrapped Gift' },
      { symbol: '🎈', name: 'Balloon' }, { symbol: '🎵', name: 'Musical Note' }, { symbol: '🎮', name: 'Video Game' },
    ],
  },
];

interface EmojiPickerPanelProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPickerPanel: React.FC<EmojiPickerPanelProps> = ({ onEmojiSelect }) => {
  console.log('EmojiPickerPanel loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(EMOJI_DATA[0]?.name || '');

  const emojisToDisplay = useMemo(() => {
    if (!activeTab && !searchTerm) { // if no tab selected and no search, show first category
        const firstCategory = EMOJI_DATA[0];
        if (!firstCategory) return [];
        return firstCategory.emojis;
    }

    let emojis: Emoji[] = [];

    if (searchTerm) {
      // Search across all categories if search term is present
      emojis = EMOJI_DATA.flatMap(category => category.emojis.filter(emoji =>
        emoji.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emoji.symbol.includes(searchTerm) // Direct symbol match
      ));
      // Deduplicate if emojis appear in multiple "searched" categories (not an issue with current EMOJI_DATA)
      const uniqueSymbols = new Set<string>();
      emojis = emojis.filter(emoji => {
        if (uniqueSymbols.has(emoji.symbol)) {
          return false;
        }
        uniqueSymbols.add(emoji.symbol);
        return true;
      });

    } else {
      // If no search term, show emojis from active tab
      const category = EMOJI_DATA.find(cat => cat.name === activeTab);
      emojis = category ? category.emojis : [];
    }
    return emojis;
  }, [searchTerm, activeTab]);

  // Effect to set active tab to first category if it's initially empty (e.g. EMOJI_DATA loads async, though not here)
  // Or if search clears and no tab was active.
  React.useEffect(() => {
    if (!activeTab && EMOJI_DATA.length > 0) {
      setActiveTab(EMOJI_DATA[0].name);
    }
  }, [activeTab]);


  return (
    <div className="p-1 bg-background border rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm h-[400px] flex flex-col">
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search emojis..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // If user types, we might want to clear activeTab or set a "search results" tab conceptually
              // For now, search overrides tab selection for display
            }}
          />
        </div>
      </div>

      <Tabs 
        value={searchTerm ? "_search_results_" : activeTab} // Use a dummy value for tab when searching to deselect category tabs
        onValueChange={(value) => {
          if (value !== "_search_results_") { // Ensure clicking a tab clears search
            setSearchTerm(''); 
            setActiveTab(value);
          }
        }} 
        className="flex-grow flex flex-col min-h-0"
      >
        <TabsList className="flex justify-start mb-2 p-1 h-auto overflow-x-auto no-scrollbar">
          {EMOJI_DATA.map((category) => (
            <Tooltip key={category.name}>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value={category.name}
                  className="text-xs p-1.5 data-[state=active]:bg-muted data-[state=active]:shadow-sm flex-shrink-0"
                  aria-label={category.name}
                >
                  <category.icon className="h-5 w-5" />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{category.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TabsList>

        {/* The ScrollArea is the content display area, driven by `emojisToDisplay` */}
        <ScrollArea className="flex-grow bg-muted/20 rounded-md p-0.5">
          {emojisToDisplay.length > 0 ? (
            <div className="grid grid-cols-7 sm:grid-cols-8 gap-0.5 p-2">
              {emojisToDisplay.map((emoji) => (
                <Tooltip key={emoji.symbol}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-xl hover:bg-accent rounded-md w-full aspect-square p-0"
                      onClick={() => onEmojiSelect(emoji.symbol)}
                      aria-label={emoji.name}
                    >
                      {emoji.symbol}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{emoji.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-10 text-sm">
              {searchTerm ? `No results for "${searchTerm}"` : 'No emojis in this category.'}
            </div>
          )}
        </ScrollArea>
      </Tabs>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default EmojiPickerPanel;