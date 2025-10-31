import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Radio, Select, InputNumber, Input, Checkbox, Button } from 'antd';

const { Option } = Select;

const SearchForm = ({ onSearch, loading }) => {
  const [form] = Form.useForm();
  const [animalType, setAnimalType] = useState('dog');

  // State untuk list breed
  const [dogBreeds, setDogBreeds] = useState([]);
  const [catBreeds, setCatBreeds] = useState([]);
  const [loadingBreeds, setLoadingBreeds] = useState(false);

  // Fetch breed list
  useEffect(() => {
    const fetchAllBreeds = async () => {
      setLoadingBreeds(true);
      try {
        const dogRes = await axios.get('https://dog.ceo/api/breeds/list/all');
        setDogBreeds(Object.keys(dogRes.data.message));
        
        const catRes = await axios.get('https://api.thecatapi.com/v1/breeds');
        setCatBreeds(catRes.data);
      } catch (error) {
        console.error("Failed to fetch breeds:", error);
      }
      setLoadingBreeds(false);
    };
    fetchAllBreeds();
  }, []);

  // Handle form submission
  const handleSubmit = (values) => {
    onSearch(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        animalType: 'dog',
        breed: 'random',
        imageCount: 5,
        includeFacts: true,
      }}
      style={{ 
        background: '#ffffff', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
      }}
    >
      <Row gutter={24}>
        {/* Kolom 1: Tipe Hewan & Breed */}
        <Col xs={24} md={8}>
          <Form.Item
            name="animalType"
            label="1. Pilih Hewan:"
          >
            <Radio.Group onChange={(e) => setAnimalType(e.target.value)}>
              <Radio.Button value="dog">Anjing (Dog)</Radio.Button>
              <Radio.Button value="cat">Kucing (Cat)</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="breed"
            label="2. Pilih Breed:"
          >
            <Select
              showSearch
              loading={loadingBreeds}
              placeholder="Pilih breed"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="random" label="Random (Acak)">Random (Acak)</Option>
              {animalType === 'dog' && dogBreeds.map(breed => (
                <Option key={breed} value={breed} label={breed}>{breed}</Option>
              ))}
              {animalType === 'cat' && catBreeds.map(breed => (
                <Option key={breed.id} value={breed.id} label={breed.name}>{breed.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Kolom 2: Jumlah & Nama */}
        <Col xs={24} md={8}>
          <Form.Item
            name="imageCount"
            label="3. Jumlah Gambar:"
            rules={[{ required: true, message: 'Harap isi jumlah!' }]}
          >
            <InputNumber min={1} max={20} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="4. Nama Panggilan Anda:"
            rules={[{ required: true, message: 'Harap isi nama panggilan!' }]}
          >
            <Input placeholder="Mimi" />
          </Form.Item>
        </Col>

        {/* Kolom 3: Checkbox & Tombol */}
        <Col xs={24} md={8}>
          <Form.Item name="includeFacts" valuePropName="checked" label="5. Tampilkan Fakta?">
            <Checkbox>Tampilkan Fakta Hewan?</Checkbox>
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit" loading={loading} block style={{ background: '#7A6AFF' }}>
              Tampilkan Galeri
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;