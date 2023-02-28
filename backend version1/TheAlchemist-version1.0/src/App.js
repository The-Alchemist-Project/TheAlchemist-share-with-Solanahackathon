import React, { useState } from 'react';
import GenericChart from './components/generic-chart';
import WatchList from './components/watch-list';
import AnalyzeModel from './components/analyze-model';
import { SCALE } from '../src/shared/ext';

import './App.css';

function App() {
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [model, setModel] = useState(null);

  const handleSymbolChange = newSymbol => {
    setSymbol(newSymbol);
    setModel(null);
    localStorage.removeItem(SCALE);
  }

  return (
    <div className="container-dev">
      <div className="chart-wrapper">
        <GenericChart symbol={symbol} setModel={value => setModel(value)} />
      </div>
      <div className="model-wrapper">{model && <AnalyzeModel symbol={symbol} model={model} />}</div>
      <div className="watch-list-wrapper">
        <WatchList symbol={symbol} updateSymbol={value => handleSymbolChange(value)} />
      </div>
    </div>
  );
}

export default App;

