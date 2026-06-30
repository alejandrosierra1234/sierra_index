-- ============================================
-- SIERRA INDEX — Setup inicial de base de datos
-- Ejecutar en Supabase > SQL Editor
-- ============================================

-- 1. PERFILES DE USUARIO
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text not null,
  role text not null default 'vendedor' check (role in ('editor', 'vendedor')),
  created_at timestamptz default now()
);

-- 2. PRODUCTOS
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  code text,
  name text not null,
  division text not null check (division in ('fiber', 'yarn', 'fabric', 'chemicals', 'garment')),
  description text,
  specs jsonb default '{}',
  tags text[] default '{}',
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- 3. SOLICITUDES DE MUESTRAS
create table if not exists sample_requests (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  requested_by uuid references profiles(id) on delete cascade,
  quantity text not null,
  notes text,
  status text default 'pending' check (status in ('pending', 'approved', 'shipped', 'rejected')),
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table profiles enable row level security;
alter table products enable row level security;
alter table sample_requests enable row level security;

-- PROFILES: cada usuario ve solo su propio perfil
create policy "Ver propio perfil"
  on profiles for select using (auth.uid() = id);

create policy "Insertar propio perfil"
  on profiles for insert with check (auth.uid() = id);

-- PRODUCTS: todos los autenticados pueden ver; solo editores pueden escribir
create policy "Ver productos"
  on products for select using (auth.role() = 'authenticated');

create policy "Editores insertan productos"
  on products for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'editor')
  );

create policy "Editores actualizan productos"
  on products for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'editor')
  );

create policy "Editores eliminan productos"
  on products for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'editor')
  );

-- SAMPLE REQUESTS: cada usuario ve solo las suyas; cualquier autenticado puede crear
create policy "Ver propias solicitudes"
  on sample_requests for select using (requested_by = auth.uid());

create policy "Crear solicitud"
  on sample_requests for insert with check (requested_by = auth.uid());

-- ============================================
-- TRIGGER: crear perfil automáticamente al registrar usuario
-- ============================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'vendedor')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================
-- PRODUCTOS DE EJEMPLO (ficticios)
-- ============================================
-- Nota: primero debes crear al menos un usuario editor y reemplazar
-- el UUID abajo con su ID real, o puedes omitir created_by.

insert into products (code, name, division, description, specs, tags) values

-- FIBER
('FIB-001', 'Fibra Merino 18.5mic', 'fiber',
 'Fibra de lana merino fina, ideal para prendas de alto confort y suavidad al tacto.',
 '{"Micronaje": "18.5 mic", "Origen": "Australia", "Composición": "100% Lana Merino", "Presentación": "Fardos 200kg"}',
 ARRAY['merino','fino','natural','premium']),

('FIB-002', 'Fibra Acrílica FR', 'fiber',
 'Fibra acrílica con tratamiento retardante de llama para aplicaciones técnicas e industriales.',
 '{"Dtex": "3.3 dtex", "Longitud": "38mm", "Resistencia": "Retardante a llama", "Color": "Crudo"}',
 ARRAY['acrílica','ignífuga','técnica']),

('FIB-003', 'Fibra de Bambú Premium', 'fiber',
 'Fibra celulósica derivada de bambú con propiedades antibacterianas y alta absorción.',
 '{"Micronaje": "1.2 dtex", "Longitud": "38mm", "Composición": "100% Bambú", "Certificación": "OEKO-TEX"}',
 ARRAY['bambú','eco','antibacterial','suave']),

-- YARN
('YRN-001', 'Hilo Algodón Pima 40/1', 'yarn',
 'Hilo de algodón Pima de alta calidad, torsión S, para tejido de punto fino.',
 '{"Título": "40/1 Ne", "Fibra": "100% Algodón Pima", "Torsión": "S - 780 TPM", "Resistencia": "350 cN"}',
 ARRAY['algodón','pima','fino','punto']),

('YRN-002', 'Hilo Poliéster Texturizado DTY 150/48', 'yarn',
 'Hilo poliéster texturizado por falsa torsión, para telas de alta elasticidad.',
 '{"Título": "150/48 Dtex", "Tenacidad": "4.2 g/d", "Elongación": "25-35%", "Brillo": "Semi-mate"}',
 ARRAY['poliéster','texturizado','elástico','sintético']),

