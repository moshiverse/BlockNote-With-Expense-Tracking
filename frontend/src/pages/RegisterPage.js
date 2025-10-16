import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, InputAdornment, IconButton } from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function RegisterPage({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ username, password });
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={2}>
      {/* Background Aurora Glow */}
      <Box
        sx={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,152,0,0.3) 0%, rgba(10,12,29,0) 70%)',
          filter: 'blur(100px)',
          zIndex: -1,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: 'spring' }}
      >
        <Paper sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 420 }}>
          <Typography variant="h1" align="center" gutterBottom>
            Register
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Keep notes and Track your Expenses <br />
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button variant="register" type="submit" fullWidth sx={{ mt: 3, mb: 2 }}>
              Register
            </Button>

            {/* Modern link style */}
            <Typography
              align="center"
              sx={{
                mt: 1,
                color: 'primary.main',
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={onSwitchToLogin}
            >
              Already have an account? Sign In
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default RegisterPage;
