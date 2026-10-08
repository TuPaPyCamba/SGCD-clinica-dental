SET search_path TO clinica, extensions;

REVOKE ALL ON ALL TABLES IN SCHEMA clinica FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA clinica FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA clinica TO service_role;

CREATE OR REPLACE FUNCTION clinica.rpc_get_app_initial_data()
RETURNS JSON LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = clinica, extensions AS $$
BEGIN
  RETURN json_build_object(
    'doctores', (
      SELECT json_agg(row_to_json(d)) FROM (
        SELECT id, nombre_completo, especialidad, sub_especialidad, descripcion, foto_url, activo, orden_display
        FROM clinica.doctores WHERE activo = TRUE ORDER BY orden_display
      ) d
    ),
    'procedimientos', (
      SELECT json_agg(row_to_json(p)) FROM (
        SELECT p.id, p.nombre, p.descripcion, p.descripcion_larga, p.duracion_minutos, p.precio, p.activo, p.imagen_url, p.orden_display, c.nombre AS categoria_nombre
        FROM clinica.procedimientos p
        LEFT JOIN clinica.categorias_procedimiento c ON c.id = p.categoria_id
        WHERE p.activo = TRUE ORDER BY p.orden_display
      ) p
    ),
    'sucursales', (
      SELECT json_agg(row_to_json(s)) FROM (SELECT * FROM clinica.sucursales WHERE activa = TRUE) s
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION clinica.rpc_get_mi_perfil()
RETURNS JSON LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = clinica, extensions AS $$
DECLARE v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'No autenticado' USING ERRCODE = '28000'; END IF;
  RETURN (SELECT row_to_json(p) FROM (
    SELECT id, email, nombre, apellido_paterno, apellido_materno, telefono, fecha_nacimiento, genero, avatar_url, rol, activo, created_at
    FROM clinica.perfiles WHERE id = v_user_id
  ) p);
END;
$$;

CREATE OR REPLACE FUNCTION clinica.rpc_get_mis_pacientes()
RETURNS JSON LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = clinica, extensions AS $$
DECLARE v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'No autenticado' USING ERRCODE = '28000'; END IF;
  RETURN (SELECT json_agg(row_to_json(p)) FROM (
    SELECT id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, genero, telefono, email, alergias, es_familiar, familiar_de, created_at
    FROM clinica.pacientes WHERE perfil_id = v_user_id ORDER BY es_familiar, nombre
  ) p);
END;
$$;

CREATE OR REPLACE FUNCTION clinica.rpc_get_mis_citas(
  p_estado TEXT DEFAULT NULL, p_limit INTEGER DEFAULT 20, p_offset INTEGER DEFAULT 0
)
RETURNS JSON LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = clinica, extensions AS $$
DECLARE v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'No autenticado' USING ERRCODE = '28000'; END IF;
  RETURN (SELECT json_agg(row_to_json(c)) FROM (
    SELECT
      cit.id, cit.fecha_hora_inicio, cit.fecha_hora_fin, cit.estado, cit.notas_cliente, cit.resumen_doctor, cit.created_at,
      json_build_object('id', pac.id, 'nombre', pac.nombre, 'apellido_paterno', pac.apellido_paterno) AS paciente,
      json_build_object('id', doc.id, 'nombre_completo', doc.nombre_completo, 'especialidad', doc.especialidad) AS doctor,
      json_build_object('id', proc.id, 'nombre', proc.nombre, 'duracion_minutos', proc.duracion_minutos) AS procedimiento,
      json_build_object('id', suc.id, 'nombre', suc.nombre, 'direccion', suc.direccion, 'maps_url', suc.maps_url) AS sucursal
    FROM clinica.citas cit
    JOIN clinica.pacientes pac ON pac.id = cit.paciente_id
    JOIN clinica.doctores doc ON doc.id = cit.doctor_id
    JOIN clinica.procedimientos proc ON proc.id = cit.procedimiento_id
    JOIN clinica.sucursales suc ON suc.id = cit.sucursal_id
    WHERE cit.agendado_por = v_user_id AND (p_estado IS NULL OR cit.estado::TEXT = p_estado)
    ORDER BY cit.fecha_hora_inicio DESC LIMIT p_limit OFFSET p_offset
  ) c);
END;
$$;

CREATE OR REPLACE FUNCTION clinica.rpc_agendar_cita(
  p_paciente_id UUID, p_doctor_id UUID, p_procedimiento_id UUID, p_sucursal_id UUID,
  p_fecha_hora_inicio TIMESTAMPTZ, p_notas_cliente TEXT DEFAULT NULL
)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER
SET search_path = clinica, extensions AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_proc RECORD;
  v_fecha_hora_fin TIMESTAMPTZ;
  v_dia_semana INTEGER;
  v_cita_id UUID;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'No autenticado' USING ERRCODE = '28000'; END IF;
  SELECT * INTO v_proc FROM clinica.procedimientos WHERE id = p_procedimiento_id AND activo = TRUE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Procedimiento no encontrado' USING ERRCODE = 'P0001'; END IF;
  v_fecha_hora_fin := p_fecha_hora_inicio + (v_proc.duracion_minutos * INTERVAL '1 minute');
  v_dia_semana := EXTRACT(DOW FROM p_fecha_hora_inicio AT TIME ZONE 'America/Mexico_City');
  IF v_dia_semana = 0 OR v_dia_semana = 6 THEN
    RAISE EXCEPTION 'Solo se atiende de lunes a viernes' USING ERRCODE = 'P0001';
  END IF;
  IF EXTRACT(HOUR FROM p_fecha_hora_inicio AT TIME ZONE 'America/Mexico_City') < 9 OR
     EXTRACT(HOUR FROM v_fecha_hora_fin AT TIME ZONE 'America/Mexico_City') > 16 THEN
    RAISE EXCEPTION 'El horario de atención es de 9:00 a 16:00' USING ERRCODE = 'P0001';
  END IF;
  IF EXISTS (
    SELECT 1 FROM clinica.citas
    WHERE doctor_id = p_doctor_id AND estado NOT IN ('cancelada', 'no_asistio')
      AND tstzrange(fecha_hora_inicio, fecha_hora_fin, '[)') && tstzrange(p_fecha_hora_inicio, v_fecha_hora_fin, '[)')
  ) THEN
    RAISE EXCEPTION 'El doctor no está disponible en ese horario' USING ERRCODE = 'P0001';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM clinica.doctor_procedimiento WHERE doctor_id = p_doctor_id AND procedimiento_id = p_procedimiento_id) THEN
    RAISE EXCEPTION 'El doctor no realiza este procedimiento' USING ERRCODE = 'P0001';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM clinica.pacientes WHERE id = p_paciente_id AND (perfil_id = v_user_id OR clinica.is_staff())) THEN
    RAISE EXCEPTION 'Paciente no encontrado' USING ERRCODE = 'P0001';
  END IF;
  INSERT INTO clinica.citas (paciente_id, doctor_id, procedimiento_id, sucursal_id, agendado_por, fecha_hora_inicio, fecha_hora_fin, notas_cliente)
  VALUES (p_paciente_id, p_doctor_id, p_procedimiento_id, p_sucursal_id, v_user_id, p_fecha_hora_inicio, v_fecha_hora_fin, p_notas_cliente)
  RETURNING id INTO v_cita_id;
  RETURN json_build_object('cita_id', v_cita_id, 'fecha_hora_fin', v_fecha_hora_fin);
