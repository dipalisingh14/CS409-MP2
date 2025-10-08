import React, { useState, useEffect } from 'react';

export interface ApodData {
  title: string;
  explanation: string;
  url: string;
  date: string;
  hdurl?: string;
  media_type: string;
}

interface ListProps {
  apods: ApodData[] | null;
  onSelect: (date: string) => void;
}

const List: React.FC<ListProps> = ({ apods, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortProperty, setSortProperty] = useState<'date' | 'title'>('date');
  const [displayedApods, setDisplayedApods] = useState<ApodData[] | null>(apods);
  const [view, setView] = useState<'list' | 'gallery'>('list');

  const sortApods = (
    data: ApodData[],
    order: 'asc' | 'desc',
    property: 'date' | 'title'
  ) =>
    [...data].sort((a, b) => {
      if (property === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return order === 'asc'
          ? a.title.toLowerCase().localeCompare(b.title.toLowerCase())
          : b.title.toLowerCase().localeCompare(a.title.toLowerCase());
      }
    });

  useEffect(() => {
    if (!apods) return setDisplayedApods(null);
    let filtered = apods.filter((apod) =>
      apod.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    filtered = sortApods(filtered, sortOrder, sortProperty);
    setDisplayedApods(filtered);
  }, [apods, searchQuery, sortOrder, sortProperty]);

  if (!apods) return <p></p>;

  return (
    <div>
      {/* Controls */}
      <div className="date-form">
        <input
          type="text"
          placeholder="Search keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={sortProperty}
          onChange={(e) => setSortProperty(e.target.value as 'date' | 'title')}
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
        <button
          type="button"
          onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        >
          Order: {sortOrder === 'asc' ? 'Ascending ⬆️' : 'Descending ⬇️'}
        </button>
        <select
          value={view}
          onChange={(e) => setView(e.target.value as 'list' | 'gallery')}
        >
          <option value="list">List View</option>
          <option value="gallery">Gallery View</option>
        </select>
      </div>
      {/* List or Gallery */}
      <div className={view === 'list' ? 'apod-list' : 'gallery-grid'}>
        {displayedApods?.map((apod) => (
          <div
            key={apod.date}
            className={view === 'list' ? 'apod-item' : 'gallery-item'}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(apod.date)}
          >
            {apod.media_type === 'image' ? (
              <img
                src={apod.hdurl || apod.url}
                alt={apod.title}
                style={{
                  width: '100%',
                  height: view === 'gallery' ? '200px' : 'auto',
                  objectFit: view === 'gallery' ? 'cover' : 'contain',
                  borderRadius: '10px',
                  pointerEvents: 'none',
                }}
              />
            ) : (
              <iframe
                title={apod.title}
                src={apod.url}
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{
                  width: '100%',
                  height: view === 'gallery' ? '200px' : 'auto',
                  borderRadius: '10px',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
