CREATE OR REPLACE FUNCTION public.assign_designated_verified_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'karambizicedric91@gmail.com' AND NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.assign_designated_verified_admin() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER assign_designated_admin_after_insert AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.assign_designated_verified_admin();
CREATE TRIGGER assign_designated_admin_after_confirmation AFTER UPDATE OF email_confirmed_at ON auth.users FOR EACH ROW EXECUTE FUNCTION public.assign_designated_verified_admin();