import React, { useRef, useState, useEffect } from "react";
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
  autoplay: true, // 自動播放
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
              vec3 color = vec3(sin(uTime) * 0.5 + 0.5, cos(uTime) * 0.5 + 0.5, sin(uTime + 3.14) * 0.5 + 0.5);
              gl_FragColor = vec4(color, 1.0);
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
  const [colors, setColors] = useState(() => {
    const colors = new Float32Array(3000 * 3);
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = Math.random();
      colors[i + 1] = Math.random();
      colors[i + 2] = Math.random();
    }
    return colors;
  });

  useFrame((state, delta) => {
    ref.current.rotation.y += delta / 2;
    const newColors = colors.slice();
    for (let i = 0; i < newColors.length; i += 3) {
      newColors[i] = Math.random();
      newColors[i + 1] = Math.random();
      newColors[i + 2] = Math.random();
    }
    setColors(newColors);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent vertexColors size={0.05} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

function Instruction() {
  return (
    <Text
      position={[0, 2, 0]}
      color="white"
      fontSize={0.2}
      maxWidth={2}
      lineHeight={1}
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

function App() {
  useEffect(() => {
    sound.play();
  }, []);

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
        }}
      >
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
      </motion.div>
    </div>
  );
}

export default App;