import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ import provider

// Replace this with your actual Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "802288984380-ahu89dasvuda20r9vql2cp1t8emq6hjv.apps.googleusercontent.com";

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "http://127.0.0.1:8000";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
