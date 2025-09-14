import React, { useState } from 'react';
import { Button } from './Button';
import { Filter, X } from 'lucide-react';

const AnimatedFilter = ({ 
  filters = [], 
  activeFilter = 'all', 
  onFilterChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterClick = (filterKey) => {
    onFilterChange(filterKey);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Filter className="h-4 w-4" />
        <span>Filter</span>
        {activeFilter !== 'all' && (
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full ml-2">
            {filters.find(f => f.key === activeFilter)?.label || activeFilter}
          </span>
        )}
      </Button>

      {/* Animated Filter Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-background rounded-lg shadow-lg border border-border z-50 min-w-[200px] animate-fade-in-up">
          <div className="p-2">
            <div className="flex items-center justify-between p-2 border-b border-border">
              <span className="font-medium text-sm text-foreground">Filter by Category</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2 space-y-1">
              <button
                onClick={() => handleFilterClick('all')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground ${
                  activeFilter === 'all' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground'
                }`}
              >
                All Photos
              </button>
              
              {filters.map((filter, index) => (
                <button
                  key={filter.key}
                  onClick={() => handleFilterClick(filter.key)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground animate-fade-in-up ${
                    activeFilter === filter.key 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span>{filter.label}</span>
                    {filter.count && (
                      <span className="text-xs opacity-60">
                        {filter.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AnimatedFilter;
