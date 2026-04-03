-- Enable UUID-ossp extension
create extension if not exists "uuid-ossp";

-- USERS TABLE (Handled mostly by Supabase Auth, but we can have a public profile if needed)
-- We will link Businesses to auth.users.id

-- BUSINESSES TABLE
create table public.businesses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  state text not null,
  tin text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Businesses
alter table public.businesses enable row level security;
create policy "Users can view own businesses" on public.businesses for select using (auth.uid() = user_id);
create policy "Users can insert own businesses" on public.businesses for insert with check (auth.uid() = user_id);
create policy "Users can update own businesses" on public.businesses for update using (auth.uid() = user_id);

-- EMPLOYEES TABLE
create table public.employees (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  gross_salary numeric not null,
  rent_benefit boolean not null default false,
  annual_rent numeric,
  pension_opt_in boolean not null default false,
  pension_percentage numeric not null default 8.0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Employees
alter table public.employees enable row level security;
create policy "Users can view own employees" on public.employees for select using (EXISTS(SELECT 1 FROM public.businesses WHERE id = public.employees.business_id AND user_id = auth.uid()));
create policy "Users can insert own employees" on public.employees for insert with check (EXISTS(SELECT 1 FROM public.businesses WHERE id = public.employees.business_id AND user_id = auth.uid()));
create policy "Users can update own employees" on public.employees for update using (EXISTS(SELECT 1 FROM public.businesses WHERE id = public.employees.business_id AND user_id = auth.uid()));
create policy "Users can delete own employees" on public.employees for delete using (EXISTS(SELECT 1 FROM public.businesses WHERE id = public.employees.business_id AND user_id = auth.uid()));

-- PAYROLL RUNS TABLE
create table public.payroll_runs (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  month text not null, -- format e.g., 'March' or '03'
  year integer not null,
  total_paye numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (business_id, month, year) -- IDEMPOTENCY ENFORCEMENT
);

-- RLS Payroll Runs
alter table public.payroll_runs enable row level security;
create policy "Users can view own payroll runs" on public.payroll_runs for select using (EXISTS(SELECT 1 FROM public.businesses WHERE id = public.payroll_runs.business_id AND user_id = auth.uid()));
create policy "Users can insert own payroll runs" on public.payroll_runs for insert with check (EXISTS(SELECT 1 FROM public.businesses WHERE id = public.payroll_runs.business_id AND user_id = auth.uid()));
create policy "Users can update own payroll runs" on public.payroll_runs for update using (EXISTS(SELECT 1 FROM public.businesses WHERE id = public.payroll_runs.business_id AND user_id = auth.uid()));
create policy "Users can delete own payroll runs" on public.payroll_runs for delete using (EXISTS(SELECT 1 FROM public.businesses WHERE id = public.payroll_runs.business_id AND user_id = auth.uid()));

-- PAYROLL LINE ITEMS TABLE (Frozen Data)
create table public.payroll_line_items (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid not null references public.payroll_runs(id) on delete cascade,
  employee_id uuid not null references public.employees(id),
  employee_name text not null, -- explicitly store name frozen
  gross numeric not null,
  pension numeric not null,
  rent_relief numeric not null,
  taxable_income numeric not null,
  paye numeric not null,
  net_pay numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Payroll Line Items
alter table public.payroll_line_items enable row level security;
create policy "Users can view own payroll line items" on public.payroll_line_items for select using (EXISTS(SELECT 1 FROM public.payroll_runs pr JOIN public.businesses b ON pr.business_id = b.id WHERE pr.id = public.payroll_line_items.run_id AND b.user_id = auth.uid()));
create policy "Users can insert own payroll line items" on public.payroll_line_items for insert with check (EXISTS(SELECT 1 FROM public.payroll_runs pr JOIN public.businesses b ON pr.business_id = b.id WHERE pr.id = public.payroll_line_items.run_id AND b.user_id = auth.uid()));
create policy "Users can update own payroll line items" on public.payroll_line_items for update using (EXISTS(SELECT 1 FROM public.payroll_runs pr JOIN public.businesses b ON pr.business_id = b.id WHERE pr.id = public.payroll_line_items.run_id AND b.user_id = auth.uid()));
create policy "Users can delete own payroll line items" on public.payroll_line_items for delete using (EXISTS(SELECT 1 FROM public.payroll_runs pr JOIN public.businesses b ON pr.business_id = b.id WHERE pr.id = public.payroll_line_items.run_id AND b.user_id = auth.uid()));
