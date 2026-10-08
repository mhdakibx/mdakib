import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router/dom";
import router from './routes/Routes'
import { Toaster } from 'react-hot-toast';
import AuthProvider from './contexts/AuthProvider';
import ThemeProvider from './contexts/ThemeProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster/>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
