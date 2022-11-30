import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ApolloProvider } from '@apollo/client';
import Client from 'utils/apolloClient';

import WalletProvider from 'store/WalletContextProvider';

import Navbar from './components/Navbar';
import SignUpForArtist from './pages/SignUpForArtist';
import Footer from './components/Footer';
import { WagmiConfig } from 'wagmi';
import ArtPreviewScreen from './pages/ArtPreviewScreen';
import DiscoveryPage from './pages/Discovery';

import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';

import PersistState from 'store/PersistState';
import { PageRoutes } from 'utils/config';
import wagmiClient from 'utils/wagmiClient';
import FullPageLoader from './components/FullPageLoader';
import ScrollTop from './components/ScrollTop';
import NewProfile from './pages/NewProfile';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Post from './pages/Post';
import PublicRoute from './components/PublicRoute';
import Thankyou from './pages/Thankyou';
import PrivateRoute from './components/PrivateRoute';
import ErrorPage from './pages/ErrorPage';
import Search from './pages/Search';
import * as Sentry from '@sentry/react';

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
