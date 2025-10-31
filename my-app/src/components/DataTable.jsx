import React from 'react';
import { Table, Button, Typography, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const { Title } = Typography;

const DataTable = ({ facts, onRefresh, loading, animalType }) => {
  if (facts.length === 0 && !loading) return null;

  // 1. Definisikan kolom untuk Antd Table
  const columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      render: (text, record, index) => index + 1, // Render nomor
    },
    {
      title: 'Fakta (Bahasa Inggris)',
      dataIndex: 'fact',
      key: 'fact',
    },
    {
      title: 'Panjang (Karakter)',
      dataIndex: 'length',
      key: 'length',
      width: '20%',
      sorter: (a, b) => a.length - b.length, // Tambah fitur sort!
    },
  ];

  // 2. Judul tabel dinamis
  const title = animalType === 'dog' ? 'Fakta Anjing' : 'Fakta Kucing';

  return (
    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', marginTop: '2rem' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '1rem' }}>
          <Title level={3} style={{ margin: 0 }}>{title}</Title>
          <Button
            onClick={onRefresh}
            loading={loading}
            icon={<SyncOutlined />}
          >
            Refresh Fakta
          </Button>
        </Row>
        
        {/* 3. Render Antd Table */}
        <Table
          columns={columns}
          dataSource={facts} // Data harus berupa array of objects
          loading={loading}
          rowKey="id" // Gunakan 'id' unik sebagai key
          pagination={{ pageSize: 5 }} // Tambah fitur pagination!
        />
      </Space>
    </div>
  );
};
// Impor Row
import { Row } from 'antd';
export default DataTable;