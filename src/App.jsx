import { useState } from 'react';
import Landing from './components/Landing';
import Scanner from './components/Scanner';
import TutorialPage from './components/TutorialPage';

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [zone, setZone] = useState(null);

  if (screen === 'tutorial' && zone) {
    return (
      <TutorialPage
        zone={zone}
        onBack={() => setScreen('scanner')}
      />
    );
  }

  if (screen === 'scanner') {
    return (
      <Scanner
        onBack={() => setScreen('landing')}
        onConfirm={(z) => { setZone(z); setScreen('tutorial'); }}
      />
    );
  }

  return <Landing onStart={() => setScreen('scanner')} />;
}
