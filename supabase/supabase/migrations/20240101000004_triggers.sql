SET search_path TO clinica, extensions;

CREATE OR REPLACE FUNCTION clinica.trigger_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER set_updated_at_perfiles BEFORE UPDATE ON clinica.perfiles FOR EACH ROW EXECUTE FUNCTION clinica.trigger_set_updated_at();
CREATE TRIGGER set_updated_at_doctores BEFORE UPDATE ON clinica.doctores FOR EACH ROW EXECUTE FUNCTION clinica.trigger_set_updated_at();
CREATE TRIGGER set_updated_at_procedimientos BEFORE UPDATE ON clinica.procedimientos FOR EACH ROW EXECUTE FUNCTION clinica.trigger_set_updated_at();
CREATE TRIGGER set_updated_at_pacientes BEFORE UPDATE ON clinica.pacientes FOR EACH ROW EXECUTE FUNCTION clinica.trigger_set_updated_at();
CREATE TRIGGER set_updated_at_citas BEFORE UPDATE ON clinica.citas FOR EACH ROW EXECUTE FUNCTION clinica.trigger_set_updated_at();

CREATE OR REPLACE FUNCTION clinica.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = clinica, extensions AS $$
BEGIN
  INSERT INTO clinica.perfiles (id, email, nombre, apellido_paterno, avatar_url, rol)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.raw_user_meta_data->>'avatar_url', 'cliente'
  ) ON CONFLICT (id) DO NOTHING;
  INSERT INTO clinica.pacientes (perfil_id, nombre, apellido_paterno, email, es_familiar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email, FALSE
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION clinica.handle_new_user();
