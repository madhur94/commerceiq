import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { LoadingState } from '@/components/common/LoadingState';

// Route-level code splitting for performance budget adherence
const OverviewView = lazy(() =>
  import('@/views/OverviewView').then((m) => ({ default: m.OverviewView }))
);
const SalesIntelligenceView = lazy(() =>
  import('@/views/SalesIntelligenceView').then((m) => ({ default: m.SalesIntelligenceView }))
);
const CustomerIntelligenceView = lazy(() =>
  import('@/views/CustomerIntelligenceView').then((m) => ({ default: m.CustomerIntelligenceView }))
);
const DataExplorerView = lazy(() =>
  import('@/views/DataExplorerView').then((m) => ({ default: m.DataExplorerView }))
);
const MLInsightsView = lazy(() =>
  import('@/views/MLInsightsView').then((m) => ({ default: m.MLInsightsView }))
);
const DataPipelineView = lazy(() =>
  import('@/views/DataPipelineView').then((m) => ({ default: m.DataPipelineView }))
);
const NotFoundView = lazy(() =>
  import('@/views/NotFoundView').then((m) => ({ default: m.NotFoundView }))
);

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingState message="Initializing module telemetry..." />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <OverviewView />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'sales-intelligence',
        element: (
          <SuspenseWrapper>
            <SalesIntelligenceView />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'customer-intelligence',
        element: (
          <SuspenseWrapper>
            <CustomerIntelligenceView />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'data-explorer',
        element: (
          <SuspenseWrapper>
            <DataExplorerView />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'ml-insights',
        element: (
          <SuspenseWrapper>
            <MLInsightsView />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'data-pipeline',
        element: (
          <SuspenseWrapper>
            <DataPipelineView />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'sales',
        element: <Navigate to="/sales-intelligence" replace />,
      },
      {
        path: 'customers',
        element: <Navigate to="/customer-intelligence" replace />,
      },
      {
        path: 'explorer',
        element: <Navigate to="/data-explorer" replace />,
      },
      {
        path: 'ml',
        element: <Navigate to="/ml-insights" replace />,
      },
      {
        path: 'pipeline',
        element: <Navigate to="/data-pipeline" replace />,
      },
      {
        path: '404',
        element: (
          <SuspenseWrapper>
            <NotFoundView />
          </SuspenseWrapper>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);
