import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';


import { AuthProvider } from './context/Auth/AuthProvider.jsx';
import NotificationProvider from './context/Notification/NotificationProvider.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import App from './App.jsx';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>

    <ErrorBoundary >
      <AuthProvider>

        <NotificationProvider>

          <App />

          <ToastContainer
            position="bottom-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnHover
            draggable
            theme="dark"
          />

        </NotificationProvider>

      </AuthProvider>
    </ErrorBoundary>

  </BrowserRouter>,
)
