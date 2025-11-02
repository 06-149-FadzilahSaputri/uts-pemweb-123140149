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
    >
      <Form.Item
        name="animalType"
        label="Tipe Peliharaan"
      >
        <Radio.Group 
          onChange={(e) => setAnimalType(e.target.value)} 
          buttonStyle="solid"
        >
          <Radio.Button value="dog">Anjing</Radio.Button>
          <Radio.Button value="cat">Kucing</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="breed"
        label="Ras"
      >
        <Select
          showSearch
          loading={loadingBreeds}
          placeholder="Pilih ras"
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

      <Form.Item
        name="nickname"
        label="Nama Panggilan Anda"
        rules={[{ required: true, message: 'Harap isi nama panggilan!' }]}
      >
        <Input placeholder="Contoh: Zila" />
      </Form.Item>

      <Form.Item
        name="imageCount"
        label="Jumlah Gambar & Fakta"
        rules={[{ required: true, message: 'Harap isi jumlah!' }]}
      >
        <InputNumber min={1} max={20} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="includeFacts" valuePropName="checked">
        <Checkbox>Tampilkan Tabel Fakta</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading} 
          block 
          style={{ background: '#fa8c16', borderColor: '#fa8c16' }}
        >
          Tampilkan
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SearchForm;