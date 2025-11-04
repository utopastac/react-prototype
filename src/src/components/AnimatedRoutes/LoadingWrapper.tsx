import React, { useEffect } from 'react';
import { useDelayedNavigation } from 'src/hooks/useDelayedNavigation';
import InterventionScreen, { InterventionScreenData } from 'src/containers/InterventionScreen';

interface LoadingWrapperProps {
  data: InterventionScreenData; // The data for the loading view
  route: string; // The route to navigate to after the delay
  delay?: number; // Optional delay in milliseconds, defaults to 2000
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ data, route, delay = 2000 }) => {
  const navigateWithDelay = useDelayedNavigation();
  
  useEffect(() => {    
    // Set up the delayed navigation
    const cancelNavigation = navigateWithDelay({
      route, 
      delay
    });
    
    // Clean up the navigation if the component unmounts
    return () => {
      cancelNavigation();
    };
  }, [route, delay, navigateWithDelay]);

  return <InterventionScreen data={data} />;
};

export default LoadingWrapper; 