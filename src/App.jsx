import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import {
  Box, AppBar, Toolbar, Typography, IconButton, Button
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Badge from '@mui/material/Badge'
import Popover from '@mui/material/Popover'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Products from './pages/Products'
import Antennas from './pages/Antennas'
import Events from './pages/Events'
import History from './pages/History'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Settings from './pages/Settings'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'

export default function App() {
  const { role, logout } = useAuth()
  const [open, setOpen] = React.useState(true)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [notifications, setNotifications] = React.useState([
    { id: 1, type: 'Antena offline', text: 'Antena 2 está offline', seen: false },
    { id: 2, type: 'Sin stock', text: 'Par LED con bajo stock', seen: false }
  ])
  const unread = notifications.filter(n => !n.seen).length

  const openNotif = (e) => setAnchorEl(e.currentTarget)
  const closeNotif = () => setAnchorEl(null)
  const markAll = () => setNotifications(notifications.map(n => ({ ...n, seen: true })))

  // Si no hay role, redirigir a Login
  if (!role) {
    return <Login />
  }

  // Logout handler
  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" color="default" sx={{ backgroundColor: '#0B0C10' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" color="inherit" onClick={() => setOpen(o => !o)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <IconButton color="inherit" onClick={openNotif} sx={{ ml: 1 }}>
              <Badge badgeContent={unread} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeNotif} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <Box sx={{ width: 320, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">Notificaciones</Typography>
                  <Button size="small" onClick={markAll}>Marcar todas</Button>
                </Box>
                {notifications.map(n => (
                  <Box key={n.id} sx={{ p: 1, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <Typography variant="body2"><strong>{n.type}</strong></Typography>
                    <Typography variant="caption">{n.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Popover>
            <Typography variant="h6" sx={{ ml: 2 }}>RFID - Control Bodega</Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption">
                {role === 'admin' ? 'Modo Administrador' : 'Modo Operador'}
              </Typography>
              <Button variant="outlined" size="small" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Sidebar open={open} onToggle={() => setOpen(o => !o)} />

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, backgroundColor: '#0B0C10', minHeight: '100vh' }}>
        <Routes>
          {!role && <Route path="*" element={<Login />} />}
          {role && (
            <>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/products" element={<Products />} />
              <Route path="/antennas" element={<Antennas />} />
              <Route path="/events" element={<Events />} />
              <Route path="/history" element={<History />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </>
          )}
        </Routes>
      </Box>
    </Box>
  )
}
