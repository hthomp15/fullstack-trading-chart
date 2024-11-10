import React, { useEffect, useState, MouseEvent } from 'react';

interface EmojiReaction {
  userId: string;
  emoji: string;
}


const EmojiToolbar = () => {
  const [emojis, setEmojis] = useState<{ userId: string, emoji: string }[]>([]);

  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const response = await fetch('http://localhost:3001/getReactions');
        const data = await response.json();

        const fetchedEmojis: EmojiReaction[] = Object.values(data).flat();
        setEmojis(fetchedEmojis);
      } catch (error) {
        console.error('Failed to fetch emojis:', error);
      }
    };

    fetchEmojis();
  }, []);

  const handleAddEmoji = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Added Emoji");
    // TODO: Add Emojis to backend
  };

  return (
    <div className="flex bg-[#252525] p-2 rounded-full items-center justify-evenly">
      {emojis.map((emojiObj, index) => (
        <div
          key={index}
          id={`${index}`}
          className="mx-2 cursor-pointer"
          draggable
        >
          {emojiObj.emoji}
        </div>
      ))}
      <button
        className="text-[#adadad] bg-[#1a1a1a] rounded-full w-5 h-5 leading-none"
        onClick={handleAddEmoji}
      >
        +
      </button>
    </div>
  );
};

export default EmojiToolbar;
