import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Row, Col, Spin, Alert, Typography, Card, Drawer, Space } from 'antd'; 
import AppHeader from './components/Header.jsx';
import SearchForm from './components/SearchForm.jsx';
import DetailCard from './components/DetailCard.jsx';
import DataTable from './components/DataTable.jsx';
import './App.css';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY;


const MOCK_DOG_FACTS = [
  "Indra penciuman seekor anjing 10.000 kali lebih kuat dari manusia.",
  "Basenji adalah satu-satunya ras anjing yang tidak bisa menggonggong.",
  "Anjing Dalmatian terlahir putih bersih, tanpa bintik.",
  "Cetakan hidung anjing bersifat unik, mirip sidik jari manusia.",
  "Lagu The Beatles 'A Day in the Life' memiliki frekuensi yang hanya bisa didengar anjing.",
  "Suhu tubuh normal anjing lebih tinggi dari manusia, biasanya berkisar antara 38°C hingga 39,2°C (101°F hingga 102.5°F)",
  "Greyhound adalah anjing tercepat di dunia dan dapat berlari dengan kecepatan mencapai 72 km/jam (45 mph) dalam waktu singkat",
  "Anjing memiliki kelopak mata ketiga (disebut nictitating membrane) yang membantu menjaga mata mereka tetap lembap dan terlindungi dari kotoran",
  "Anjing tidak buta warna total; mereka melihat dunia dalam spektrum warna biru dan kuning, tetapi kesulitan membedakan antara merah dan hijau",
  "Anjing memiliki kelenjar keringat di antara bantalan kakinya, tetapi cara utama mereka mendinginkan diri adalah melalui terengah-engah (panting).",
  "Ras anjing Saluki diyakini sebagai salah satu ras tertua, dengan gambaran mereka muncul di makam Mesir kuno yang berasal dari tahun 2100 SM.",
  "Tidak semua anjing bisa berenang secara alami; ras seperti Basset Hound dan Bulldog seringkali kesulitan berenang karena struktur tubuhnya.",
  "Anak anjing dilahirkan dalam keadaan buta dan tuli; mereka baru mulai membuka mata dan mendengar pada usia sekitar dua minggu.",
  "Anjing tidak suka dipeluk erat; banyak anjing menganggap pelukan erat sebagai tanda dominasi atau ancaman, bukan kasih sayang.",
  "Cokelat beracun bagi anjing karena mengandung zat theobromine, yang tidak dapat mereka metabolisme seperti halnya manusia.",
  "Saat anjing menguap, itu tidak selalu berarti mereka lelah; menguap juga bisa menjadi tanda bahwa mereka sedang merasa cemas atau stres.",
  "Penelitian menunjukkan bahwa anjing dapat merasakan kecemburuan, terutama ketika pemiliknya memberikan perhatian kepada anjing lain atau bahkan benda mati.",
  "Tiga anjing selamat dari tenggelamnya kapal Titanic."
];

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [facts, setFacts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentAnimal, setCurrentAnimal] = useState('');
  const [nickname, setNickname] = useState(''); 
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingFacts, setLoadingFacts] = useState(false);
  const [error, setError] = useState(null);
  const [lastFactParams, setLastFactParams] = useState({ count: 5, type: 'cat' });

  useEffect(() => {
    const storedFavorites = localStorage.getItem('animalFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('animalFavorites', JSON.stringify(favorites));
  }, [favorites]);


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
      setLoadingImages(false);
    }
  };

  const fetchCatImages = async (breed, count) => {
    setLoadingImages(true);
    setError(null);
    let url = `https://api.thecatapi.com/v1/images/search?limit=${count}`;
    if (breed !== 'random') {
      url += `&breed_ids=${breed}`;
    }
    try {
      const response = await axios.get(url, { headers: { 'x-api-key': CAT_API_KEY } });
      
      let finalImages = response.data;
      if (breed !== 'random' && finalImages.length > count) {
        finalImages = finalImages.slice(0, count);
      }
      setImages(finalImages); 

    } catch (err) {
      setError('Gagal mengambil data gambar kucing. Pastikan API Key valid.');
      console.error(err);
    } finally {
      setLoadingImages(false);
    }
  };

  const fetchDogFacts = async (count) => {
    setLoadingFacts(true);
    setFacts([]);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
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
      setLoadingFacts(false);
    }
  };

  const fetchCatFacts = async (count) => {
    setLoadingFacts(true);
    setFacts([]);
    try {
      const cacheBuster = `&_=${new Date().getTime()}`;
      const response = await axios.get(`https://catfact.ninja/facts?limit=${count}${cacheBuster}`);

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
      setLoadingFacts(false);
    }
  };

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
  
  return (
    <Layout style={{ minHeight: '100vh', background: '#f6f7fb' }}>
      <AppHeader onFavoritesClick={() => setDrawerOpen(true)} />
      
      <Layout>
        <Sider 
          width={350} 
          style={{ 
            background: '#f6f7fb', 
            borderRight: '1px solid #f0f0f0'
          }}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <div style={{ padding: '24px' }}>
            <Card style={{ borderRadius: '12px' }}>
              <Title level={4}>Let's Find Your Pet!</Title>
              <SearchForm 
                onSearch={handleSearch} 
                loading={loadingImages || loadingFacts} 
              />
            </Card>
          </div>
        </Sider>
        
        <Content style={{ padding: '24px 48px' }} className="main-content">
          
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
            <Title level={3} style={{ textAlign: 'center', margin: '24px 0', color: '#fa8c16' }}>
              Hai {nickname}, ini dia hasil untukmu!
            </Title>
          )}

          <Title level={2} style={{ borderBottom: '2px solid #fa8c16', paddingBottom: '8px' }}>
            Galeri Hewan
          </Title>
          <Spin spinning={loadingImages} tip="Memuat gambar...">
            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
              {images.map(image => (
                <Col key={image.id} xs={24} sm={12} md={8} lg={8}>
                  <DetailCard
                    imageUrl={image.url}
                    onFavorite={handleFavorite}
                    isFavorite={isFavorite(image.url)}
                  />
                </Col>
              ))}
            </Row>
          </Spin>

          {(facts.length > 0 || loadingFacts) && (
            <DataTable
              facts={facts}
              onRefresh={handleRefreshFacts}
              loading={loadingFacts}
              animalType={currentAnimal} 
            />
          )}
        </Content>
      </Layout>
      
      <Drawer
        title="Favorit Anda"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {favorites.length > 0 ? (
            favorites.map(url => (
              <Card
                key={url}
                cover={<img alt="Favorite" src={url} style={{ height: '150px', objectFit: 'cover' }} />}
              />
            ))
          ) : (
            <Text>Anda belum memiliki favorit.</Text>
          )}
        </Space>
      </Drawer>
    </Layout>
  );
}

export default App;