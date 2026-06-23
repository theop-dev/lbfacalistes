import { useState } from 'react';
import Landing from './components/Landing';
import ModeSelectPage from './components/ModeSelectPage';
import Scanner from './components/Scanner';
import FaceMapPage from './components/FaceMapPage';
import TutorialPage from './components/TutorialPage';

export default function App() {
  const [screen, setScreen]           = useState('landing');
  const [scanMode, setScanMode]       = useState('tap');  // 'tap' | 'hover'
  const [zone, setZone]               = useState(null);
  const [captureData, setCaptureData] = useState(null);

  if (screen === 'tutorial' && zone)
    return (
      <TutorialPage
        zone={zone}
        onBack={() => setScreen(captureData ? 'facemap' : 'scanner')}
      />
    );

  if (screen === 'facemap' && captureData)
    return (
      <FaceMapPage
        captureData={captureData}
        onBack={() => setScreen('scanner')}
        onZoneSelect={(z) => { setZone(z); setScreen('tutorial'); }}
      />
    );

  if (screen === 'scanner')
    return (
      <Scanner
        mode={scanMode}
        onBack={() => setScreen('mode-select')}
        onCapture={(data) => { setCaptureData(data); setScreen('facemap'); }}
        onConfirm={(z) => { setZone(z); setScreen('tutorial'); }}
      />
    );

  if (screen === 'mode-select')
    return (
      <ModeSelectPage
        onSelect={(m) => { setScanMode(m); setScreen('scanner'); }}
        onBack={() => setScreen('landing')}
      />
    );

  return <Landing onStart={() => setScreen('mode-select')} />;
}
