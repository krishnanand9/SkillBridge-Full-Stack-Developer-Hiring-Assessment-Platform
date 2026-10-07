import React from 'react'; import ReactDOM from 'react-dom/client'; import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; import { Toaster } from 'react-hot-toast';
import App from './App'; import './index.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<QueryClientProvider client={new QueryClient()}><BrowserRouter><App /><Toaster /></BrowserRouter></QueryClientProvider>);
