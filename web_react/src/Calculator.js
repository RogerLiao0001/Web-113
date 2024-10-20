import React, { useState } from 'react';

function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);

  const calculate = (expression) => {
    try {
      const sanitizedExpression = expression
        .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/(\d+)\^(\d+)/g, 'Math.pow($1, $2)');
      return eval(sanitizedExpression);
    } catch (error) {
      return "Error";
    }
  };

  const handleCalculate = () => {
    const computedResult = calculate(input);
    setResult(computedResult.toString());
    if (computedResult !== "Error") {
      setHistory([...history, { expression: input, result: computedResult }]);
    }
  };

  const handleScientificFunction = (func) => {
    setInput((prevInput) => `${func}(${prevInput})`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCalculate();
    }
  };

  const handleExport = () => {
    const element = document.createElement("a");
    const file = new Blob([history.map(entry => `${entry.expression} = ${entry.result}`).join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "history.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'calc(100vh - 60px)',
      backgroundColor: 'white'
    }}>
      <h2>簡易計算機</h2>
      <p>使用說明：請在下方輸入框中輸入數學表達式，例如：2 + 2、(3 + 5) * 2、sqrt(16)、3^2等，然後按計算按鈕。</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ fontSize: '18px', padding: '10px', marginBottom: '10px', width: '300px' }}
      />
      <button onClick={handleCalculate} style={{ fontSize: '18px', padding: '10px 20px', marginBottom: '10px' }}>
        計算
      </button>
      <div>
        <button onClick={() => handleScientificFunction('sqrt')} style={{ marginRight: '5px' }}>平方根</button>
        <button onClick={() => handleScientificFunction('Math.sin')} style={{ marginRight: '5px' }}>sin</button>
        <button onClick={() => handleScientificFunction('Math.cos')} style={{ marginRight: '5px' }}>cos</button>
        <button onClick={() => handleScientificFunction('Math.tan')} style={{ marginRight: '5px' }}>tan</button>
      </div>
      {result && <div style={{ marginTop: '20px', fontSize: '24px' }}>結果: {result}</div>}
      <h3>歷史記錄</h3>
      <div style={{ maxHeight: '200px', overflowY: 'scroll', width: '300px' }}>
        {history.map((entry, index) => (
          <div key={index}>
            {entry.expression} = {entry.result}
          </div>
        ))}
      </div>
      <button onClick={handleExport} style={{ fontSize: '18px', padding: '10px 20px', marginTop: '10px' }}>
        匯出歷史記錄
      </button>
    </div>
  );
}

export default Calculator;
