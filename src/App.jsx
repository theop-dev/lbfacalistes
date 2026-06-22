import { useState } from 'react';
import Landing from './components/Landing';
import Scanner from './components/Scanner';
import FaceMapPage from './components/FaceMapPage';
import TutorialPage from './components/TutorialPage';

export default function App() {
  const [screen, setScreen]           = useState('landing');
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
        onBack={() => setScreen('landing')}
        onCapture={(data) => { setCaptureData(data); setScreen('facemap'); }}
        onConfirm={(z) => { setZone(z); setScreen('tutorial'); }}
      />
    );

  return <Landing onStart={() => setScreen('scanner')} />;
}
