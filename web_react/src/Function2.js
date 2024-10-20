// Function2.js
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import { Howl } from "howler";

const sound = new Howl({
  src: ['https://www.bensound.com/bensound-music/bensound-theelevatorbossanova.mp3'],
  loop: true,
  volume: 0.5,
  autoplay: false,
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
      args={[{
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
      }]}
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
    const newPositions = positions.slice();
    for (let i = 0; i < newPositions.length; i += 3) {
      newPositions[i] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      newPositions[i + 1] += Math.cos(state.clock.elapsedTime + i) * 0.01;
      newPositions[i + 2] += Math.sin(state.clock.elapsedTime + i) * 0.01;
    }
    setPositions(newPositions);
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
      fontSize={0.3}
      maxWidth={3}
      lineHeight={1.5}
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

function Function2() {
    useEffect(() => {
      const handleInteraction = () => {
        if (!sound.playing()) {
          sound.play();
        }
      };
  
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
      <div
        style={{
          height: "calc(100vh - 60px)",
          overflow: "hidden",
          backgroundImage: `url('https://npr.brightspotcdn.com/dims4/default/b3a751a/2147483647/strip/true/crop/5120x2880+0+0/resize/1760x990!/format/webp/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F7b%2F6d%2F33133c914d3e9671f037bd67ea34%2Fadobestock-103880786.jpeg')`, // 背景圖片
          backgroundSize: "cover", // 背景大小調整為全覆蓋
          backgroundPosition: "center", // 背景居中顯示
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
      </div>
    );
  }
  
export default Function2;
