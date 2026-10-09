-- =====================================================================
-- DDL - Instituto
-- Tablas, claves primarias, claves foráneas, restricciones e índices
-- =====================================================================

CREATE TABLE IF NOT EXISTS profesores (
    id            SERIAL PRIMARY KEY,
    nombre        VARCHAR(80)  NOT NULL,
    apellido      VARCHAR(80)  NOT NULL,
    email         VARCHAR(120) NOT NULL UNIQUE,
    especialidad  VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS alumnos (
    id                SERIAL PRIMARY KEY,
    nombre            VARCHAR(80)  NOT NULL,
    apellido          VARCHAR(80)  NOT NULL,
    dni               VARCHAR(15)  NOT NULL UNIQUE,
    email             VARCHAR(120) NOT NULL UNIQUE,
    fecha_nacimiento  DATE,
    created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_alumnos_fecha CHECK (fecha_nacimiento IS NULL OR fecha_nacimiento < CURRENT_DATE)
);

CREATE TABLE IF NOT EXISTS cursos (
    id           SERIAL PRIMARY KEY,
    nombre       VARCHAR(120) NOT NULL UNIQUE,
    descripcion  TEXT,
    cupo         INTEGER NOT NULL,
    profesor_id  INTEGER,
    CONSTRAINT ck_cursos_cupo CHECK (cupo > 0),
    CONSTRAINT fk_cursos_profesor FOREIGN KEY (profesor_id)
        REFERENCES profesores (id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS inscripciones (
    id                 SERIAL PRIMARY KEY,
    alumno_id          INTEGER NOT NULL,
    curso_id           INTEGER NOT NULL,
    fecha_inscripcion  DATE NOT NULL DEFAULT CURRENT_DATE,
    estado             VARCHAR(15) NOT NULL DEFAULT 'activa',
    nota               NUMERIC(4,2),
    CONSTRAINT ck_inscripciones_estado CHECK (estado IN ('activa', 'baja', 'finalizada')),
    CONSTRAINT ck_inscripciones_nota   CHECK (nota IS NULL OR (nota >= 0 AND nota <= 10)),
    CONSTRAINT uq_inscripciones_alumno_curso UNIQUE (alumno_id, curso_id),
    CONSTRAINT fk_inscripciones_alumno FOREIGN KEY (alumno_id)
        REFERENCES alumnos (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_inscripciones_curso FOREIGN KEY (curso_id)
        REFERENCES cursos (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cursos_profesor      ON cursos (profesor_id);
CREATE INDEX IF NOT EXISTS idx_inscripciones_alumno ON inscripciones (alumno_id);
CREATE INDEX IF NOT EXISTS idx_inscripciones_curso  ON inscripciones (curso_id);