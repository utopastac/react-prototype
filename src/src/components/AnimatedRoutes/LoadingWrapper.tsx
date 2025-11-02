import React, { useEffect } from 'react';
import { useDelayedNavigation } from 'src/hooks/useDelayedNavigation';
import Formblocker, { FormblockerData } from 'src/containers/Formblocker';

interface LoadingWrapperProps {
  data: FormblockerData; // The formblocker data for the loading view
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

  return <Formblocker data={data} />;
};

export default LoadingWrapper; 