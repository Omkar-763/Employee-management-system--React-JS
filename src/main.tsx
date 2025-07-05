import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './tailwind.css';
import './i18n';
import { RouterProvider } from 'react-router-dom';
import router from './router/index';
import { Provider } from 'react-redux';
import store from './store/index';
import { AuthProvider } from './pages/context/authContext'; // Adjust the import path as needed

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <AuthProvider>
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                    <RouterProvider router={router} />
                </Suspense>
            </AuthProvider>
        </Provider>
    </React.StrictMode>
);
