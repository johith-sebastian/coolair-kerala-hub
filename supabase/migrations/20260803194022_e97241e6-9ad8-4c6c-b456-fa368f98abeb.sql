
CREATE POLICY "public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "admin write product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "admin update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "admin delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "anyone upload customer files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'customer-uploads');
CREATE POLICY "admin read customer files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'customer-uploads' AND public.is_admin());
