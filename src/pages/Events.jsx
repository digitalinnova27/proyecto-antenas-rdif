
import React from 'react'
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  Divider
} from '@mui/material'
import { events as mockEvents, products as mockProducts, categories } from '../mockData'
import { useAuth } from '../context/AuthContext'

export default function Events() {
  const { role } = useAuth()

  const [events, setEvents] = React.useState(mockEvents)
  const [products] = React.useState(mockProducts)

  const [currentEvent, setCurrentEvent] = React.useState(null)

  const [openCreate, setOpenCreate] = React.useState(false)
  const [openDetail, setOpenDetail] = React.useState(false)
  const [openEdit, setOpenEdit] = React.useState(false)
  const [openAssign, setOpenAssign] = React.useState(false)
  const [deleteEvent, setDeleteEvent] = React.useState(null)

  const [form, setForm] = React.useState({ name: '', date: '', notes: '' })

  const [assignCategory, setAssignCategory] = React.useState('')
  const [assignmentsDraft, setAssignmentsDraft] = React.useState([])

  /* ================= HELPERS ================= */

  const getProduct = id => products.find(p => p.id === id)

  const availableQty = product => {
    const used = events.flatMap(e => e.assignments || [])
      .filter(a => a.productId === product.id)
      .reduce((sum, a) => sum + a.qty, 0)

    return product.qty - used
  }

  /* ================= NUEVO EVENTO ================= */

  const openCreateModal = () => {
    setForm({ name: '', date: '', notes: '' })
    setAssignmentsDraft([])
    setAssignCategory('')
    setOpenCreate(true)
  }

  const createEvent = () => {
    const id = Math.max(0, ...events.map(e => e.id)) + 1

    setEvents([
      {
        id,
        name: form.name,
        date: form.date,
        notes: form.notes,
        status: 'Programado',
        assignments: assignmentsDraft.filter(a => a.qty > 0)
      },
      ...events
    ])

    setOpenCreate(false)
  }

  /* ================= DETALLE ================= */

  const openDetailModal = (event) => {
    setCurrentEvent(event)
    setOpenDetail(true)
  }

  /* ================= EDITAR ================= */

  const openEditModal = () => {
    setForm({
      name: currentEvent.name,
      date: currentEvent.date,
      notes: currentEvent.notes || ''
    })
    setOpenDetail(false)
    setOpenEdit(true)
  }

  const saveEdit = () => {
    setEvents(events.map(e =>
      e.id === currentEvent.id
        ? { ...e, ...form }
        : e
    ))
    setOpenEdit(false)
    setCurrentEvent(null)
  }

  /* ================= ASIGNAR EQUIPOS ================= */

  const openAssignModal = (event) => {
    setCurrentEvent(event)
    setAssignmentsDraft(event.assignments || [])
    setAssignCategory('')
    setOpenAssign(true)
  }

  const setQty = (productId, qty) => {
    setAssignmentsDraft(prev => {
      const existing = prev.find(a => a.productId === productId)
      if (existing) {
        return prev.map(a =>
          a.productId === productId ? { ...a, qty } : a
        )
      }
      return [...prev, { productId, qty }]
    })
  }

  const saveAssignments = () => {
    setEvents(events.map(e =>
      e.id === currentEvent.id
        ? { ...e, assignments: assignmentsDraft.filter(a => a.qty > 0) }
        : e
    ))
    setOpenAssign(false)
  }

  /* ================= ELIMINAR ================= */

  const confirmDelete = () => {
    setEvents(events.filter(e => e.id !== deleteEvent.id))
    setDeleteEvent(null)
  }

  /* ================= UI ================= */

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Eventos</Typography>

      <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography>Administración de eventos</Typography>

        {role === 'admin' && (
          <Button variant="contained" onClick={openCreateModal}>
            Nuevo Evento
          </Button>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <List>
          {events.map(e => (
            <ListItem
              key={e.id}
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => openDetailModal(e)}>
                    Detalle
                  </Button>
                  {role === 'admin' && (
                    <>
                      <Button size="small" variant="outlined" onClick={() => openAssignModal(e)}>
                        Equipos
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => setDeleteEvent(e)}
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
                </Box>
              }
            >
              <ListItemText
                primary={e.name}
                secondary={`Fecha: ${e.date} • Estado: ${e.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* ================= CREAR EVENTO ================= */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nuevo evento</DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombre del evento"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            type="date"
            label="Fecha"
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />

          <TextField
            label="Notas"
            multiline
            minRows={3}
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />

          <Divider />

          <Typography variant="subtitle2">Asignar equipos</Typography>

          <Select
            value={assignCategory}
            onChange={e => setAssignCategory(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Todas las categorías</MenuItem>
            {categories.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>

          {products
            .filter(p => !assignCategory || p.category === assignCategory)
            .map(p => {
              const max = availableQty(p)
              const current =
                assignmentsDraft.find(a => a.productId === p.id)?.qty || 0

              return (
                <Box
                  key={p.id}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography>
                    {p.name} (Disp: {max})
                  </Typography>

                  <TextField
                    type="number"
                    size="small"
                    sx={{ width: 80 }}
                    inputProps={{ min: 0, max }}
                    value={current}
                    onChange={e => setQty(p.id, Number(e.target.value))}
                  />
                </Box>
              )
            })}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={createEvent}
            disabled={!form.name || !form.date}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= DETALLE ================= */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} fullWidth>
        <DialogTitle>Detalle del evento</DialogTitle>
        <DialogContent>
          {currentEvent && (
            <>
              <Typography><strong>{currentEvent.name}</strong></Typography>
              <Typography>Fecha: {currentEvent.date}</Typography>
              <Typography>Estado: {currentEvent.status}</Typography>
              <Typography sx={{ mt: 1 }}>Notas: {currentEvent.notes || '-'}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2">Equipos asignados</Typography>
              {currentEvent.assignments.length === 0 && (
                <Typography variant="caption">Sin equipos asignados</Typography>
              )}

              {currentEvent.assignments.map(a => {
                const p = getProduct(a.productId)
                return p ? (
                  <Typography key={a.productId}>
                    {p.name} × {a.qty}
                  </Typography>
                ) : null
              })}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {role === 'admin' && (
            <Button onClick={openEditModal} variant="outlined">
              Editar
            </Button>
          )}
          <Button onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* ================= EDITAR ================= */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
        <DialogTitle>Editar evento</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <TextField type="date" label="Fecha" InputLabelProps={{ shrink: true }} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <TextField label="Notas" multiline minRows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveEdit}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* ================= ASIGNAR EQUIPOS ================= */}
      <Dialog open={openAssign} onClose={() => setOpenAssign(false)} fullWidth>
        <DialogTitle>Asignar equipos</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Select
            value={assignCategory}
            onChange={e => setAssignCategory(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Todas las categorías</MenuItem>
            {categories.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>

          {products
            .filter(p => !assignCategory || p.category === assignCategory)
            .map(p => {
              const max = availableQty(p)
              const current =
                assignmentsDraft.find(a => a.productId === p.id)?.qty || 0

              return (
                <Box key={p.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>
                    {p.name} (Disp: {max})
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    sx={{ width: 80 }}
                    inputProps={{ min: 0, max }}
                    value={current}
                    onChange={e => setQty(p.id, Number(e.target.value))}
                  />
                </Box>
              )
            })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssign(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveAssignments}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* ================= ELIMINAR ================= */}
      <Dialog open={Boolean(deleteEvent)} onClose={() => setDeleteEvent(null)}>
        <DialogTitle>Eliminar evento</DialogTitle>
        <DialogContent>
          ¿Eliminar <strong>{deleteEvent?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteEvent(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
