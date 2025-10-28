import React from 'react';

const DetailCard = ({ imageUrl, onFavorite, isFavorite }) => {
  
  const buttonClasses = `favorite-button ${isFavorite ? 'active' : ''}`;

  return (
    <div className="card">
      <img src={imageUrl} alt="Animal" />
      <button
        onClick={() => onFavorite(imageUrl)}
        className={buttonClasses}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        ❤️
      </button>
    </div>
  );
};

export default DetailCard;