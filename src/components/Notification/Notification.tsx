import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { socketService } from '../../services/socketService';

export const Notification: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('newPost', (data: { message: string }) => {
      setMessage(data.message);
      setOpen(true);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity="info">
        {message}
      </Alert>
    </Snackbar>
  );
};
