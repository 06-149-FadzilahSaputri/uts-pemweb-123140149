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

function App() {
  // === STATE ===
  const [images, setImages] = useState([]);
  const [facts, setFacts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentAnimal, setCurrentAnimal] = useState('');
  const [nickname, setNickname] = useState(''); // STATE BARU (Permintaan #4)
  
  // State untuk Loading & Error
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingFacts, setLoadingFacts] = useState(false);
  const [error, setError] = useState(null);
  
  // State untuk refresh (sekarang menyimpan 'type' hewan)
  const [lastFactParams, setLastFactParams] = useState({ count: 5, type: 'cat' });

  // === EFEK (useEffect) ===
  // (Load/Save favorites tidak berubah, biarkan apa adanya)
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

  // Fetch Gambar Anjing (Logika breed di-update)
  const fetchDogImages = async (breed, count) => {
    setLoadingImages(true);
    setError(null);
    let url = '';
    
    if (breed === 'random') {
      url = `https://dog.ceo/api/breeds/image/random/${count}`;
    } else {
      // URL untuk breed spesifik
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

  // Fetch Gambar Kucing (Logika breed di-update)
  const fetchCatImages = async (breed, count) => {
    setLoadingImages(true);
    setError(null);
    let url = `https://api.thecatapi.com/v1/images/search?limit=${count}`;

    // Jika breed dipilih, tambahkan parameter breed_ids
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

  // FUNGSI BARU: Fetch Fakta Anjing (Permintaan #1)
  const fetchDogFacts = async (count) => {
    setLoadingFacts(true);
    setFacts([]);
    try {
      const response = await axios.get(`https://dog-api.kinduff.com/api/facts?number=${count}`);
      // Transformasi data agar sesuai format tabel
      const factsData = response.data.facts.map((fact, index) => ({
        id: `dog-${index}`,
        fact: fact,
        type: 'Anjing' // (Permintaan #2)
      }));
      setFacts(factsData);
    } catch (err) {
      setError('Gagal mengambil data fakta anjing.');
      console.error(err);
    }
    setLoadingFacts(false);
  };

  // Fetch Fakta Kucing (Di-update untuk format tabel baru)
  const fetchCatFacts = async (count) => {
    setLoadingFacts(true);
    setFacts([]);
    try {
      const response = await axios.get(`https://catfact.ninja/facts?limit=${count}`);
      // Transformasi data agar sesuai format tabel
      const factsData = response.data.data.map((fact, index) => ({
        id: `cat-${index}-${fact.length}`,
        fact: fact.fact,
        type: 'Kucing' // (Permintaan #2)
      }));
      setFacts(factsData);
    } catch (err) {
      setError('Gagal mengambil data fakta kucing.');
      console.error(err);
    }
    setLoadingFacts(false);
  };

  // === HANDLER EVENT ===

  // Handler utama saat form disubmit (Di-update)
  const handleSearch = (formData) => {
    // Ambil nickname dari form (Permintaan #4)
    const { animalType, breed, imageCount, includeFacts, nickname } = formData;
    
    // Simpan nickname ke state (Permintaan #4)
    setNickname(nickname); 

    setCurrentAnimal(animalType);
    setImages([]); 
    setFacts([]); 

    // Simpan parameter untuk tombol Refresh
    setLastFactParams({ count: imageCount, type: animalType });

    // Logika simetris (Permintaan #1)
    if (animalType === 'dog') {
      fetchDogImages(breed, imageCount);
      if (includeFacts) {
        fetchDogFacts(imageCount); // Panggil fakta anjing
      }
    } else { // animalType === 'cat'
      fetchCatImages(breed, imageCount); // 'breed' bisa 'random' atau 'abys'
      if (includeFacts) {
        fetchCatFacts(imageCount);
      }
    }
  };

  // Handler untuk tombol refresh fakta (Di-update)
  const handleRefreshFacts = () => {
    // Cek tipe hewan dari parameter terakhir
    if (lastFactParams.type === 'dog') {
      fetchDogFacts(lastFactParams.count);
    } else {
      fetchCatFacts(lastFactParams.count);
    }
  };

  // Handler favorite (Tidak berubah)
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
  
  // === RENDER ===

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

        {/* Teks Sapaan Personal (Permintaan #4) */}
        {/* Muncul jika nickname ada DAN tidak sedang loading/error */}
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

        {/* Tabel Fakta (Sekarang simetris) */}
        {/* Tampil jika ada fakta ATAU sedang loading fakta */}
        {(facts.length > 0 || loadingFacts) && (
          <DataTable
            facts={facts}
            onRefresh={handleRefreshFacts}
            loading={loadingFacts}
            animalType={currentAnimal} // Kirim tipe hewan untuk judul tabel
          />
        )}
        
        {/* Galeri Favorit (Tidak berubah) */}
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