import React, { useState } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} 
from 'react-router-dom';
import './App.css';
import { fetchNasaApod } from './api/nasaApi';
import List, { ApodData } from './components/List';

function App() {
  const [apodData, setApodData] = useState<ApodData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fetched, setFetched] = useState(false);

  const loadApod = async (start?: string, end?: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchNasaApod(undefined, false, start, end);
      const formatted = Array.isArray(data) ? data : [data];
      setApodData(formatted);
      setFetched(true);
    } catch (err) {
      console.error(err);
      setError('Failed to load NASA APOD.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      loadApod(startDate, endDate);
    } else {
      setError('Please select both start and end dates.');
    }
  };

  return (
    // NOTE: Removed Router here since BrowserRouter is already in index.tsx
    <ModalSwitch
      apodData={apodData}
      loading={loading}
      error={error}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      handleSubmit={handleSubmit}
      fetched={fetched}
    />
  );
}

// This component handles showing List and modal together based on location
function ModalSwitch({
  apodData,
  loading,
  error,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleSubmit,
  fetched,
}: {
  apodData: ApodData[] | null;
  loading: boolean;
  error: string;
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => void;
  fetched: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state && state.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route
          path="/"
          element={
            <div className="App">
              <h1 className={fetched ? 'shrink-header' : 'hero-header'}>
                ✨ Tour the Galaxies & Beyond! ✨
              </h1>
              <form onSubmit={handleSubmit} className="date-form">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
                <label>End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
                <button type="submit">Fetch Range</button>
              </form>
              {loading && <p>Loading...</p>}
              {error && <p className="error">{error}</p>}

              {/* Render the List component here */}
              {apodData && apodData.length > 0 && (
                <List
                  apods={apodData}
                  onSelect={(date) =>
                    navigate(`/apod/${date}`, { state: { backgroundLocation: location } })
                  }
                />
              )}
            </div>
          }
        />
      </Routes>

      {/* Show modal when the route is /apod/:date */}
      {backgroundLocation && (
        <Routes>
          <Route path="/apod/:date" element={<DetailModal apodData={apodData} />} />
        </Routes>
      )}
    </>
  );
}

function DetailModal({ apodData }: { apodData: ApodData[] | null }) {
  const { date } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  if (!apodData) return null;

  if (!date) return <p>No APOD date provided.</p>;

  const apodIndex = apodData.findIndex((item) => item.date === date);

  if (apodIndex === -1) return <p>APOD not found for date: {date}</p>;

  const apod = apodData[apodIndex];

  const onClose = () => navigate("/", { replace: true });
  const onPrev = () => {
    if (apodIndex > 0) {
      const prevDate = apodData[apodIndex - 1].date;
      navigate(`/apod/${prevDate}`, { state: { backgroundLocation: location } });
    }
  };
  const onNext = () => {
    if (apodIndex < apodData.length - 1) {
      const nextDate = apodData[apodIndex + 1].date;
      navigate(`/apod/${nextDate}`, { state: { backgroundLocation: location } });
    }
  };

  return (
    <div className="apod-detail-overlay" onClick={onClose}>
      <div className="apod-detail" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <button className="prev-btn" onClick={onPrev} disabled={apodIndex === 0}>◀</button>
        <button className="next-btn" onClick={onNext} disabled={apodIndex === apodData.length - 1}>▶</button>
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
    </div>
  );
}

export default App;
