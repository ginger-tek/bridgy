CREATE TABLE
  IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS class_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    classId INTEGER NOT NULL,
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classId) REFERENCES classes (id) ON DELETE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS class_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    classId INTEGER NOT NULL,
    personId INTEGER NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'instructor', 'assistant')),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classId) REFERENCES classes (id) ON DELETE CASCADE,
    FOREIGN KEY (personId) REFERENCES people (id) ON DELETE CASCADE,
    UNIQUE (classId, personId, role)
  );

DROP VIEW IF EXISTS v_people;

CREATE VIEW
  v_people AS
SELECT
  p.id,
  p.firstName,
  p.lastName,
  (p.firstName || ' ' || p.lastName) AS fullName,
  p.email,
  p.created,
  p.modified
FROM
  people p;

DROP VIEW IF EXISTS v_students;

CREATE VIEW
  v_students AS
SELECT
  ca.id,
  ca.personId AS personId,
  p.fullName as personFullName,
  GROUP_CONCAT (c.id || ':' || c.title, ',') AS classes
FROM
  class_assignments ca
  LEFT JOIN classes c ON ca.classId = c.id
  LEFT JOIN v_people p ON ca.personId = p.id
WHERE
  ca.role = 'student'
GROUP BY
  ca.personId;

DROP VIEW IF EXISTS v_class_assignments;

CREATE VIEW
  v_class_assignments AS
SELECT
  ca.id,
  ca.classId AS classId,
  c.title AS classTitle,
  ca.personId AS personId,
  p.fullName as personFullName,
  ca.role,
  ca.created,
  ca.modified
FROM
  class_assignments ca
  LEFT JOIN classes c ON ca.classId = c.id
  LEFT JOIN v_people p ON ca.personId = p.id
GROUP BY
  ca.id,
  ca.classId,
  ca.personId;

DROP VIEW IF EXISTS v_classes;

CREATE VIEW
  v_classes AS
WITH
  StudentCounts AS (
    SELECT
      cas.classId,
      COUNT(cas.id) AS studentCount,
      GROUP_CONCAT (p.id || ':' || p.fullName, ',') AS studentsNames
    FROM
      class_assignments cas
      LEFT JOIN v_people p ON cas.personId = p.id
    WHERE
      cas.role = 'student'
    GROUP BY
      cas.classId
  ),
  InstructorCounts AS (
    SELECT
      cai.classId,
      COUNT(cai.id) AS instructorCount,
      GROUP_CONCAT (p.id || ':' || p.fullName, ',') AS instructorsNames
    FROM
      class_assignments cai
      LEFT JOIN v_people p ON cai.personId = p.id
    WHERE
      cai.role IN ('instructor', 'assistant')
    GROUP BY
      cai.classId
  )
SELECT
  c.id,
  c.title,
  sc.studentsNames,
  ic.instructorsNames,
  COALESCE(sc.studentCount, 0) AS studentCount,
  COALESCE(ic.instructorCount, 0) AS instructorCount,
  c.created,
  c.modified
FROM
  classes c
  LEFT JOIN StudentCounts sc ON c.id = sc.classId
  LEFT JOIN InstructorCounts ic ON c.id = ic.classId
GROUP BY
  c.id,
  c.title,
  c.created,
  c.modified
ORDER BY
  c.id;

DROP VIEW IF EXISTS v_class_schedules;

CREATE VIEW
  v_class_schedules AS
SELECT
  cs.id,
  cs.classId,
  c.title AS classTitle,
  cs.startTime,
  cs.endTime,
  cs.created,
  cs.modified
FROM
  class_schedules cs
  LEFT JOIN classes c ON cs.classId = c.id;

DROP VIEW IF EXISTS v_class_campaigns;

CREATE VIEW
  v_class_campaigns AS
SELECT
  cc.id,
  cc.classId,
  c.title AS classTitle,
  cc.campaignId,
  cam.title AS campaignTitle,
  cc.created,
  cc.modified
FROM
  class_campaigns cc
  LEFT JOIN classes c ON cc.classId = c.id
  LEFT JOIN campaigns cam ON cc.campaignId = cam.id;