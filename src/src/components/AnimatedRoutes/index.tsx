import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
// All views
import ComponentsView from "src/views/ComponentsView";
import DiscoverView from "src/views/DiscoverView";
import AccountView from "src/views/AccountView";
import ChavezView from "src/views/ChavezView";
//
import ParallaxButtonView from 'src/views/ParallaxButtonView';
import FlowStartView from 'src/views/FlowStartView';
// All layouts for nested views
//import VerificationLayout from './VerificationLayout';
// Report flow
import { reportFlowData } from './ReportFlowData';
//
import { useTransition } from 'src/containers/TransitionContext';
import styles from './styles.module.sass';

// Wrapper component to maintain consistent styling
const RouteContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { currentTransition } = useTransition();

  return (
    <motion.div
      {...currentTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Helper function to wrap components with RouteContainer
const withRouteContainer = (Component: React.ComponentType<any>, props?: any) => (
  <RouteContainer className={styles.routeContainer}>
    <Component {...props} />
  </RouteContainer>
);

// Generic flow renderer - accepts components directly
const renderFlow = (flowData: Array<{
  path: string;
  component: React.ComponentType<any>;
  data?: any;
}>) => {
  return flowData.map((route, index) => {
    const Component = route.component;
    return (
      <Route
        key={`route${index}${route.path}`}
        {...(route.path === '/' ? { index: true } : { path: route.path })}
        element={withRouteContainer(Component, route)}
      />
    );
  });
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <div className={styles.routesWrapper}>
      <AnimatePresence initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Flows index -> discover */}
          <Route index element={<Navigate to="discover" replace />} />

          <Route path="components" element={withRouteContainer(ComponentsView)} />
          <Route path="discover" element={withRouteContainer(DiscoverView)} />
          <Route path="account" element={withRouteContainer(AccountView)} />
          <Route path="chavez" element={withRouteContainer(ChavezView)} />
          <Route path="parallax" element={withRouteContainer(ParallaxButtonView)} />
          
          {/* Layout routes (Flows) - nested routes are handled within the layouts */}
          
          {/* Report flow */}
          <Route path="report/*" element={
            <Routes>
              {renderFlow(reportFlowData)}
            </Routes>
          } />
          
          {/* Flow start route */}
          <Route path="flow-start" element={withRouteContainer(FlowStartView, {
            content: "<h1>Welcome to the Flow</h1><p>This is a customizable flow start page.</p>",
            startButtonPath: "/verification/step1",
            startButtonText: "Begin Verification"
          })} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedRoutes;