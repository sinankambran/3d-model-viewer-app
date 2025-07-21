import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";

const Model = ({ url }) => {
  if (!url) {
    console.warn("Model URL is undefined or invalid.");
    return null;
  }

  const { scene } = useGLTF(url);
  scene.scale.set(1.5, 1.5, 1.5);
  scene.position.set(0, -1, 0);
  return <primitive object={scene} dispose={null} />;
};

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="w-28 h-28 bg-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-600 shadow">
        Loading {Math.floor(progress)}%
      </div>
    </Html>
  );
};

const ModelViewer = ({ modelUrl }) => {
  if (!modelUrl) {
    return (
      <div className="w-full h-[400px] sm:h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
        <p className="text-gray-500 text-sm">No model available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] sm:h-[500px] rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 2]} />
        <Suspense fallback={<Loader />}>
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls enableZoom enablePan enableRotate />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
