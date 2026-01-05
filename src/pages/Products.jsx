import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

export default function Products() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.getProducts();
      setData(res);
    }
    load();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Productos
      </Typography>

      <Paper sx={{ p: 2 }}>
        <List>
          {data.map((p) => (
            <ListItem key={p.id} divider>
              <ListItemText
                primary={`${p.name} (SKU: ${p.sku})`}
                secondary={`Categoría: ${p.category} — RFID: ${p.rfid}`}
              />
              <Chip
                label={p.state}
                color="primary"
                variant="outlined"
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}



// import React from 'react'
// import { Box, Typography, Paper, List, ListItem, ListItemText, Button } from '@mui/material'
// import { api } from '../services/api'

// export default function Products(){
//   const [data, setData] = React.useState([])
//   const [detail, setDetail] = React.useState(null)
//   React.useEffect(()=> api.getProducts().then(res=> setData(res)), [])

//   return (
//     <Box>
//       <Typography variant="h5" sx={{ mb:2 }}>Productos</Typography>
//       <Paper sx={{ p:2 }}>
//         <List>
//           {data.map(p=> (
//             <ListItem key={p.id} secondaryAction={<Button onClick={()=>setDetail(p)} variant="outlined" size="small">Detalle</Button>}>
//               <ListItemText primary={p.name} secondary={`SKU: ${p.sku} • Cat: ${p.category} • Qty: ${p.qty} • Estado: ${p.state}`} />
//             </ListItem>
//           ))}
//         </List>
//       </Paper>
//       {detail && (
//         <Paper sx={{ p:2, mt:2 }}>
//           <Typography variant="h6">Detalle: {detail.name}</Typography>
//           <Typography>SKU: {detail.sku}</Typography>
//           <Typography>Categoria: {detail.category}</Typography>
//           <Typography>Estado: {detail.state}</Typography>
//           <Typography>RFID: {detail.rfid}</Typography>
//         </Paper>
//       )}
//     </Box>
//   )
// }
