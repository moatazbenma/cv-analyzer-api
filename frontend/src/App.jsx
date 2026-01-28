import { useState } from 'react'
import './App.css'
import WelcomePage from './components/WelcomePage'
import SingleAnalysis from './components/SingleAnalysis'
import useCvAnalysis from './hooks/useCvAnalysis'

function App() {
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome' or 'single'
  const [requiredSkills, setRequiredSkills] = useState("");
  const [roleLevel, setRoleLevel] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [result, setResult] = useState(null);

  const { loading, error, analyzeSingleCv, clearError } = useCvAnalysis();

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    const data = await analyzeSingleCv(requiredSkills, roleLevel, cvFile);
    if (data) {
      setResult(data);
    }
  };

  const resetToWelcome = () => {
    setCurrentView('welcome');
    setResult(null);
    clearError();
    setCvFile(null);
    setRequiredSkills('');
    setRoleLevel('');
  };

  if (currentView === 'welcome') {
    return <WelcomePage onSelectMode={setCurrentView} />;
  }

  if (currentView === 'single') {
    return (
      <SingleAnalysis
        requiredSkills={requiredSkills}
        setRequiredSkills={setRequiredSkills}
        roleLevel={roleLevel}
        setRoleLevel={setRoleLevel}
        cvFile={cvFile}
        setCvFile={setCvFile}
        loading={loading}
        result={result}
        error={error}
        onSubmit={handleSingleSubmit}
        onBack={resetToWelcome}
      />
    );
  }

  return null;
}

export default App

