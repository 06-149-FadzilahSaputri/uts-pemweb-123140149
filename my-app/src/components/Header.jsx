import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { DatabaseOutlined, StarOutlined } from '@ant-design/icons';
import logoPaw from '../assets/logo-paw.png';

const { Header } = Layout;
const { Title } = Typography;

const AppHeader = ({ onFavoritesClick }) => {
  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      background: '#fff', 
      borderBottom: '1px solid #f0f0f0' 
    }}>
      {/* Logo di Kiri */}
      <Title level={3} style={{ color: '#fa8c16', margin: 0, display: 'flex', alignItems: 'center' }}>
  {/* Gunakan 'logoPaw' yang sudah Anda impor */}
  <img 
    src={logoPaw} 
    alt="Logo Jejak Hewan" 
    style={{ 
      marginRight: '10px', 
      height: '30px', /* Anda bisa sesuaikan ukurannya */
      width: '30px'   /* Sesuaikan agar proporsional */
    }} 
  />
  Galeri Fakta Hewan
</Title>
      
      {/* Tombol di Kanan */}
      <Button 
        type="primary" 
        icon={<StarOutlined />}
        onClick={onFavoritesClick}
        style={{ background: '#fa8c16', borderColor: '#fa8c16' }}
      >
        Favorit
      </Button>
    </Header>
  );
};

export default AppHeader;