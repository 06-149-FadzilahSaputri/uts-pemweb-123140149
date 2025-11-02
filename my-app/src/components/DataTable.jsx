import React from 'react';
import { Table, Button, Typography, Space, Row, Tag } from 'antd'; 
import { SyncOutlined, ExperimentOutlined } from '@ant-design/icons';

const { Title } = Typography;


const getFactReaction = (length) => {
  if (length < 75) return <Tag color="blue">Oke 👍</Tag>;
  if (length < 100) return <Tag color="green">Menarik 🤓</Tag>;
  if (length < 115) return <Tag color="geekblue">Astaga 😮</Tag>;
  if (length < 155) return <Tag color="purple">Wow 🤯</Tag>;
  return <Tag color="volcano">Luar Biasa! 📜</Tag>;
};

const DataTable = ({ facts, onRefresh, loading, animalType }) => {
  if (facts.length === 0 && !loading) return null;

  
  const columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      render: (text, record, index) => index + 1, 
    },
    {
      title: 'Fakta',
      dataIndex: 'fact',
      key: 'fact',
    },
    {
      title: 'Reaksi', 
      key: 'reaction',
      width: '20%',
      
      render: (record) => getFactReaction(record.length),
      
      sorter: (a, b) => a.length - b.length,
    },
  ];

  
  const title = animalType === 'dog' ? 'Fakta Anjing Luar Biasa' : 'Fakta Kucing Luar Biasa';

  return (
    <div style={{ 
      background: '#fff', 
      padding: '24px', 
      borderRadius: '12px', 
      marginTop: '2rem', 
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
    }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '1rem' }}>
          <Title level={3} style={{ margin: 0, color: '#fa8c16' }}>
            <ExperimentOutlined style={{ marginRight: '10px' }} />
            {title}
          </Title>
          <Button
            onClick={onRefresh}
            loading={loading}
            icon={<SyncOutlined />}
          >
            Refresh Fakta
          </Button>
        </Row>
        
        
        <Table
          columns={columns}
          dataSource={facts} 
          loading={loading}
          rowKey="id" 
          pagination={{ pageSize: 5 }} 
        />
      </Space>
    </div>
  );
};

export default DataTable;