import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchForm = ({ onSearch, loading }) => {
  const [formData, setFormData] = useState({
    animalType: 'dog',
    breed: 'random',
    imageCount: 5,
    userEmail: '',
    includeFacts: true,
  });

  const [dogBreeds, setDogBreeds] = useState([]);
  const [loadingBreeds, setLoadingBreeds] = useState(false);

  useEffect(() => {
    const fetchBreeds = async () => {
      setLoadingBreeds(true);
      try {
        const response = await axios.get('https://dog.ceo/api/breeds/list/all');
        const breedsArray = Object.keys(response.data.message);
        setDogBreeds(breedsArray);
      } catch (error) {
        console.error("Failed to fetch dog breeds:", error);
      }
      setLoadingBreeds(false);
    };
    fetchBreeds();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="form-grid">
        
        <fieldset>
          <legend>1. Pilih Hewan:</legend>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="animalType"
                value="dog"
                checked={formData.animalType === 'dog'}
                onChange={handleChange}
              />
              Anjing (Dog)
            </label>
            <label>
              <input
                type="radio"
                name="animalType"
                value="cat"
                checked={formData.animalType === 'cat'}
                onChange={handleChange}
              />
              Kucing (Cat)
            </label>
          </div>
        </fieldset>

        {formData.animalType === 'dog' && (
          <div>
            <label htmlFor="breed">2. Pilih Breed Anjing:</label>
            <select
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              disabled={loadingBreeds}
            >
              <option value="random">Random (Acak)</option>
              {dogBreeds.map(breed => (
                <option key={breed} value={breed}>{breed}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="imageCount">
            {formData.animalType === 'dog' ? '3' : '2'}. Jumlah Gambar:
          </label>
          <input
            type="number"
            id="imageCount"
            name="imageCount"
            value={formData.imageCount}
            onChange={handleChange}
            min="1"
            max="20"
            required
          />
        </div>

        <div>
          <label htmlFor="userEmail">
            {formData.animalType === 'dog' ? '4' : '3'}. Email Anda (Demo Validasi):
          </label>
          <input
            type="email"
            id="userEmail"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            placeholder="nama@email.com"
            required
          />
        </div>

        {formData.animalType === 'cat' && (
          <div>
            <label htmlFor="includeFacts">
              <input
                type="checkbox"
                id="includeFacts"
                name="includeFacts"
                checked={formData.includeFacts}
                onChange={handleChange}
              />
              4. Tampilkan Fakta Kucing?
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Sedang Mencari...' : 'Tampilkan Galeri'}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;