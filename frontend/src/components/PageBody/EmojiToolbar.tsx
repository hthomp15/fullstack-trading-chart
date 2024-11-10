import React from 'react';

const EmojiToolbar = () => {
  const emojis = ['🚀', '🔥', '💎', '🦄', '✨'];

  return (
    <div className="flex bg-[#1a1a1a] p-2 rounded-full"
    >
      {emojis.map((emoji, index) => (
        <div className="mx-2"
        >
          {emoji}
        </div>
      ))}
    </div>
  );
};

export default EmojiToolbar;