END;
$$;

CREATE OR REPLACE FUNCTION clinica.rpc_cancelar_cita(p_cita_id UUID, p_motivo TEXT DEFAULT NULL)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER
SET search_path = clinica, extensions AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_cita RECORD;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'No autenticado' USING ERRCODE = '28000'; END IF;
  SELECT * INTO v_cita FROM clinica.citas WHERE id = p_cita_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Cita no encontrada' USING ERRCODE = 'P0001'; END IF;
  IF v_cita.agendado_por != v_user_id AND NOT clinica.is_staff() THEN
    RAISE EXCEPTION 'Sin permiso' USING ERRCODE = '42501';
  END IF;
  IF v_cita.estado IN ('completada', 'cancelada') THEN
    RAISE EXCEPTION 'Esta cita no puede cancelarse' USING ERRCODE = 'P0001';
  END IF;
  UPDATE clinica.citas SET estado = 'cancelada', notas_internas = COALESCE(p_motivo, notas_internas), updated_at = NOW() WHERE id = p_cita_id;
  RETURN json_build_object('success', TRUE, 'cita_id', p_cita_id);
END;
$$;

CREATE OR REPLACE FUNCTION clinica.rpc_doctor_subir_resumen(p_cita_id UUID, p_resumen TEXT)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER
SET search_path = clinica, extensions AS $$
DECLARE v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'No autenticado' USING ERRCODE = '28000'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM clinica.citas c JOIN clinica.doctores d ON d.id = c.doctor_id
    WHERE c.id = p_cita_id AND (d.perfil_id = v_user_id OR clinica.is_admin())
  ) THEN
    RAISE EXCEPTION 'Sin permiso' USING ERRCODE = '42501';
  END IF;
  UPDATE clinica.citas SET resumen_doctor = p_resumen, estado = 'completada', updated_at = NOW() WHERE id = p_cita_id;
  RETURN json_build_object('success', TRUE);
