import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';
import './tailwind.css';
import './i18n';
import { RouterProvider } from 'react-router-dom';
import router from './router/index';
import { Provider } from 'react-redux';
import store from './store/index';
// import { AuthProvider } from './pages/context/AuthContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Suspense>
            {/* <AuthProvider> */}
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
            {/* </AuthProvider> */}
        </Suspense>
    </React.StrictMode>
);
