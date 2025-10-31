import React from 'react';

// Props: facts (array), onRefresh (function), loading (bool), animalType (string)
const DataTable = ({ facts, onRefresh, loading, animalType }) => {
  if (facts.length === 0 && !loading) return null;

  // Judul dinamis
  const title = animalType === 'dog' ? 'Fakta Anjing' : 'Fakta Kucing';

  return (
    <div className="table-container" style={{ marginTop: '2rem' }}>
      <div className="table-header">
        <h2>{title}</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="refresh-button"
        >
          🔄 Refresh Fakta
        </button>
      </div>
      
      {loading ? (
        <p className="loading-text">Memuat fakta...</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>No.</th>
                <th>Fakta (Bahasa Inggris)</th>
                {/* Kolom DIGANTI KEMBALI menjadi "Panjang (Karakter)" */}
                <th style={{ width: '20%' }}>Panjang (Karakter)</th>
              </tr>
            </thead>
            <tbody>
              {facts.map((fact, index) => (
                <tr key={fact.id}>
                  <td>{index + 1}</td>
                  <td>{fact.fact}</td>
                  {/* Data akan menampilkan "fact.length" */}
                  <td>{fact.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataTable;