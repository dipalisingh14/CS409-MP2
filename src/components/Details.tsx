import React from 'react';
import { ApodData } from './List';

interface DetailProps {
  apod: ApodData;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Detail: React.FC<DetailProps> = ({ apod, onClose, onPrev, onNext }) => {
  return (
    <div className="apod-detail-overlay">
      <button className="prev-btn" onClick={onPrev}>
        ◀
      </button>
      <div className="apod-detail">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>{apod.title}</h2>
        {apod.media_type === 'image' ? (
          <img src={apod.hdurl || apod.url} alt={apod.title} />
        ) : (
          <iframe
            title={apod.title}
            src={apod.url}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
        <p>{apod.explanation}</p>
        <small>Date: {apod.date}</small>
      </div>
      <button className="next-btn" onClick={onNext}>
        ▶
      </button>
    </div>
  );
};

export default Detail;
