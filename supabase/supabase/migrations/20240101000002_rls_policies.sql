SET search_path TO clinica, extensions;

ALTER TABLE clinica.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinica.doctores ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinica.sucursales ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinica.categorias_procedimiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinica.procedimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinica.doctor_procedimiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinica.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinica.citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinica.configuracion_clinica ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinica.horarios_bloqueados ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION clinica.is_staff()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = clinica, extensions AS $$
  SELECT EXISTS (
    SELECT 1 FROM clinica.perfiles
    WHERE id = auth.uid() AND rol IN ('administrador', 'empleado', 'doctor')
  );
$$;

CREATE OR REPLACE FUNCTION clinica.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = clinica, extensions AS $$
  SELECT EXISTS (
    SELECT 1 FROM clinica.perfiles WHERE id = auth.uid() AND rol = 'administrador'
  );
$$;

-- perfiles
CREATE POLICY "perfiles_select" ON clinica.perfiles FOR SELECT USING (id = auth.uid() OR clinica.is_staff());
CREATE POLICY "perfiles_insert" ON clinica.perfiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "perfiles_update" ON clinica.perfiles FOR UPDATE USING (id = auth.uid() OR clinica.is_admin());
CREATE POLICY "perfiles_delete" ON clinica.perfiles FOR DELETE USING (clinica.is_admin());

-- doctores
CREATE POLICY "doctores_select" ON clinica.doctores FOR SELECT USING (TRUE);
CREATE POLICY "doctores_write" ON clinica.doctores FOR ALL USING (clinica.is_admin());

-- sucursales
CREATE POLICY "sucursales_select" ON clinica.sucursales FOR SELECT USING (TRUE);
CREATE POLICY "sucursales_write" ON clinica.sucursales FOR ALL USING (clinica.is_admin());

-- categorias
CREATE POLICY "categorias_select" ON clinica.categorias_procedimiento FOR SELECT USING (TRUE);
CREATE POLICY "categorias_write" ON clinica.categorias_procedimiento FOR ALL USING (clinica.is_admin());

-- procedimientos
CREATE POLICY "procedimientos_select" ON clinica.procedimientos FOR SELECT USING (activo = TRUE OR clinica.is_staff());
CREATE POLICY "procedimientos_write" ON clinica.procedimientos FOR ALL USING (clinica.is_admin());

-- doctor_procedimiento
CREATE POLICY "dp_select" ON clinica.doctor_procedimiento FOR SELECT USING (TRUE);
CREATE POLICY "dp_write" ON clinica.doctor_procedimiento FOR ALL USING (clinica.is_admin());

-- pacientes
CREATE POLICY "pacientes_select" ON clinica.pacientes FOR SELECT USING (
  perfil_id = auth.uid() OR clinica.is_staff()
);
CREATE POLICY "pacientes_insert" ON clinica.pacientes FOR INSERT WITH CHECK (
  perfil_id = auth.uid() OR clinica.is_staff()
);
CREATE POLICY "pacientes_update" ON clinica.pacientes FOR UPDATE USING (
  perfil_id = auth.uid() OR clinica.is_staff()
);
CREATE POLICY "pacientes_delete" ON clinica.pacientes FOR DELETE USING (clinica.is_admin());

-- citas
CREATE POLICY "citas_select" ON clinica.citas FOR SELECT USING (
  agendado_por = auth.uid() OR clinica.is_staff()
);
CREATE POLICY "citas_insert" ON clinica.citas FOR INSERT WITH CHECK (
  agendado_por = auth.uid() OR clinica.is_staff()
);
CREATE POLICY "citas_update" ON clinica.citas FOR UPDATE USING (
  agendado_por = auth.uid() OR clinica.is_staff()
);
CREATE POLICY "citas_delete" ON clinica.citas FOR DELETE USING (clinica.is_admin());

-- configuracion
CREATE POLICY "config_select" ON clinica.configuracion_clinica FOR SELECT USING (clinica.is_staff());
CREATE POLICY "config_write" ON clinica.configuracion_clinica FOR ALL USING (clinica.is_admin());

-- horarios
CREATE POLICY "horarios_select" ON clinica.horarios_bloqueados FOR SELECT USING (clinica.is_staff());
CREATE POLICY "horarios_write" ON clinica.horarios_bloqueados FOR ALL USING (clinica.is_admin());
