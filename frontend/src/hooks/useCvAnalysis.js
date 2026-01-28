import { useState } from 'react';

const useCvAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get API URL from environment variable, default to localhost for development
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const analyzeSingleCv = async (requiredSkills, roleLevel, cvFile) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('required_skills', requiredSkills);
    formData.append('role_level', roleLevel);
    formData.append('cv_file', cvFile);

    try {
      const res = await fetch(`${API_URL}/api/analyze-cv`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || data.status !== 'success') {
        setError(data.error || data.message || 'Unknown error');
        return null;
      }
      return data;
    } catch (err) {
      setError('Network error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    analyzeSingleCv,
    clearError: () => setError(null)
  };
};

export default useCvAnalysis;