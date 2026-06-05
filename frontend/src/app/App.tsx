import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Simuler le chargement de l'application
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Attendre la fin de la transition avant de retirer le composant
      setTimeout(() => {
        setShowLoader(false);
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showLoader && <LoadingScreen isVisible={isLoading} />}
      <RouterProvider router={router} />
    </>
  );
}