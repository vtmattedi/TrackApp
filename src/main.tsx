import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "leaflet/dist/leaflet.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router-dom";
import Map from './Pages/MapPage.tsx';
import Layout from './Layout.tsx';
import Home from './Pages/Home.tsx';
import Login from './Pages/Login.tsx';
import { GlobalProvider } from './Providers/GlobalCtx.tsx';
import { AlertProvider } from './Providers/Alert.tsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>,
  },
  {
    path: "/map",
    element: <Layout><Map /></Layout>,
  },
  {
    path: "/login",
    element: <Login />
  }

]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AlertProvider>
      <GlobalProvider>
        <RouterProvider router={router} />
      </GlobalProvider>
    </AlertProvider>
  </StrictMode>,
)
