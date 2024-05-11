import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './scenes/homePage';
import LoginPage from './scenes/loginPage';
import ProfilePage from './scenes/profilePage';
import { useMemo } from 'react';
import {useSelector} from'react-redux';
import {CssBaseline} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import { themeSettings } from './theme';
import {Navigate} from "react-router-dom";
import NotFound from './scenes/notfound';
import ChatPage from './scenes/chatPage';

function App() {
  const mode = useSelector(state => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = useSelector(state => state.token);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
              <Route path="/" element={isAuth ? <Navigate to="/home" /> : <LoginPage />} />
              <Route path="/home" element={isAuth ? <HomePage /> : <LoginPage />} />
              <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <LoginPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>     
      </BrowserRouter>
      
    </div>
  )
}

export default App
