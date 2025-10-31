import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Impor SEMUA komponen Ant Design di satu tempat
import { Layout, Row, Col, Spin, Alert, Typography, Card } from 'antd'; 
import Header from './components/Header.jsx';
import SearchForm from './components/SearchForm.jsx';
import DetailCard from './components/DetailCard.jsx';
import DataTable from './components/DataTable.jsx';

const { Content } = Layout;
const { Title } = Typography;

// Mengambil API Key dari .env (Sudah benar posisinya)
const CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY;


// --- DATA ANJING PALSU (MOCK DATA) ---
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
  // === STATE (Tidak berubah) ===
  const [images, setImages] = useState([]);
  const [facts, setFacts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentAnimal, setCurrentAnimal] = useState('');
  const [nickname, setNickname] = useState(''); 
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingFacts, setLoadingFacts] = useState(false);
  const [error, setError] = useState(null);
  const [lastFactParams, setLastFactParams] = useState({ count: 5, type: 'cat' });

  // === EFEK (Tidak berubah) ===
  useEffect(() => {
    const storedFavorites = localStorage.getItem('animalFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('animalFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // === FUNGSI API (DENGAN PERBAIKAN 'FINALLY') ===

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
      setImages(response.data.message.map(url => ({ id: url, url })));
    } catch (err) {
      setError('Gagal mengambil data gambar anjing.');
      console.error(err);
    } finally {
      setLoadingImages(false); // <-- INI YANG PENTING
    }
  };

  // Fetch Gambar Kucing
  const fetchCatImages = async (breed, count) => {
    setLoadingImages(true);
    setError(null);
    let url = `https://api.thecatapi.com/v1/images/search?limit=${count}`;
    if (breed !== 'random') {
      url += `&breed_ids=${breed}`;
    }
    try {
      const response = await axios.get(url, { headers: { 'x-api-key': CAT_API_KEY } });
      setImages(response.data);
    } catch (err) {
      setError('Gagal mengambil data gambar kucing. Pastikan API Key valid.');
      console.error(err);
    } finally {
      setLoadingImages(false); // <-- INI YANG PENTING
    }
  };

  // FUNGSI FAKTA ANJING (Data palsu)
  const fetchDogFacts = async (count) => {
    setLoadingFacts(true);
    setFacts([]);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulasi loading
      const shuffledFacts = MOCK_DOG_FACTS.sort(() => 0.5 - Math.random());
      const selectedFacts = shuffledFacts.slice(0, count);
      const factsData = selectedFacts.map((fact, index) => ({
        id: `dog-mock-${index}`,
        fact: fact,
        length: fact.length 
      }));
      setFacts(factsData);
    } catch (err) {
      setError('Gagal memuat data fakta anjing (mock).');
      console.error(err);
    } finally {
      setLoadingFacts(false); // <-- INI YANG PENTING
    }
  };

  // Fetch Fakta Kucing (API Asli)
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
    } finally {
      setLoadingFacts(false); // <-- INI YANG PENTING
    }
  };

  // === HANDLER EVENT (Tidak berubah) ===

  const handleSearch = (formData) => {
    const { animalType, breed, imageCount, includeFacts, nickname } = formData;
    setNickname(nickname); 
    setCurrentAnimal(animalType);
    setImages([]); 
    setFacts([]); 
    setError(null); 
    setLastFactParams({ count: imageCount, type: animalType });
    if (animalType === 'dog') {
      fetchDogImages(breed, imageCount);
      if (includeFacts) fetchDogFacts(imageCount); 
    } else { 
      fetchCatImages(breed, imageCount); 
      if (includeFacts) fetchCatFacts(imageCount); 
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
  
  // === RENDER (DENGAN TYPO DIPERBAIKI) ===
  return (
    <Layout style={{ minHeight: '100vh', background: '#f6f7fb' }}>
      <Header /> 
      <Content style={{ padding: '24px 48px' }}>
        <SearchForm 
          onSearch={handleSearch} 
          loading={loadingImages || loadingFacts} 
        />

        {error && (
          <Alert
            message="Terjadi Error"
            description={error}
            type="error"
            showIcon
            style={{ margin: '16px 0' }}
          />
        )}

        {nickname && !loadingImages && !error && (
          <Title level={3} style={{ textAlign: 'center', margin: '24px 0', color: '#5A4BFF' }}>
            Hai {nickname}, ini dia hasil untukmu!
          </Title>
        )}

        {/* Galeri Gambar */}
        <Title level={2} style={{ borderBottom: '2px solid #7A6AFF', paddingBottom: '8px' }}>
          Galeri Gambar
        </Title> {/* <-- TYPO 'SignatureTitle' DIPERBAIKI */}
        <Spin spinning={loadingImages} tip="Memuat gambar...">
          <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
            {images.map(image => (
              <Col key={image.id} xs={24} sm={12} md={8} lg={6}>
                <DetailCard
                  imageUrl={image.url}
                  onFavorite={handleFavorite}
                  isFavorite={isFavorite(image.url)}
                />
              </Col>
            ))}
          </Row>
        </Spin>

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
          <section style={{ marginTop: '3rem' }}>
            <Title level={2} style={{ borderBottom: '2px solid #7A6AFF', paddingBottom: '8px' }}>
              ⭐ Favorit Anda
            </Title> {/* <-- TYPO 'SignatureTitle' DIPERBAIKI */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
              {favorites.map(url => (
                <Col key={url} xs={12} sm={8} md={6} lg={4}>
                  <Card
                    cover={<img alt="Favorite" src={url} style={{ height: '150px', objectFit: 'cover' }} />}
                  />
                </Col>
              ))}
            </Row>
          </section>
        )}
      </Content>
    </Layout>
  );
}

export default App;