import React from 'react';
import { Flame } from 'lucide-react';

const StreakBadge = ({ streak }) => {
  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg">
      <Flame className="w-5 h-5" />
      <span className="font-bold text-lg">{streak}</span>
      <span className="text-sm">day streak</span>
    </div>
  );
};

export default StreakBadge;