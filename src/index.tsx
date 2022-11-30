/* eslint no-use-before-define: 0 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import App from './app';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';

// Email use aman@pollinate.co

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  environment: process.env.REACT_APP_ENVIRONMENT,
  dsn: 'https://69076cb6a5294f9091ff065fdb2cfb76@o4504247006920704.ingest.sentry.io/4504247008100352',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      ),
    }),
  ],
  tracesSampleRate: process.env.REACT_APP_ENVIRONMENT === 'production' ? 0.2 : 0.5,
  // debug: process.env.REACT_APP_ENVIRONMENT !== "production",
  release: 'fern@ 1.0',
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
