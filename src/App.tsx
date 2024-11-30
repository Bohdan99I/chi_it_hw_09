import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store/store';
import { getCurrentUser } from './store/slices/userSlice';
import { ControlBar } from './components/ControlBar/ControlBar';
import { StripePage } from './layouts/StripePage';
import { HomePage } from './layouts/HomePage';
import { LoginPage } from './layouts/LoginPage';
import { RegisterPage } from './layouts/RegisterPage';
import { NewPostPage } from './layouts/NewPostPage';
import { Container } from '@mui/material';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { Notification } from './components/Notification/Notification';
import { Toast } from './components/Toast/Toast';
import { socketService } from './services/socketService';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [toast, setToast] = useState({ open: false, message: '' });

  useEffect(() => {    
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  useEffect(() => {
    const socket = socketService.connect();
    
    socket.on('newPost', (data: { message: string }) => {
      setToast({ open: true, message: data.message });
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  return (
    <Router>
      <ControlBar />
      <Container>
        <Toast 
          open={toast.open}
          message={toast.message}
          onClose={handleCloseToast}
        />
        <Notification />
        <Routes>
          <Route path="/" element={<StripePage />} />
          <Route
            path="/my-posts"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-post"
            element={
              <ProtectedRoute>
                <NewPostPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
