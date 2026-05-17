/*
  # Admin Product Management — Storage Bucket & RLS Policies

  ## Summary
  Enables admin users to fully manage products and upload product images.

  ## Changes

  ### 1. Storage Bucket
  - Creates a public `product-images` storage bucket for product photos
  - Admins can upload, update, and delete images
  - Public read access for all users (images shown in storefront)

  ### 2. Products Table — Admin Write Policies
  - Admins (role = 'admin' in profiles) can INSERT, UPDATE, DELETE products
  - Existing public SELECT policy left intact (or added if missing)

  ### 3. Categories Table — Admin Read Policy
  - Admins can read all categories to populate dropdowns

  ## Security
  - All policies verify auth.uid() and cross-check profiles.role = 'admin'
  - Public storefront users retain read-only access to active products
*/

-- ─── Storage bucket ──────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read product images (public storefront)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read product images'
  ) THEN
    CREATE POLICY "Public read product images"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'product-images');
  END IF;
END $$;

-- Allow admins to upload product images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can upload product images'
  ) THEN
    CREATE POLICY "Admins can upload product images"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'product-images' AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Allow admins to update product images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can update product images'
  ) THEN
    CREATE POLICY "Admins can update product images"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'product-images' AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Allow admins to delete product images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can delete product images'
  ) THEN
    CREATE POLICY "Admins can delete product images"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'product-images' AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- ─── Products table — admin write policies ────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Admins can insert products'
  ) THEN
    CREATE POLICY "Admins can insert products"
      ON public.products FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Admins can update products'
  ) THEN
    CREATE POLICY "Admins can update products"
      ON public.products FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Admins can delete products'
  ) THEN
    CREATE POLICY "Admins can delete products"
      ON public.products FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Ensure public can read active products (storefront)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Public can view active products'
  ) THEN
    CREATE POLICY "Public can view active products"
      ON public.products FOR SELECT
      TO public
      USING (is_active = true);
  END IF;
END $$;

-- Admins can view all products including inactive
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Admins can view all products'
  ) THEN
    CREATE POLICY "Admins can view all products"
      ON public.products FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- ─── Categories — admin can read all ──────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'categories' AND policyname = 'Public can view categories'
  ) THEN
    CREATE POLICY "Public can view categories"
      ON public.categories FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;
