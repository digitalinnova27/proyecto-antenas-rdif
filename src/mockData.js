export const categories = ['Audio','Iluminacion','Pantalla','Efectos','Estructuras','Otros']

export const products = [
  { id:1, name:'Micrófono Shure', sku:'A100', category:'Audio', qty:12, state:'Disponible', rfid:'RFID001', owner:'Cliente A', eventId: null },
  { id:2, name:'Par LED', sku:'L200', category:'Iluminacion', qty:5, state:'En Mantenimiento', rfid:'RFID002', owner:'Cliente A', eventId: null },
  { id:3, name:'Mixer 16ch', sku:'P300', category:'Audio', qty:2, state:'Ocupado', rfid:'RFID003', owner:'Cliente B', eventId: 1 },
  { id:4, name:'Pantalla 4K', sku:'S400', category:'Pantalla', qty:1, state:'Reservado', rfid:'RFID004', owner:'Cliente C', eventId: 2 },
  { id:5, name:'Estructura truss', sku:'E500', category:'Estructuras', qty:10, state:'Disponible', rfid:'RFID005', owner:'Cliente A', eventId: null }
]

export const events = [
  { id:1, name:'Matrimonio Granadilla', date:'2025-12-20', status:'Programado', notes:'Evento privado' , assignments: [3] },
  { id:2, name:'Fiesta Sporting', date:'2025-12-22', status:'Programado', notes:'Evento masivo', assignments: [4] }
]

export const antennas = [
  { id:1, name:'Antena 1', status:'Activa', signal:87, last:'2025-12-10 14:23' },
  { id:2, name:'Antena 2', status:'Offline', signal:0, last:'2025-12-09 09:12' },
  { id:3, name:'Antena 3', status:'Activa', signal:65, last:'2025-12-10 13:55' }
]

export const history = [
  { id:1, date:'2025-12-01', user:'Operador 1', action:'Salida', product:'Micrófono Shure', qty:2, note:'Evento Corporativo', eventId: null },
  { id:2, date:'2025-12-05', user:'Operador 2', action:'Ingreso', product:'Par LED', qty:3, note:'Revisión', eventId: null },
  { id:3, date:'2025-12-08', user:'Operador 1', action:'Cambio de estado', product:'Mixer 16ch', qty:1, note:'En mantenimiento', eventId: 1 }
]
