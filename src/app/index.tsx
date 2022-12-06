import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ApolloProvider } from '@apollo/client';
import Client from 'utils/apolloClient';
import WalletProvider from 'store/WalletContextProvider';
import { WagmiConfig } from 'wagmi';

import PersistState from 'store/PersistState';
import { PageRoutes } from 'utils/config';
import wagmiClient from 'utils/wagmiClient';
import FullPageLoader from './components/FullPageLoader';
import ScrollTop from './components/ScrollTop';
// import PublicRoute from './components/PublicRoute';

import PrivateRoute from './components/PrivateRoute';

import * as Sentry from '@sentry/react';

const Navbar = lazy(() => import('./components/Navbar'));
const DiscoveryPage = lazy(() => import('./pages/Discovery'));
const SignUpForArtist = lazy(() => import('./pages/SignUpForArtist'));
const ArtPreviewScreen = lazy(() => import('./pages/ArtPreviewScreen'));
const Settings = lazy(() => import('./pages/Settings'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const NewProfile = lazy(() => import('./pages/NewProfile'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Post = lazy(() => import('./pages/Post'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const Search = lazy(() => import('./pages/Search'));
const Thankyou = lazy(() => import('./pages/Thankyou'));
const Footer = lazy(() => import('./components/Footer'));

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

function App() {
  return (
    <Sentry.ErrorBoundary
      fallback={
        <p className="grid h-[100vh] w-[100vw] place-content-center bg-black text-2xl text-white">
          Something Went Wrong!
        </p>
      }
      showDialog
    >
      <Suspense fallback={<FullPageLoader />}>
        <BrowserRouter>
          <WagmiConfig client={wagmiClient}>
            <ApolloProvider client={Client}>
              <WalletProvider>
                <PersistState>
                  <ScrollTop />
                  <Navbar />
                  <SentryRoutes>
                    <Route path="/" element={<DiscoveryPage />} />
                    <Route path={PageRoutes.DISCOVERY} element={<DiscoveryPage />} />
                    <Route path={PageRoutes.USER_PROFILE} element={<UserProfile />} />
                    <Route
                      path={PageRoutes.SETTINGS}
                      element={
                        <PrivateRoute>
                          <Settings />
                        </PrivateRoute>
                      }
                    />
                    <Route path={PageRoutes.ART_PREVIEW} element={<ArtPreviewScreen />} />
                    <Route
                      path={PageRoutes.UPLOAD_ART}
                      element={
                        <PrivateRoute>
                          <Post />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path={PageRoutes.SIGN_UP}
                      element={
                        <PrivateRoute>
                          <NewProfile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path={PageRoutes.SIGN_UP_ARTIST}
                      element={
                        <PrivateRoute>
                          <SignUpForArtist />
                        </PrivateRoute>
                      }
                    />
                    <Route path={PageRoutes.PRIVACY_POLICY} element={<PrivacyPolicy />} />
                    <Route path={PageRoutes.THANKYOU} element={<Thankyou />} />
                    <Route path={PageRoutes.SEARCH} element={<Search />} />

                    <Route path="/*" element={<NotFoundPage />} />
                    <Route path={PageRoutes.ERROR_PAGE} element={<ErrorPage />} />
                  </SentryRoutes>
                  <Footer />
                  <Toaster position="top-right" />
                </PersistState>
              </WalletProvider>
            </ApolloProvider>
          </WagmiConfig>
        </BrowserRouter>
      </Suspense>
    </Sentry.ErrorBoundary>
  );
}

export default App;
