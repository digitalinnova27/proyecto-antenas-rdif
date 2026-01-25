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

  /* ===== NUEVO: AGREGAR PRODUCTO ===== */
  const [openAdd, setOpenAdd] = React.useState(false)
  const [newProduct, setNewProduct] = React.useState({
    name: '',
    sku: '',
    category: '',
    qty: '',
    rfid: ''
  })

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

  /* ================= DETALLE ================= */

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

  /* ================= AGREGAR PRODUCTO ================= */

  const handleAddProduct = () => {
    const id = Date.now()

    const qty = Number(newProduct.qty)

    const product = {
      id,
      name: newProduct.name,
      sku: newProduct.sku,
      category: newProduct.category,
      total: qty,
      units: Array.from({ length: qty }).map((_, i) => ({
        id: `${id}-${i + 1}`,
        rfid: `${newProduct.rfid}-${i + 1}`,
        state: 'Disponible'
      }))
    }

    setProducts(prev => [...prev, product])
    setOpenAdd(false)
    setNewProduct({ name: '', sku: '', category: '', qty: '', rfid: '' })
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Inventario General
      </Typography>

      {/* ================= FILTROS ================= */}

      {/* ================= FILTROS ================= */}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          {/* FILTROS */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            <TextField
              label="SKU"
              size="small"
              sx={{ minWidth: 160 }}
              value={filter.sku}
              onChange={e => setFilter({ ...filter, sku: e.target.value })}
            />

            <TextField
              select
              label="Categoría"
              size="small"
              sx={{ minWidth: 180 }}
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
              sx={{ minWidth: 200 }}
              value={filter.state}
              onChange={e => setFilter({ ...filter, state: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {STATES.map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Box>

          {/* BOTÓN */}
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpenAdd(true)}
            sx={{ whiteSpace: 'nowrap' }}
          >
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

      {/* ================= MODAL AGREGAR ================= */}

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth>
        <DialogTitle>Agregar producto</DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombre"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
          />

          <TextField
            label="SKU"
            value={newProduct.sku}
            onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
          />

          <TextField
            select
            label="Categoría"
            value={newProduct.category}
            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
          >
            {categories.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="Cantidad"
            value={newProduct.qty}
            onChange={e => setNewProduct({ ...newProduct, qty: e.target.value })}
          />

          <TextField
            label="RFID base"
            value={newProduct.rfid}
            onChange={e => setNewProduct({ ...newProduct, rfid: e.target.value })}
            helperText="Ej: RFID-PROD"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddProduct}>Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
