import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Props: onSearch (function), loading (bool)
const SearchForm = ({ onSearch, loading }) => {
  // Ganti userEmail menjadi nickname
  const [formData, setFormData] = useState({
    animalType: 'dog',
    breed: 'random',
    imageCount: 5,
    nickname: '', // GANTI DARI userEmail
    includeFacts: true,
  });

  // State untuk list breed
  const [dogBreeds, setDogBreeds] = useState([]);
  const [catBreeds, setCatBreeds] = useState([]); // TAMBAHAN
  const [loadingBreeds, setLoadingBreeds] = useState(false);

  // useEffect sekarang fetch SEMUA breed
  useEffect(() => {
    const fetchAllBreeds = async () => {
      setLoadingBreeds(true);
      try {
        // 1. Fetch Dog Breeds
        const dogRes = await axios.get('https://dog.ceo/api/breeds/list/all');
        const breedsArray = Object.keys(dogRes.data.message);
        setDogBreeds(breedsArray);

        // 2. Fetch Cat Breeds (dari TheCatAPI)
        const catRes = await axios.get('https://api.thecatapi.com/v1/breeds');
        // Format: [{ id: "abys", name: "Abyssinian" }, ...]
        setCatBreeds(catRes.data);

      } catch (error) {
        console.error("Failed to fetch breeds:", error);
      }
      setLoadingBreeds(false);
    };
    fetchAllBreeds();
  }, []); // Dependency array kosong, hanya jalan sekali

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

        {/* --- KONDISIONAL DROPDOWN BREED --- */}
        {/* Dropdown Anjing */}
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

        {/* Dropdown Kucing (BARU) */}
        {formData.animalType === 'cat' && (
          <div>
            <label htmlFor="breed">2. Pilih Breed Kucing:</label>
            <select
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              disabled={loadingBreeds}
            >
              <option value="random">Random (Acak)</option>
              {catBreeds.map(breed => (
                // Value-nya adalah breed 'id' (cth: "abys")
                <option key={breed.id} value={breed.id}>{breed.name}</option>
              ))}
            </select>
          </div>
        )}
        {/* --- AKHIR KONDISIONAL --- */}


        <div>
          <label htmlFor="imageCount">3. Jumlah Gambar:</label>
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

        {/* Input Email DIGANTI Nama Panggilan */}
        <div>
          <label htmlFor="nickname">4. Nama Panggilan Anda:</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="Mimi"
            required // Validasi HTML5
          />
        </div>

        {/* Checkbox Fakta (dibuat simetris/selalu tampil) */}
        <div>
          <label htmlFor="includeFacts">
            <input
              type="checkbox"
              id="includeFacts"
              name="includeFacts"
              checked={formData.includeFacts}
              onChange={handleChange}
            />
            5. Tampilkan Fakta Hewan?
          </label>
        </div>

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