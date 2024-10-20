import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Calculator from './Calculator';
import Function2 from './Function2'; // 引入 Function2 組件

function App() {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'calculator':
        return <Calculator />;
      case 'function2':
        return <Function2 />;
      // 將來可以新增更多 case 來渲染其他組件
      // case 'function3':
      //   return <Function3 />;
      // case 'function4':
      //   return <Function4 />;
      default:
        return null;
    }
  };

  return (
    <Router>
      <div style={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh'
      }}>
        <h1>廖誌晨作業2 超級多功能網站</h1>
        <div>
          <button onClick={() => setActiveComponent('calculator')} style={{ margin: '10px', padding: '10px 20px' }}>
            功能1: 計算機
          </button>
          <button onClick={() => setActiveComponent('function2')} style={{ margin: '10px', padding: '10px 20px' }}>
            功能2: 3D宇宙模擬
          </button>
          <button onClick={() => setActiveComponent('function3')} style={{ margin: '10px', padding: '10px 20px' }}>
            功能3: NFT API
          </button>
          <button onClick={() => setActiveComponent('function4')} style={{ margin: '10px', padding: '10px 20px' }}>
            功能4: 還在想的功能
          </button>
        </div>
        {renderComponent()}
      </div>
    </Router>
  );
}

export default App;
