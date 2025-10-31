import React from 'react';
import { Card, Button, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

const DetailCard = ({ imageUrl, onFavorite, isFavorite }) => {
  return (
    <Card
      hoverable
      cover={<img alt="Animal" src={imageUrl} style={{ height: '250px', objectFit: 'cover' }} />}
      actions={[
        <Tooltip title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}>
          <Button
            type="text"
            danger={isFavorite}
            icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
            onClick={() => onFavorite(imageUrl)}
          />
        </Tooltip>
      ]}
    />
  );
};

export default DetailCard;