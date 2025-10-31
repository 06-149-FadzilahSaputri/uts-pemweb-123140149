import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Impor Komponen (dengan .jsx)
import Header from './components/Header.jsx';
import SearchForm from './components/SearchForm.jsx';
import DetailCard from './components/DetailCard.jsx';
import DataTable from './components/DataTable.jsx';

// Impor CSS
import './App.css'; 

// Mengambil API Key dari .env
const CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY;

// --- DATA ANJING PALSU (MOCK DATA) ---
// Kita gunakan ini karena API aslinya rusak.
const MOCK_DOG_FACTS = [
  "Indra penciuman seekor anjing 10.000 kali lebih kuat dari manusia.",
  "Basenji adalah satu-satunya ras anjing yang tidak bisa menggonggong.",
  "Anjing Dalmatian terlahir putih bersih, tanpa bintik.",
  "Cetakan hidung anjing bersifat unik, mirip sidik jari manusia.",
  "Lagu The Beatles 'A Day in the Life' memiliki frekuensi yang hanya bisa didengar anjing.",
  "Tiga anjing selamat dari tenggelamnya kapal Titanic."
];
// ------------------------------------


function App() {
  // === STATE ===
  const [images, setImages] = useState([]);
  const [facts, setFacts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentAnimal, setCurrentAnimal] = useState('');
  const [nickname, setNickname] = useState(''); 
  
  // State untuk Loading & Error
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingFacts, setLoadingFacts] = useState(false);
  const [error, setError] = useState(null);
  
  const [lastFactParams, setLastFactParams] = useState({ count: 5, type: 'cat' });

  // === EFEK (useEffect) ===
  useEffect(() => {
    const storedFavorites = localStorage.getItem('animalFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('animalFavorites', JSON.stringify(favorites));
  }, [favorites]);


  // === FUNGSI API (Async/Await) ===

  // Fetch Gambar Anjing (Tidak berubah)
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
      setImages(response.data.message.map(url => ({ id: url, url })));
    } catch (err) {
      setError('Gagal mengambil data gambar anjing.');
      console.error(err);
    }
    setLoadingImages(false);
  };

  // Fetch Gambar Kucing (Tidak berubah)
  const fetchCatImages = async (breed, count) => {
    setLoadingImages(true);
    setError(null);
    let url = `https://api.thecatapi.com/v1/images/search?limit=${count}`;

    if (breed !== 'random') {
      url += `&breed_ids=${breed}`;
    }

    try {
      const response = await axios.get(url, { 
        headers: { 'x-api-key': CAT_API_KEY } 
      });
      setImages(response.data);
    } catch (err) {
      setError('Gagal mengambil data gambar kucing. Pastikan API Key valid.');
      console.error(err);
    }
    setLoadingImages(false);
  };

  // FUNGSI FAKTA ANJING (DI-UPDATE DENGAN DATA PALSU)
  const fetchDogFacts = async (count) => {
    setLoadingFacts(true);
    setFacts([]);

    // Kita tidak pakai 'try...catch' atau 'axios' lagi
    // Kita simulasi loading 0.5 detik agar terlihat realistis
    await new Promise(resolve => setTimeout(resolve, 500));

    // Ambil data dari daftar MOCK_DOG_FACTS
    // (Kita acak sedikit agar tombol refresh terlihat berfungsi)
    const shuffledFacts = MOCK_DOG_FACTS.sort(() => 0.5 - Math.random());
    const selectedFacts = shuffledFacts.slice(0, count);

    // Transformasi data agar sesuai format tabel
    const factsData = selectedFacts.map((fact, index) => ({
      id: `dog-mock-${index}`, // ID unik untuk data palsu
      fact: fact,
      length: fact.length // Kita HITUNG panjangnya
    }));

    setFacts(factsData);
    setLoadingFacts(false);
  };


  // Fetch Fakta Kucing (Tidak berubah, API ini masih sehat)
  const fetchCatFacts = async (count) => {
    setLoadingFacts(true);
    setFacts([]);
    try {
      const response = await axios.get(`https://catfact.ninja/facts?limit=${count}`);
      
      const factsData = response.data.data.map((fact, index) => ({
        id: `cat-${index}-${fact.length}`,
        fact: fact.fact,
        length: fact.length 
      }));
      setFacts(factsData);
    } catch (err) {
      setError('Gagal mengambil data fakta kucing.');
      console.error(err);
    }
    setLoadingFacts(false);
  };

  // === HANDLER EVENT === (Tidak berubah)

  const handleSearch = (formData) => {
    const { animalType, breed, imageCount, includeFacts, nickname } = formData;
    
    setNickname(nickname); 
    setCurrentAnimal(animalType);
    setImages([]); 
    setFacts([]); 
    setError(null); // Hapus error lama setiap kali pencarian baru

    setLastFactParams({ count: imageCount, type: animalType });

    if (animalType === 'dog') {
      fetchDogImages(breed, imageCount);
      if (includeFacts) {
        fetchDogFacts(imageCount); 
      }
    } else { 
      fetchCatImages(breed, imageCount); 
      if (includeFacts) {
        fetchCatFacts(imageCount); 
      }
    }
  };

  const handleRefreshFacts = () => {
    if (lastFactParams.type === 'dog') {
      fetchDogFacts(lastFactParams.count);
    } else {
      fetchCatFacts(lastFactParams.count);
    }
  };

  const handleFavorite = (imageUrl) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(imageUrl)) {
        return prevFavorites.filter(url => url !== imageUrl);
      } else {
        return [...prevFavorites, imageUrl];
      }
    });
  };

  const isFavorite = (imageUrl) => favorites.includes(imageUrl);
  
  // === RENDER === (Tidak berubah)

  return (
    <div className="app">
      <Header />
      
      <main className="container">
        <SearchForm onSearch={handleSearch} loading={loadingImages || loadingFacts} />

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {nickname && !loadingImages && !error && (
          <h3 className="greeting">Hai {nickname}, ini dia hasil untukmu!</h3>
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

        {/* Tabel Fakta */}
        {(facts.length > 0 || loadingFacts) && (
          <DataTable
            facts={facts}
            onRefresh={handleRefreshFacts}
            loading={loadingFacts}
            animalType={currentAnimal} 
          />
        )}
        
        {/* Galeri Favorit */}
        {favorites.length > 0 && (
          <section className="favorites-section">
            <h2>⭐ Favorit Anda</h2>
            <div className="favorites-grid">
              {favorites.map(url => (
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