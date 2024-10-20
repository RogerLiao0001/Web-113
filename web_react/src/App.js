import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls, Stars, Text } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Howl } from "howler";

// 音樂設定
const sound = new Howl({
  src: ['https://www.bensound.com/bensound-music/bensound-theelevatorbossanova.mp3'],
  loop: true,
  volume: 0.5,
  autoplay: false, // 設置為 false，我們將在用戶交互後播放
});

function CustomShaderMaterial() {
  const materialRef = useRef();

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += 0.05;
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
            uniform float uTime;
            void main() {
              vUv = uv;
              vec3 pos = position;
              pos.z += sin(position.x * 10.0 + uTime) * 0.1;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            varying vec2 vUv;
            uniform vec3 uColor;
            uniform float uTime;
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
  const [positions, setPositions] = useState(() => new Float32Array(3000).fill().map(() => (Math.random() - 0.5) * 10));
  const [colors, setColors] = useState(() => new Float32Array(3000).fill().map(() => Math.random()));

  useFrame((state, delta) => {
    ref.current.rotation.y += delta / 4;

    // 更新粒子位置
    const newPositions = positions.slice();
    for (let i = 0; i < newPositions.length; i += 3) {
      newPositions[i] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      newPositions[i + 1] += Math.cos(state.clock.elapsedTime + i) * 0.01;
      newPositions[i + 2] += Math.sin(state.clock.elapsedTime + i) * 0.01;
    }
    setPositions(newPositions);

    // 更新粒子顏色
    const newColors = colors.slice();
    for (let i = 0; i < newColors.length; i++) {
      newColors[i] = Math.sin(state.clock.elapsedTime * 2 + i) * 0.5 + 0.5;
    }
    setColors(newColors);
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent vertexColors size={0.05} sizeAttenuation={true} depthWrite={false} color={0xffffff} />
      <bufferAttribute
        attachObject={['attributes', 'color']}
        count={colors.length / 3}
        array={colors}
        itemSize={3}
        normalized={true}
      />
    </Points>
  );
}

function Instruction() {
  return (
    <Text
      position={[0, 2, 0]}
      color="white"
      fontSize={0.3}  // 增大字體大小
      maxWidth={3}    // 增加最大寬度以適應更大的字體
      lineHeight={1.5}  // 增加行高以提高可讀性
      letterSpacing={0.02}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
    >
      使用滑鼠拖曳移動視角
      使用滾輪縮放
    </Text>
  );
}

function Scene3D() {
  useEffect(() => {
    const handleInteraction = () => {
      if (!sound.playing()) {
        sound.play();
      }
    };
    
    // 監聽多種互動事件
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      sound.stop();
    };
  }, []);

  return (
    <div style={{ height: "calc(100vh - 60px)", overflow: "hidden" }}>
      <Canvas shadowMap camera={{ position: [5, 5, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.2} penumbra={1} intensity={2} castShadow />
        <AnimatedBox />
        <ParticleSystem />
        <OrbitControls />
        <Stars />
        <Instruction />
      </Canvas>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App" style={{
        backgroundImage: 'url("https://npr.brightspotcdn.com/dims4/default/b3a751a/2147483647/strip/true/crop/5120x2880+0+0/resize/1760x990!/format/webp/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F7b%2F6d%2F33133c914d3e9671f037bd67ea34%2Fadobestock-103880786.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}>
        <header style={{ background: 'rgba(51, 51, 51, 0.8)', color: 'white', padding: '10px 0', textAlign: 'center' }}>
          <h1>廖誌晨的網概作業2-React多功能網站</h1>
          <nav>
            <Link to="/" style={{ color: 'white', margin: '0 10px' }}>功能1-3D宇宙粒子</Link>
            <Link to="/feature2" style={{ color: 'white', margin: '0 10px' }}>功能2</Link>
            <Link to="/feature3" style={{ color: 'white', margin: '0 10px' }}>功能3</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Scene3D />} />
          <Route path="/feature2" element={<div>功能2的內容（待開發）</div>} />
          <Route path="/feature3" element={<div>功能3的內容（待開發）</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;