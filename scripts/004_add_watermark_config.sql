-- Insert UI watermark configuration
INSERT INTO public.platform_settings (key, value)
VALUES (
  'ui_watermark',
  jsonb_build_object(
    'text', 'Emil Məcidov',
    'opacity', 0.07,
    'rotation', -30,
    'size', 'large',
    'enabled', true
  )
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert additional platform branding
INSERT INTO public.platform_settings (key, value)
VALUES (
  'branding',
  jsonb_build_object(
    'platform_name', 'Azerbaijan AI Platform - EduTest AZ',
    'version', '1.0.0',
    'owner', 'Emil Məcidov'
  )
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
