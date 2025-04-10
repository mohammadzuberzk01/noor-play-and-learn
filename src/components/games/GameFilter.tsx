
import React from 'react';

interface GameFilterProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const filters = [
  { id: 'all', label: 'All Games' },
  { id: 'knowledge', label: 'Knowledge-Based' },
  { id: 'quran', label: 'Qur\'an & Hadith' },
  { id: 'memory', label: 'Memory Games' },
  { id: 'group', label: 'Group Games' },
  { id: 'challenges', label: 'Challenges' },
];

const GameFilter: React.FC<GameFilterProps> = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`px-4 py-2 rounded-full text-sm transition ${
            activeFilter === filter.id
              ? 'bg-islamic-primary text-white'
              : 'bg-white text-islamic-primary hover:bg-gray-100'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default GameFilter;
