
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin','staff','user');
CREATE TYPE public.product_status AS ENUM ('available','reserved','sold');
CREATE TYPE public.request_status AS ENUM ('pending','confirmed','in_progress','completed','cancelled');

-- UPDATED AT helper
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read categories" ON public.categories FOR SELECT USING (is_active);
CREATE POLICY "admin manage categories" ON public.categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER t_categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BRANDS
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.brands TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brands TO authenticated;
GRANT ALL ON public.brands TO service_role;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read brands" ON public.brands FOR SELECT USING (is_active);
CREATE POLICY "admin manage brands" ON public.brands FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER t_brands_updated BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  model TEXT,
  condition TEXT NOT NULL DEFAULT 'Excellent',
  capacity TEXT,
  age_years NUMERIC(4,1),
  warranty_months INT NOT NULL DEFAULT 0,
  price NUMERIC(10,2) NOT NULL,
  mrp NUMERIC(10,2),
  status public.product_status NOT NULL DEFAULT 'available',
  images TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  accessories TEXT[] NOT NULL DEFAULT '{}',
  condition_report TEXT,
  delivery_available BOOLEAN NOT NULL DEFAULT true,
  installation_available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read products" ON public.products FOR SELECT USING (is_published);
CREATE POLICY "admin manage products" ON public.products FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER t_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BOOKINGS (service)
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL DEFAULT ('CA-' || upper(substr(md5(random()::text),1,6))),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  pincode TEXT,
  appliance_category TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  problem_description TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  image_url TEXT,
  status public.request_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can book" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read bookings" ON public.bookings FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin update bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin delete bookings" ON public.bookings FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER t_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- INSTALLATION REQUESTS
CREATE TABLE public.installation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL DEFAULT ('CI-' || upper(substr(md5(random()::text),1,6))),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  product_type TEXT NOT NULL,
  brand TEXT,
  service_type TEXT NOT NULL DEFAULT 'installation',
  preferred_date DATE,
  preferred_time TEXT,
  notes TEXT,
  status public.request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.installation_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.installation_requests TO authenticated;
GRANT ALL ON public.installation_requests TO service_role;
ALTER TABLE public.installation_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can request install" ON public.installation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read installs" ON public.installation_requests FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin update installs" ON public.installation_requests FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin delete installs" ON public.installation_requests FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER t_installs_updated BEFORE UPDATE ON public.installation_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SELL REQUESTS
CREATE TABLE public.sell_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL DEFAULT ('CS-' || upper(substr(md5(random()::text),1,6))),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  product_category TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  purchase_year INT,
  condition TEXT,
  expected_price NUMERIC(10,2),
  images TEXT[] NOT NULL DEFAULT '{}',
  comments TEXT,
  offered_price NUMERIC(10,2),
  status public.request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.sell_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.sell_requests TO authenticated;
GRANT ALL ON public.sell_requests TO service_role;
ALTER TABLE public.sell_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can sell" ON public.sell_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read sells" ON public.sell_requests FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin update sells" ON public.sell_requests FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin delete sells" ON public.sell_requests FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER t_sells_updated BEFORE UPDATE ON public.sell_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  location TEXT,
  rating INT NOT NULL DEFAULT 5,
  message TEXT NOT NULL,
  service_type TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read testimonials" ON public.testimonials FOR SELECT USING (is_published);
CREATE POLICY "admin manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER t_testimonials_updated BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SEED CATEGORIES
INSERT INTO public.categories (name, slug, icon, sort_order) VALUES
('Refrigerator','refrigerator','Refrigerator',1),
('Washing Machine','washing-machine','WashingMachine',2),
('Air Conditioner','air-conditioner','AirVent',3),
('Microwave','microwave','Microwave',4),
('Water Purifier','water-purifier','Droplets',5),
('Mixer Grinder','mixer-grinder','Blend',6),
('Induction Stove','induction-stove','Flame',7),
('Dishwasher','dishwasher','Utensils',8);

-- SEED BRANDS
INSERT INTO public.brands (name, slug, sort_order) VALUES
('LG','lg',1),('Samsung','samsung',2),('Whirlpool','whirlpool',3),('Godrej','godrej',4),
('Haier','haier',5),('Bosch','bosch',6),('IFB','ifb',7),('Panasonic','panasonic',8),
('Voltas','voltas',9),('Blue Star','blue-star',10),('Daikin','daikin',11),('Carrier','carrier',12),('Hitachi','hitachi',13);

-- SEED TESTIMONIALS
INSERT INTO public.testimonials (customer_name, location, rating, message, service_type, sort_order) VALUES
('Anoop Menon','Kakkanad, Kochi',5,'My AC stopped cooling on the hottest week of the year. Cool Air sent a technician the same evening, fixed a gas leak and cleaned the coils. Honest pricing, no upselling.','AC Service',1),
('Reshma Thomas','Edappally, Kochi',5,'Bought a refurbished Samsung front-load washing machine. It looked and worked like new, came with 6 months warranty and free installation. Excellent value.','Refurbished Purchase',2),
('Jaseem Rahman','Aluva',5,'Their AMC plan is worth every rupee. Two free services a year and priority response whenever we call. The team is polite and always on time.','AMC',3),
('Divya Nair','Tripunithura',5,'Sold my old double-door fridge to them. Fair quote over WhatsApp, free pickup from home and instant payment. Very smooth experience.','Sell Appliance',4),
('Sanjay Pillai','Vyttila, Kochi',5,'Water purifier service and filter replacement done in under an hour. They explained everything and showed the old filters. Genuinely trustworthy.','Water Purifier Service',5),
('Fathima Basheer','Palarivattom',5,'Microwave repair that two other shops refused. Cool Air sourced the part in two days and charged less than a new unit. Highly recommended.','Microwave Repair',6);