('YRN-003', 'Hilo Core-Spun Lycra 30/1', 'yarn',
 'Hilo algodón con alma de spandex para prendas stretch de alto comfort.',
 '{"Título": "30/1 Ne", "Alma": "40D Lycra", "Cubierta": "Algodón 95%", "Elongación": "80%"}',
 ARRAY['core-spun','lycra','stretch','elástico']),

-- FABRIC
('FAB-001', 'Jersey 24/1 180gsm', 'fabric',
 'Tela jersey de punto básico en algodón combed, para playeras y prendas casual.',
 '{"Peso": "180 g/m²", "Composición": "100% Algodón Combed", "Ancho": "160 cm", "Encogimiento": "<3%"}',
 ARRAY['jersey','algodón','casual','básico']),

('FAB-002', 'French Terry 220gsm', 'fabric',
 'Tela rizo francés de algodón para sudaderas, joggers y ropa deportiva.',
 '{"Peso": "220 g/m²", "Composición": "80% CO / 20% PES", "Ancho": "155 cm", "Acabado": "Anti-pilling"}',
 ARRAY['french terry','deportivo','sudadera','rizo']),

('FAB-003', 'Interlock Merino 260gsm', 'fabric',
 'Tela interlock doble cara en lana merino para prendas técnicas de montaña.',
 '{"Peso": "260 g/m²", "Composición": "100% Merino 18.5mic", "Ancho": "150 cm", "Certificación": "Woolmark"}',
 ARRAY['interlock','merino','técnico','outdoor']),

-- CHEMICALS
('CHM-001', 'Suavizante Siliconado XL-70', 'chemicals',
 'Suavizante a base de silicona macro-emulsionada para acabado de prendas de punto.',
 '{"Activo": "Silicona 70%", "pH": "6.5 - 7.0", "Dosificación": "10-30 g/L", "Ionicidad": "No iónico"}',
 ARRAY['suavizante','siliconado','acabado','punto']),

('CHM-002', 'Fijador Óptico FO-200', 'chemicals',
 'Agente blanqueador óptico para tejidos celulósicos, alta blancura y solidez a la luz.',
 '{"Activo": "Estilbeno 20%", "pH aplicación": "5.0 - 6.0", "Dosis": "0.5 - 2%", "Solidez luz": "5/8"}',
 ARRAY['blanqueador','óptico','celulósico','acabado']),

('CHM-003', 'Auxiliar Antiencogimiento WS-45', 'chemicals',
 'Resina de acabado para control dimensional en tejidos de lana y mezclas.',
 '{"Activo": "Resina WS 45%", "pH": "4.5 - 5.5", "Temperatura fijado": "150°C / 90s", "Encogimiento residual": "<2%"}',
 ARRAY['antiencogimiento','lana','resina','dimensional']),

-- GARMENT
('GRM-001', 'Playera Básica Unisex', 'garment',
 'Playera cuello redondo confeccionada en jersey 180gsm algodón combed, fit regular.',
 '{"Tela": "Jersey 180gsm Algodón", "Fit": "Regular Unisex", "Tallas": "XS - 3XL", "Costuras": "Flatlock"}',
 ARRAY['playera','básico','unisex','algodón']),

('GRM-002', 'Sudadera Hoodie Premium', 'garment',
 'Hoodie en french terry 320gsm con bolsa canguro y capucha con cuerda.',
 '{"Tela": "French Terry 320gsm", "Fit": "Relaxed", "Tallas": "XS - 2XL", "Detalles": "Canguro + Capucha"}',
 ARRAY['hoodie','sudadera','premium','casual']),

('GRM-003', 'Top Deportivo Compresión', 'garment',
 'Top deportivo femenino en tela técnica 4-way stretch con soporte medio.',
 '{"Tela": "Nylon/Spandex 200gsm", "Fit": "Compression", "Tallas": "XS - XL", "UPF": "50+"}',
 ARRAY['top','deportivo','compresión','femenino']);