END;
$$;

CREATE OR REPLACE FUNCTION clinica.rpc_get_disponibilidad(
  p_doctor_id UUID, p_fecha DATE, p_duracion_minutos INTEGER
)
RETURNS JSON LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = clinica, extensions AS $$
DECLARE
  v_dia_semana INTEGER;
  v_slots JSON;
BEGIN
  v_dia_semana := EXTRACT(DOW FROM p_fecha);
  IF v_dia_semana = 0 OR v_dia_semana = 6 THEN
    RETURN json_build_object('disponible', FALSE, 'slots', '[]'::JSON);
  END IF;
  SELECT json_agg(slot ORDER BY slot) INTO v_slots
  FROM (
    SELECT generate_series(
      (p_fecha || ' 09:00')::TIMESTAMPTZ,
      (p_fecha || ' 16:00')::TIMESTAMPTZ - (p_duracion_minutos * INTERVAL '1 minute'),
      INTERVAL '30 minutes'
    ) AS slot
  ) slots
  WHERE NOT EXISTS (
    SELECT 1 FROM clinica.citas
    WHERE doctor_id = p_doctor_id AND estado NOT IN ('cancelada', 'no_asistio')
      AND tstzrange(fecha_hora_inicio, fecha_hora_fin, '[)') && tstzrange(slot, slot + (p_duracion_minutos * INTERVAL '1 minute'), '[)')
  );
  RETURN json_build_object('disponible', TRUE, 'slots', COALESCE(v_slots, '[]'::JSON));
END;
$$;

GRANT EXECUTE ON FUNCTION clinica.rpc_get_app_initial_data() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION clinica.rpc_get_mi_perfil() TO authenticated;
GRANT EXECUTE ON FUNCTION clinica.rpc_get_mis_pacientes() TO authenticated;
GRANT EXECUTE ON FUNCTION clinica.rpc_get_mis_citas(TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION clinica.rpc_agendar_cita(UUID, UUID, UUID, UUID, TIMESTAMPTZ, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION clinica.rpc_cancelar_cita(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION clinica.rpc_doctor_subir_resumen(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION clinica.rpc_get_disponibilidad(UUID, DATE, INTEGER) TO anon, authenticated;
