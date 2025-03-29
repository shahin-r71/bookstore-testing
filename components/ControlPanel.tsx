import React from 'react';
import ReactSlider from 'react-slider';
import { regions } from '@/lib/bookGenerator';
import { useBookStore } from '@/lib/store';

export default function ControlPanel() {
  const {
    region,
    seed,
    likes,
    reviews,
    setRegion,
    setSeed,
    setLikes,
    setReviews,
    generateRandomSeed,
    viewMode,
    setViewMode
  } = useBookStore();

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
  };

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(e.target.value);
  };

  const handleLikesChange = (value: number) => {
    setLikes(value);
  };

  const handleReviewsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReviews(parseFloat(e.target.value));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Book Generator Controls</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language/Region Selection */}
        <div>
          <label className="block mb-2 font-medium">Language/Region</label>
          <select
            value={region}
            onChange={handleRegionChange}
            className="w-full p-2 border border-gray-300 focus:outline-none rounded-md"
          >
            {regions.map((r,index) => (
              <option key={index} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Seed Control */}
        <div>
          <label className="block mb-2 font-medium">Seed Value</label>
          <div className="flex">
            <input
              type="text"
              value={seed}
              onChange={handleSeedChange}
              className="w-full p-2 border border-gray-300 focus:outline-none mr-1 rounded-l-md"
            />
            <button
              onClick={generateRandomSeed}
              className="bg-primary-300 text-white px-3 py-2 rounded-r-md cursor-pointer hover:bg-primary-600 transition"
              title="Generate Random Seed"
            >
              🔀
            </button>
          </div>
        </div>

        {/* Likes Control - Slider */}
        <div>
          <label className="block mb-2 font-medium">
            Average Likes Per Book: {likes.toFixed(1)}
          </label>
          <ReactSlider
            className="w-full h-6 rounded-md"
            thumbClassName="w-6 h-6 bg-primary-600 rounded-full -mt-1 cursor-pointer focus:outline-none"
            trackClassName="h-4 bg-primary-200 rounded-md"
            min={0}
            max={10}
            step={0.1}
            value={likes}
            onChange={handleLikesChange}
            renderThumb={(props) => {
              const {key, ...rest} = props;
              return <div key={key} {...rest} />;
            }}
          />
        </div>

        {/* Reviews Control - Number Input */}
        <div>
          <label className="block mb-2 font-medium">
            Average Reviews Per Book
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={reviews}
            onChange={handleReviewsChange}
            className="w-full p-2 border border-gray-300 focus:outline-none rounded-md"
          />
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mt-6 flex justify-end">
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            className={`px-4 py-2 cursor-pointer ${
              viewMode === 'table'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setViewMode('table')}
          >
            Table View
          </button>
          <button
            className={`px-4 py-2 cursor-pointer ${
              viewMode === 'gallery'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setViewMode('gallery')}
          >
            Gallery View
          </button>
        </div>
      </div>
    </div>
  );
}
