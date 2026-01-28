import { useState } from 'react';

const useCvAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSingleCv = async (requiredSkills, roleLevel, cvFile) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('required_skills', requiredSkills);
    formData.append('role_level', roleLevel);
    formData.append('cv_file', cvFile);

    try {
      const res = await fetch('http://localhost:8000/api/analyze-cv', {
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