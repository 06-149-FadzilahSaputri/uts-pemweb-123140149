import React from 'react';
import { Layout, Typography } from 'antd';
import { ApiOutlined } from '@ant-design/icons'; // Impor ikon

const { Header } = Layout;
const { Title } = Typography;

const AppHeader = () => {
  return (
    <Header style={{ display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg, #7A6AFF, #5A4BFF)' }}>
      <Title level={2} style={{ color: 'white', margin: 0 }}>
        <ApiOutlined style={{ marginRight: '12px' }} />
        Galeri Fakta Hewan
      </Title>
    </Header>
  );
};

export default AppHeader;