import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import {store} from './store';
import {Provider} from "react-redux";

import {persistStore} from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { SocketContextProvider } from './context/SocketContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>        
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
