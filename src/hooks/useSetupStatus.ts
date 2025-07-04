import { useState, useEffect } from 'react';

export default function useSetupStatus() {
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage for a flag indicating first time setup is done
    const flag = typeof window !== 'undefined' ? localStorage.getItem('setupComplete') : null;
    setIsSetupComplete(flag === 'true');
  }, []);

  const markComplete = () => {
    localStorage.setItem('setupComplete', 'true');
    setIsSetupComplete(true);
  };

  return { isSetupComplete, markComplete };
}
