import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { UIKitPage } from './pages/UIKitPage';
import { MapPage } from './pages/MapPage';
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/ui-kit" element={<UIKitPage prototype />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
