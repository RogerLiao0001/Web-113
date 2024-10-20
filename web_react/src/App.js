import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Howl } from "howler"; // 載入音效庫

// 音樂設定
const sound = new Howl({
  src: ['https://www.bensound.com/bensound-music/bensound-theelevatorbossanova.mp3'],
  loop: true, // 使音樂循環
  volume: 0.5, // 設定音量
});

// 自訂 Shader Material
function CustomShaderMaterial() {
  const materialRef = useRef();

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += 0.05; // 讓時間參數持續增加
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      args={[
        {
          uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(0x44aa88) },
          },
          vertexShader: `
            varying vec2 vUv;
            uniform float uTime; // 定義uTime
            void main() {
              vUv = uv;
              vec3 pos = position;
              pos.z += sin(position.x * 10.0 + uTime) * 0.1; // 水波效果
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            varying vec2 vUv;
            uniform vec3 uColor;
            void main() {
              gl_FragColor = vec4(uColor, 1.0);
            }
          `,
        },
      ]}
    />
  );
}

function AnimatedBox() {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <CustomShaderMaterial />
    </mesh>
  );
}

function ParticleSystem() {
  const ref = useRef();
  const [sphere] = useState(() => new Float32Array(3000).fill().map(() => (Math.random() - 0.5) * 5));
  const colors = new Float32Array(3000 * 3); // 使用 Float32Array 來存儲顏色
  for (let i = 0; i < colors.length; i += 3) {
    colors[i] = Math.random();    // R
    colors[i + 1] = Math.random(); // G
    colors[i + 2] = Math.random(); // B
  }

  useFrame((state, delta) => {
    ref.current.rotation.y += delta / 2; // 使粒子系統隨時間旋轉
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = Math.random();    // 隨機更新顏色 R
      colors[i + 1] = Math.random(); // 隨機更新顏色 G
      colors[i + 2] = Math.random(); // 隨機更新顏色 B
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent vertexColors={true} size={0.05} sizeAttenuation={true} depthWrite={false} color={0xffffff} vertexColors={colors} />
      </Points>
    </group>
  );
}

function App() {
  const [musicPlaying, setMusicPlaying] = useState(false); // 用於追蹤音樂播放狀態

  const handlePlayMusic = () => {
    sound.play();
    setMusicPlaying(true);
  };

  return (
    <div className="App" style={{ height: "100vh", overflow: "hidden" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="canvas-container"
        style={{
          backgroundImage: 'url("https://npr.brightspotcdn.com/dims4/default/b3a751a/2147483647/strip/true/crop/5120x2880+0+0/resize/1760x990!/format/webp/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F7b%2F6d%2F33133c914d3e9671f037bd67ea34%2Fadobestock-103880786.jpeg")',
          backgroundSize: 'cover',
          position: 'relative',
          width: '100%',
          height: '100%',
        }} // 替換為你的宇宙背景圖片
      >
        <button onClick={handlePlayMusic} style={{ position: "absolute", zIndex: 10, color: 'white', background: 'rgba(0,0,0,0.5)', padding: '10px', border: 'none', borderRadius: '5px' }}>播放音樂</button> {/* 播放音樂的按鈕 */}
        <Canvas shadowMap camera={{ position: [5, 5, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} castShadow />
          <spotLight position={[-10, 10, 10]} angle={0.2} penumbra={1} intensity={2} castShadow />
          <AnimatedBox />
          <ParticleSystem />
          <OrbitControls />
          <Stars />
        </Canvas>
      </motion.div>
    </div>
  );
}

export default App;
