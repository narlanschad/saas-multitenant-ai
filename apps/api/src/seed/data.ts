export interface SeedCompany {
  name: string;
  admin: { name: string; email: string; password: string };
  user: { name: string; email: string; password: string };
  products: Array<{
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
  }>;
}

const SEED_PASSWORD = 'password123';

export const seedCompanies: SeedCompany[] = [
  {
    name: 'Acme Retail',
    admin: { name: 'Alice Silva', email: 'admin@acme.test', password: SEED_PASSWORD },
    user: { name: 'Bruno Costa', email: 'user@acme.test', password: SEED_PASSWORD },
    products: [
      { name: 'Notebook Pro 14', description: 'Laptop 14" com 16GB RAM e SSD 512GB', price: 6499.9, category: 'Eletrônicos', imageUrl: 'https://picsum.photos/seed/acme-1/400' },
      { name: 'Notebook Basic 15', description: 'Laptop 15" para uso no dia a dia', price: 3299.0, category: 'Eletrônicos', imageUrl: 'https://picsum.photos/seed/acme-2/400' },
      { name: 'Mouse Sem Fio', description: 'Mouse ergonômico sem fio com bateria de longa duração', price: 89.9, category: 'Eletrônicos', imageUrl: 'https://picsum.photos/seed/acme-3/400' },
      { name: 'Teclado Mecânico', description: 'Teclado mecânico switch marrom, ABNT2', price: 349.9, category: 'Eletrônicos', imageUrl: 'https://picsum.photos/seed/acme-4/400' },
      { name: 'Monitor 27" 4K', description: 'Monitor IPS 27 polegadas resolução 4K', price: 1899.0, category: 'Eletrônicos', imageUrl: 'https://picsum.photos/seed/acme-5/400' },
      { name: 'Cadeira de Escritório', description: 'Cadeira ergonômica com apoio lombar ajustável', price: 799.9, category: 'Móveis', imageUrl: 'https://picsum.photos/seed/acme-6/400' },
      { name: 'Mesa de Escritório', description: 'Mesa em L com 1,60m, MDF branco', price: 649.0, category: 'Móveis', imageUrl: 'https://picsum.photos/seed/acme-7/400' },
      { name: 'Luminária de Mesa LED', description: 'Luminária articulada com 3 níveis de intensidade', price: 119.9, category: 'Móveis', imageUrl: 'https://picsum.photos/seed/acme-8/400' },
      { name: 'Caderno Universitário', description: 'Caderno 200 folhas capa dura', price: 24.9, category: 'Papelaria', imageUrl: 'https://picsum.photos/seed/acme-9/400' },
      { name: 'Caneta Esferográfica (Caixa 50un)', description: 'Caixa com 50 canetas azuis', price: 39.9, category: 'Papelaria', imageUrl: 'https://picsum.photos/seed/acme-10/400' },
      { name: 'Fone de Ouvido Bluetooth', description: 'Fone over-ear com cancelamento de ruído', price: 449.9, category: 'Eletrônicos', imageUrl: 'https://picsum.photos/seed/acme-11/400' },
      { name: 'Webcam Full HD', description: 'Webcam 1080p com microfone integrado', price: 199.9, category: 'Eletrônicos', imageUrl: 'https://picsum.photos/seed/acme-12/400' },
    ],
  },
  {
    name: 'Globex Trading',
    admin: { name: 'Carla Nunes', email: 'admin@globex.test', password: SEED_PASSWORD },
    user: { name: 'Diego Fernandes', email: 'user@globex.test', password: SEED_PASSWORD },
    products: [
      { name: 'Smartphone X200', description: 'Smartphone 128GB, tela 6.5" AMOLED', price: 2799.0, category: 'Eletrônicos', imageUrl: 'https://picsum.photos/seed/globex-1/400' },
      { name: 'Smartphone X100 Lite', description: 'Smartphone 64GB, entrada', price: 1199.0, category: 'Eletrônicos', imageUrl: 'https://picsum.photos/seed/globex-2/400' },
      { name: 'Tablet 10"', description: 'Tablet Android 10 polegadas, 4GB RAM', price: 1499.9, category: 'Eletrônicos', imageUrl: 'https://picsum.photos/seed/globex-3/400' },
      { name: 'Carregador Portátil 20000mAh', description: 'Power bank com carregamento rápido', price: 149.9, category: 'Eletrônicos', imageUrl: 'https://picsum.photos/seed/globex-4/400' },
      { name: 'Smartwatch Fit', description: 'Relógio inteligente com monitor cardíaco', price: 599.9, category: 'Eletrônicos', imageUrl: 'https://picsum.photos/seed/globex-5/400' },
      { name: 'Sofá 3 Lugares', description: 'Sofá retrátil e reclinável em veludo', price: 2199.0, category: 'Móveis', imageUrl: 'https://picsum.photos/seed/globex-6/400' },
      { name: 'Estante de Livros', description: 'Estante 5 prateleiras em madeira maciça', price: 549.0, category: 'Móveis', imageUrl: 'https://picsum.photos/seed/globex-7/400' },
      { name: 'Puff Decorativo', description: 'Puff redondo revestido em courino', price: 179.9, category: 'Móveis', imageUrl: 'https://picsum.photos/seed/globex-8/400' },
      { name: 'Agenda Executiva 2026', description: 'Agenda diária com capa em couro sintético', price: 79.9, category: 'Papelaria', imageUrl: 'https://picsum.photos/seed/globex-9/400' },
      { name: 'Kit Marcadores de Texto', description: 'Kit com 12 cores fluorescentes', price: 29.9, category: 'Papelaria', imageUrl: 'https://picsum.photos/seed/globex-10/400' },
      { name: 'Caixa de Som Bluetooth', description: 'Caixa portátil à prova d\'água, 20W', price: 329.9, category: 'Eletrônicos', imageUrl: 'https://picsum.photos/seed/globex-11/400' },
      { name: 'Carrinho de Chá', description: 'Carrinho auxiliar com 2 prateleiras em madeira', price: 389.0, category: 'Móveis', imageUrl: 'https://picsum.photos/seed/globex-12/400' },
    ],
  },
];
