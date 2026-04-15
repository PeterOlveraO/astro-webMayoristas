export interface Producto {
  nombre: string;
  cantidad: number;
  precio: number;
  sku: string;
}

export interface Pedido {
  id: string;
  numero: string;
  cliente: string;
  empresa: string;
  direccion: string;
  telefono: string;
  email: string;
  fecha: string;
  estado: 'pendiente' | 'confirmado' | 'rechazado' | 'enviado';
  subtotal: number;
  total: number;
  productos: Producto[];
  notas?: string;
  guia?: string;
  transportista?: string;
}

export const pedidos: Pedido[] = [
  {
    id: '8842',
    numero: '#ORD-2024-8842',
    cliente: 'Carlos Mendez',
    empresa: 'Distribuidora Global S.A.',
    direccion: 'Av. Reforma 452, Ciudad de México, CP 01210',
    telefono: '+52 55 1234 5678',
    email: 'cmendez@distglobal.mx',
    fecha: '2024-04-14',
    estado: 'pendiente',
    subtotal: 12450.00,
    total: 12450.00,
    productos: [
      { nombre: 'Smartwatch Ultra Series 5', cantidad: 5, precio: 850.00, sku: 'SW-U5-001' },
      { nombre: 'Headphones Studio Pro', cantidad: 7, precio: 1171.43, sku: 'HP-SP-003' },
    ],
    notas: 'Entrega urgente requerida antes del viernes.',
  },
  {
    id: '8291',
    numero: '#ORD-2024-8291',
    cliente: 'Ana Torres',
    empresa: 'Distribuidora Central',
    direccion: 'Calle Morelos 89, Guadalajara, CP 44100',
    telefono: '+52 33 9876 5432',
    email: 'atorres@distcentral.mx',
    fecha: '2024-04-14',
    estado: 'pendiente',
    subtotal: 28400.00,
    total: 28400.00,
    productos: [
      { nombre: 'Laptop UltraBook Pro 15"', cantidad: 10, precio: 1800.00, sku: 'LT-UP15-007' },
      { nombre: 'Mouse Inalámbrico Ergo', cantidad: 20, precio: 320.00, sku: 'MS-IE-012' },
      { nombre: 'Teclado Mecánico RGB', cantidad: 12, precio: 450.00, sku: 'KB-MR-005' },
    ],
  },
  {
    id: '7904',
    numero: '#ORD-2024-7904',
    cliente: 'Marcos Ruiz',
    empresa: 'Supermercados La Paz',
    direccion: 'Blvd. Insurgentes 1200, Monterrey, CP 64000',
    telefono: '+52 81 5555 0101',
    email: 'mruiz@suplapaz.mx',
    fecha: '2024-04-13',
    estado: 'confirmado',
    subtotal: 9800.00,
    total: 9800.00,
    productos: [
      { nombre: 'Tablet Galaxy Tab S9', cantidad: 8, precio: 1225.00, sku: 'TB-GS9-002' },
    ],
    guia: 'FDX-99283746',
    transportista: 'FedEx Corp',
  },
  {
    id: '7601',
    numero: '#ORD-2024-7601',
    cliente: 'Luisa Campos',
    empresa: 'Comercializadora Norte S.A.',
    direccion: 'Av. Juárez 320, Chihuahua, CP 31000',
    telefono: '+52 614 888 2020',
    email: 'lcampos@comnorte.mx',
    fecha: '2024-04-12',
    estado: 'rechazado',
    subtotal: 5200.00,
    total: 5200.00,
    productos: [
      { nombre: 'Monitor 27" 4K HDR', cantidad: 4, precio: 1300.00, sku: 'MN-27K-009' },
    ],
  },
];
