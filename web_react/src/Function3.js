import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// 註冊 Chart.js 模組
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Function3() {
  const [rainData, setRainData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 發送 API 請求
  const fetchRainData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-C14C19EC-A1A9-4307-89FD-021AFE1D35A8&format=JSON&locationName=%E8%87%BA%E5%8C%97%E5%B8%82&elementName=PoP&sort=time'
      );

      const locationData = response.data.records.location[0];
      const rainForecast = locationData.weatherElement[0].time;

      // 擷取時間與降雨機率
      const labels = rainForecast.map(item => {
        const date = item.startTime.split(' ')[0].slice(5);  // 提取日期 (例如 10/21)
        const time = item.startTime.split(' ')[1].slice(0, 5);  // 提取時間 (例如 00:00)
        return `${date} ${time}`;  // 將日期和時間合併成標籤 (例如 "10/21 00:00")
      });

      const rainChances = rainForecast.map(item => parseInt(item.parameter.parameterName, 10));

      // 設置折線圖的資料
      setRainData({
        labels: labels, // X 軸日期+時間
        datasets: [
          {
            label: '降雨機率 (%)',
            data: rainChances, // Y 軸降雨機率
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.2, // 平滑曲線
          },
        ],
      });
    } catch (error) {
      console.error('無法獲取資料:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>臺北市未來 36 小時降雨機率</h2>
      <button onClick={fetchRainData} style={{ padding: '10px 20px', margin: '20px 0', fontSize: '16px' }}>
        {loading ? '資料加載中...' : '取得降雨機率'}
      </button>
      
      {/* 如果有資料則顯示圖表 */}
      {rainData && (
        <div style={{ width: '80%', margin: '0 auto' }}>
          <Line data={rainData} options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,  // 設置 y 軸範圍為 0-100
                title: {
                  display: true,
                  text: '降雨機率 (%)',
                },
              },
              x: {
                title: {
                  display: true,
                  text: '時間',
                },
              },
            },
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: '未來 36 小時降雨機率 (資料來源：中央氣象局)' },
            },
          }} />
        </div>
      )}
    </div>
  );
}

export default Function3;
