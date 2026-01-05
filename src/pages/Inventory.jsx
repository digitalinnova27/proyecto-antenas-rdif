import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select
} from '@mui/material'
import { products as mockProducts, categories, events as mockEvents } from '../mockData'

/* ================= ESTADOS ================= */

const STATES = [
  'Disponible',
  'Reservado',
  'Ocupado',
  'En Mantenimiento',
  'Perdido'
]

const stateColors = {
  Disponible: 'success',
  Reservado: 'secondary',
  Ocupado: 'warning',
  'En Mantenimiento': 'info',
  Perdido: 'error'
}

/* ================= BUILD UNIDADES ================= */

const buildProductsWithUnits = () =>
  mockProducts.map(p => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    category: p.category,
    total: p.qty,
    units: Array.from({ length: p.qty }).map((_, i) => ({
      id: `${p.id}-${i + 1}`,
      rfid: `${p.rfid}-${i + 1}`,
      state: 'Disponible'
    }))
  }))

export default function Inventory() {
  const [products, setProducts] = React.useState(buildProductsWithUnits)
  const [events] = React.useState(mockEvents)

  const [filter, setFilter] = React.useState({
    sku: '',
    category: '',
    state: ''
  })

  const [detail, setDetail] = React.useState(null)
  const [draftDetail, setDraftDetail] = React.useState(null)

  /* ================= HELPERS ================= */

  const reservedFromEvents = productId =>
    events
      .flatMap(e => e.assignments || [])
      .filter(a => a.productId === productId)
      .reduce((sum, a) => sum + a.qty, 0)

  const countByState = (product, state) => {
    if (state === 'Reservado') return reservedFromEvents(product.id)

    if (state === 'Disponible') {
      const reserved = reservedFromEvents(product.id)
      const blocked = product.units.filter(u =>
        ['Ocupado', 'En Mantenimiento', 'Perdido'].includes(u.state)
      ).length

      return Math.max(product.total - reserved - blocked, 0)
    }

    return product.units.filter(u => u.state === state).length
  }

  const filteredProducts = products.filter(p =>
    (filter.sku ? p.sku.includes(filter.sku) : true) &&
    (filter.category ? p.category === filter.category : true) &&
    (filter.state ? countByState(p, filter.state) > 0 : true)
  )

  /* ================= DETAIL (DRAFT) ================= */

  const updateUnitState = (unitId, newState) => {
    setDraftDetail(prev => ({
      ...prev,
      units: prev.units.map(u =>
        u.id === unitId ? { ...u, state: newState } : u
      )
    }))
  }

  const saveDetailChanges = () => {
    setProducts(products.map(p =>
      p.id === draftDetail.id ? draftDetail : p
    ))
    setDetail(null)
    setDraftDetail(null)
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Inventario General
      </Typography>

      {/* ================= FILTROS ================= */}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="SKU"
              size="small"
              value={filter.sku}
              onChange={e => setFilter({ ...filter, sku: e.target.value })}
            />

            <TextField
              select
              label="Categoría"
              size="small"
              sx={{ minWidth: 160 }}
              value={filter.category}
              onChange={e => setFilter({ ...filter, category: e.target.value })}
            >
              <MenuItem value="">Todas</MenuItem>
              {categories.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Estado"
              size="small"
              sx={{ minWidth: 180 }}
              value={filter.state}
              onChange={e => setFilter({ ...filter, state: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {STATES.map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>

            <Button variant="contained">Exportar</Button>
          </Box>

          <Button variant="contained" color="success">
            Agregar producto
          </Button>
        </Box>
      </Paper>

      {/* ================= TABLA ================= */}

      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Total</TableCell>
              {STATES.map(s => (
                <TableCell key={s}>{s}</TableCell>
              ))}
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProducts.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.sku}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.total}</TableCell>

                {STATES.map(s => (
                  <TableCell key={s}>
                    <Chip
                      size="small"
                      label={countByState(p, s)}
                      color={stateColors[s]}
                    />
                  </TableCell>
                ))}

                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setDetail(p)
                      setDraftDetail(JSON.parse(JSON.stringify(p)))
                    }}
                  >
                    Detalle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* ================= DETALLE ================= */}

      <Dialog open={Boolean(detail)} onClose={() => setDetail(null)} fullWidth>
        <DialogTitle>Detalle del producto</DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {draftDetail && (
            <>
              <Typography><strong>{draftDetail.name}</strong></Typography>
              <Typography>SKU: {draftDetail.sku}</Typography>
              <Typography>Categoría: {draftDetail.category}</Typography>

              <Paper sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>RFID</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {draftDetail.units.map(u => (
                      <TableRow key={u.id}>
                        <TableCell>{u.rfid}</TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={u.state}
                            onChange={e =>
                              updateUnitState(u.id, e.target.value)
                            }
                          >
                            {STATES.filter(s =>
                              !['Disponible', 'Reservado'].includes(s)
                            ).map(s => (
                              <MenuItem key={s} value={s}>{s}</MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setDetail(null)
              setDraftDetail(null)
            }}
          >
            Cancelar
          </Button>

          <Button variant="contained" onClick={saveDetailChanges}>
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
