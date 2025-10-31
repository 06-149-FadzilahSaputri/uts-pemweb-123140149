import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Impor Komponen (dengan .jsx)
import Header from './components/Header.jsx';
import SearchForm from './components/SearchForm.jsx';
import DetailCard from './components/DetailCard.jsx';
import DataTable from './components/DataTable.jsx';

// !!! INI CARA MENGIMPOR CSS ANDA !!!
import './App.css'; 

// Mengambil API Key dari .env
const CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY;

function App() {
  // === STATE ===
  const [images, setImages] = useState([]);
  const [facts, setFacts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentAnimal, setCurrentAnimal] = useState(''); // Untuk logika UI
  
  // State untuk Loading & Error
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingFacts, setLoadingFacts] = useState(false);
  const [error, setError] = useState(null);
  
  // State untuk parameter pencarian terakhir (untuk refresh fakta)
  const [lastFactParams, setLastFactParams] = useState({ count: 5 });

  // === EFEK (useEffect) ===

  // 1. Load favorites dari localStorage saat aplikasi pertama kali dibuka
  useEffect(() => {
    const storedFavorites = localStorage.getItem('animalFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []); // Dependency array kosong, hanya jalan sekali

  // 2. Simpan favorites ke localStorage setiap kali state favorites berubah
  useEffect(() => {
    localStorage.setItem('animalFavorites', JSON.stringify(favorites));
  }, [favorites]);


  // === FUNGSI API (Async/Await) ===

  // Fetch Gambar Anjing
  const fetchDogImages = async (breed, count) => {
    setLoadingImages(true);
    setError(null);
    let url = '';
    
    if (breed === 'random') {
      url = `https://dog.ceo/api/breeds/image/random/${count}`;
    } else {
      url = `https://dog.ceo/api/breed/${breed}/images/random/${count}`;
    }
    
    try {
      const response = await axios.get(url);
      // Transformasi data: Dog API mengembalikan array of strings
      setImages(response.data.message.map(url => ({ id: url, url })));
    } catch (err) {
      setError('Gagal mengambil data gambar anjing.');
      console.error(err);
    }
    setLoadingImages(false);
  };

  // Fetch Gambar Kucing
  const fetchCatImages = async (count) => {
    setLoadingImages(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.thecatapi.com/v1/images/search?limit=${count}`,
        { headers: { 'x-api-key': CAT_API_KEY } }
      );
      // Cat API mengembalikan array of objects (sudah sesuai)
      setImages(response.data);
    } catch (err) {
      setError('Gagal mengambil data gambar kucing. Pastikan API Key valid.');
      console.error(err);
    }
    setLoadingImages(false);
  };

  // Fetch Fakta Kucing
  const fetchCatFacts = async (count) => {
    setLoadingFacts(true);
    setFacts([]); // Kosongkan fakta lama saat refresh
    try {
      const response = await axios.get(`https://catfact.ninja/facts?limit=${count}`);
      // Tambahkan ID unik buatan untuk key di React
      const factsWithIds = response.data.data.map((fact, index) => ({
        ...fact,
        fact_id: `${fact.length}-${index}`
      }));
      setFacts(factsWithIds);
    } catch (err) {
      setError('Gagal mengambil data fakta kucing.');
      console.error(err);
    }
    setLoadingFacts(false);
  };

  // === HANDLER EVENT ===

  // Handler utama saat form disubmit
  const handleSearch = (formData) => {
    const { animalType, breed, imageCount, includeFacts } = formData;
    
    setCurrentAnimal(animalType);
    setImages([]); // Kosongkan galeri lama
    setFacts([]); // Kosongkan fakta lama

    if (animalType === 'dog') {
      fetchDogImages(breed, imageCount);
    } else { // animalType === 'cat'
      fetchCatImages(imageCount);
      if (includeFacts) {
        fetchCatFacts(imageCount);
        setLastFactParams({ count: imageCount }); // Simpan untuk refresh
      }
    }
  };

  // Handler untuk tombol refresh fakta
  const handleRefreshFacts = () => {
    fetchCatFacts(lastFactParams.count);
  };

  // Handler untuk menambah/menghapus favorite
  const handleFavorite = (imageUrl) => {
    setFavorites(prevFavorites => {
      // Cek apakah sudah ada
      if (prevFavorites.includes(imageUrl)) {
        // Hapus (filter)
        return prevFavorites.filter(url => url !== imageUrl);
      } else {
        // Tambah (spread operator)
        return [...prevFavorites, imageUrl];
      }
    });
  };

  // Cek apakah gambar adalah favorit (untuk props DetailCard)
  const isFavorite = (imageUrl) => favorites.includes(imageUrl);
  
  // === RENDER ===

  return (
    <div className="app">
      <Header />
      
      <main className="container">
        <SearchForm onSearch={handleSearch} loading={loadingImages || loadingFacts} />

        {/* Tampilkan Error jika ada */}
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Galeri Gambar */}
        <h2>Galeri Gambar</h2>
        {loadingImages ? (
          <p className="loading-text">Memuat gambar...</p>
        ) : (
          <div className="gallery-grid">
            {images.map(image => (
              <DetailCard
                key={image.id}
                imageUrl={image.url}
                onFavorite={handleFavorite}
                isFavorite={isFavorite(image.url)}
              />
            ))}
          </div>
        )}

        {/* Tabel Fakta (Hanya untuk kucing dan jika ada fakta atau sedang loading) */}
        {currentAnimal === 'cat' && (facts.length > 0 || loadingFacts) && (
          <DataTable
            facts={facts}
            onRefresh={handleRefreshFacts}
            loading={loadingFacts}
          />
        )}
        
        {/* Galeri Favorit (Bonus) */}
        {favorites.length > 0 && (
          <section className="favorites-section">
            <h2>⭐ Favorit Anda</h2>
            <div className="favorites-grid">
              {favorites.map(url => (
                // Kita gunakan ulang komponen Card untuk favorit
                <div key={url} className="card">
                   <img src={url} alt="Favorite" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;