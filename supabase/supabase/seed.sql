SET search_path TO clinica, extensions;

INSERT INTO clinica.sucursales (id, nombre, direccion, colonia, ciudad, estado, codigo_postal, telefono, email, maps_url) VALUES
('00000000-0000-0000-0000-000000000001', 'SGCD Clínica Dental Premium', 'Av. Presidente Masaryk 123, Piso 3', 'Polanco V Sección', 'Ciudad de México', 'CDMX', '11560', '+52 55 1234 5678', 'contacto@sgcd.mx', 'https://maps.google.com/?q=Av.+Presidente+Masaryk+123+Polanco+CDMX');

INSERT INTO clinica.categorias_procedimiento (id, nombre, descripcion, icono, orden_display) VALUES
('10000000-0000-0000-0000-000000000001', 'Odontología General', 'Tratamientos preventivos y de rutina', 'tooth', 1),
('10000000-0000-0000-0000-000000000002', 'Ortodoncia', 'Corrección de la alineación dental', 'align', 2),
('10000000-0000-0000-0000-000000000003', 'Implantología', 'Implantes dentales de titanio', 'implant', 3),
('10000000-0000-0000-0000-000000000004', 'Estética Dental', 'Procedimientos estéticos y blanqueamiento', 'sparkles', 4),
('10000000-0000-0000-0000-000000000005', 'Endodoncia', 'Tratamiento de conductos y raíz', 'root', 5),
('10000000-0000-0000-0000-000000000006', 'Periodoncia', 'Tratamiento de encías y soporte dental', 'gum', 6);

INSERT INTO clinica.procedimientos (id, categoria_id, nombre, descripcion, descripcion_larga, duracion, duracion_minutos, precio, orden_display) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Consulta y Diagnóstico', 'Evaluación completa del estado bucal', 'Evaluación integral que incluye revisión de encías, dientes, radiografías y plan de tratamiento personalizado.', '1_hora', 60, 800.00, 1),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Limpieza Dental Profesional', 'Profilaxis y remoción de sarro', 'Eliminación completa de placa bacteriana, sarro y manchas. Incluye pulido dental y fluorización preventiva.', '1_hora', 60, 1200.00, 2),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Extracción Dental Simple', 'Extracción de piezas dentales', 'Extracción de dientes comprometidos con anestesia local y seguimiento postoperatorio.', '1_hora', 60, 1500.00, 3),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Restauración con Resina', 'Empastes de resina compuesta', 'Restauración estética con resina compuesta de última generación.', '1_hora', 60, 1800.00, 4),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000004', 'Blanqueamiento Dental', 'Blanqueamiento profesional con lámpara LED', 'Tratamiento con lámpara LED de alta potencia. Resultados inmediatos, hasta 8 tonos más claro.', '2_horas', 120, 5500.00, 1),
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004', 'Carillas de Porcelana', 'Facetas de porcelana para sonrisa perfecta', 'Diseño y colocación de carillas de porcelana ultrafinas para transformar la forma, color y alineación de los dientes frontales.', '3_horas', 180, 18000.00, 2),
('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', 'Consulta de Ortodoncia', 'Evaluación y plan ortodóntico', 'Análisis cefalométrico, fotos, modelos de estudio y plan de tratamiento con brackets o alineadores.', '1_hora', 60, 1000.00, 1),
('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003', 'Implante Dental Unitario', 'Colocación de implante de titanio', 'Colocación quirúrgica de implante de titanio con carga inmediata. Incluye corona de porcelana.', '3_horas', 180, 35000.00, 1),
('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000003', 'Evaluación para Implantes', 'Valoración ósea para implantes', 'Tomografía cone beam, análisis de densidad ósea y plan quirúrgico para implantes.', '2_horas', 120, 2500.00, 2),
('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000005', 'Tratamiento de Conducto', 'Endodoncia multiradicular', 'Tratamiento de conductos con equipo rotatorio de última generación y sellado hermético.', '2_horas', 120, 8500.00, 1);

INSERT INTO clinica.doctores (id, nombre_completo, cedula_profesional, especialidad, sub_especialidad, descripcion, orden_display, activo) VALUES
('30000000-0000-0000-0000-000000000001', 'Dr. Fernando Camba Ruiz', 'DGP-8821547', 'Cirugía Bucal e Implantología', 'Implantología Avanzada y Cirugía Maxilofacial', 'El Dr. Fernando Camba Ruiz es especialista en Cirugía Bucal e Implantología con más de 15 años de experiencia. Egresado con honores de la UNAM y con posgrado en la Universidad Complutense de Madrid. Ha colocado más de 3,000 implantes dentales con una tasa de éxito del 98.7%. Miembro activo de la Sociedad Mexicana de Implantología.', 1, TRUE),
('30000000-0000-0000-0000-000000000002', 'Dr. Miguel Ángel Moreno Vázquez', 'DGP-7654321', 'Ortodoncia y Ortopedia Maxilofacial', 'Alineadores Invisibles y Ortodoncia Digital', 'El Dr. Miguel Ángel Moreno Vázquez es ortodoncista especialista en tratamientos digitales de vanguardia. Formado en el IERO y con estancias en el Roth-Williams Center en California. Pionero en ortodoncia lingual en México. 12 años transformando más de 2,500 sonrisas.', 2, TRUE),
('30000000-0000-0000-0000-000000000003', 'Dr. Leonardo López Pineda', 'DGP-9988776', 'Endodoncia y Estética Dental', 'Microendodoncia y Diseño de Sonrisa Digital', 'El Dr. Leonardo López Pineda combina expertise en endodoncia de última generación con un agudo sentido estético. Posgrado en la Universidad de Michigan, domina técnicas de microendodoncia asistida por microscopio y diseño de sonrisa digital. Miembro de la AAE (American Association of Endodontists).', 3, TRUE);

INSERT INTO clinica.doctor_procedimiento (doctor_id, procedimiento_id) VALUES
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003'),
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008'),
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005'),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004'),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005'),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006'),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000010');

INSERT INTO clinica.configuracion_clinica (clave, valor, descripcion) VALUES
('clinica_nombre', 'SGCD Clínica Dental Premium', 'Nombre de la clínica'),
('clinica_slogan', 'Tu sonrisa, nuestra pasión', 'Slogan'),
('horario_apertura', '09:00', 'Apertura'),
('horario_cierre', '16:00', 'Cierre'),
('dias_atencion', 'Lunes,Martes,Miércoles,Jueves,Viernes', 'Días de atención'),
('telefono_principal', '+52 55 1234 5678', 'Teléfono'),
('email_principal', 'contacto@sgcd.mx', 'Email'),
('instagram', '@sgcd.dental', 'Instagram'),
('facebook', 'SGCD Clínica Dental', 'Facebook');
