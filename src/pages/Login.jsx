import React from 'react'
import { Box, Paper, Typography, TextField, Button } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  const submit = () => {
    const ok = login(username, password)
    if (!ok) {
      setError('Credenciales incorrectas')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0B0C10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper sx={{ p: 4, width: 360, backgroundColor: '#1F2833' }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          Ingreso al sistema
        </Typography>

        <TextField
          fullWidth
          label="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="password"
          label="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        {error && (
          <Typography color="error" variant="caption">
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={submit}
        >
          Enviar
        </Button>

        <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
          admin / admin123 — operador / 4321
        </Typography>
      </Paper>
    </Box>
  )
}
