import React from 'react';

const DataTable = ({ facts, onRefresh, loading }) => {
  if (facts.length === 0 && !loading) return null;

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Fakta Kucing</h2>
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
                <th>Fakta</th>
                <th style={{ width: '20%' }}>Panjang (Karakter)</th>
              </tr>
            </thead>
            <tbody>
              {facts.map((fact, index) => (
                <tr key={fact.fact_id || index}>
                  <td>{index + 1}</td>
                  <td>{fact.fact}</td>
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