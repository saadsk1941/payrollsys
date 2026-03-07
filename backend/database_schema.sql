-- Auto-generated SQLite schema for Smart Payroll & HR System
-- Generated from backend/db.sqlite3

PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

-- table: accounts_user
CREATE TABLE "accounts_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "password" varchar(128) NOT NULL, "last_login" datetime NULL, "is_superuser" bool NOT NULL, "username" varchar(150) NOT NULL UNIQUE, "first_name" varchar(150) NOT NULL, "last_name" varchar(150) NOT NULL, "email" varchar(254) NOT NULL, "is_staff" bool NOT NULL, "is_active" bool NOT NULL, "date_joined" datetime NOT NULL, "role" varchar(20) NOT NULL, "phone" varchar(15) NULL, "address" text NULL, "page_permissions" text NOT NULL CHECK ((JSON_VALID("page_permissions") OR "page_permissions" IS NULL)));

-- table: accounts_user_groups
CREATE TABLE "accounts_user_groups" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "user_id" bigint NOT NULL REFERENCES "accounts_user" ("id") DEFERRABLE INITIALLY DEFERRED, "group_id" integer NOT NULL REFERENCES "auth_group" ("id") DEFERRABLE INITIALLY DEFERRED);

-- table: accounts_user_user_permissions
CREATE TABLE "accounts_user_user_permissions" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "user_id" bigint NOT NULL REFERENCES "accounts_user" ("id") DEFERRABLE INITIALLY DEFERRED, "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id") DEFERRABLE INITIALLY DEFERRED);

-- table: attendance_attendance
CREATE TABLE "attendance_attendance" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "date" date NOT NULL, "status" varchar(10) NOT NULL, "employee_id" bigint NOT NULL REFERENCES "employees_employee" ("id") DEFERRABLE INITIALLY DEFERRED, "overtime_hours" decimal NOT NULL);

-- table: auth_group
CREATE TABLE "auth_group" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(150) NOT NULL UNIQUE);

-- table: auth_group_permissions
CREATE TABLE "auth_group_permissions" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "group_id" integer NOT NULL REFERENCES "auth_group" ("id") DEFERRABLE INITIALLY DEFERRED, "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id") DEFERRABLE INITIALLY DEFERRED);

-- table: auth_permission
CREATE TABLE "auth_permission" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "content_type_id" integer NOT NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED, "codename" varchar(100) NOT NULL, "name" varchar(255) NOT NULL);

-- table: django_admin_log
CREATE TABLE "django_admin_log" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "object_id" text NULL, "object_repr" varchar(200) NOT NULL, "action_flag" smallint unsigned NOT NULL CHECK ("action_flag" >= 0), "change_message" text NOT NULL, "content_type_id" integer NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED, "user_id" bigint NOT NULL REFERENCES "accounts_user" ("id") DEFERRABLE INITIALLY DEFERRED, "action_time" datetime NOT NULL);

-- table: django_content_type
CREATE TABLE "django_content_type" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "app_label" varchar(100) NOT NULL, "model" varchar(100) NOT NULL);

-- table: django_migrations
CREATE TABLE "django_migrations" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "app" varchar(255) NOT NULL, "name" varchar(255) NOT NULL, "applied" datetime NOT NULL);

-- table: django_session
CREATE TABLE "django_session" ("session_key" varchar(40) NOT NULL PRIMARY KEY, "session_data" text NOT NULL, "expire_date" datetime NOT NULL);

-- table: employees_employee
CREATE TABLE "employees_employee" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(255) NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "phone" varchar(20) NULL, "department" varchar(100) NULL, "designation" varchar(100) NULL, "joining_date" date NOT NULL, "basic_salary" decimal NOT NULL, "user_id" bigint NULL UNIQUE REFERENCES "accounts_user" ("id") DEFERRABLE INITIALLY DEFERRED);

-- table: leave_management_leave
CREATE TABLE "leave_management_leave" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "leave_type" varchar(20) NOT NULL, "from_date" date NOT NULL, "to_date" date NOT NULL, "status" varchar(20) NOT NULL, "reason" text NULL, "employee_id" bigint NOT NULL REFERENCES "employees_employee" ("id") DEFERRABLE INITIALLY DEFERRED);

-- table: payroll_payroll
CREATE TABLE "payroll_payroll" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "month" date NOT NULL, "basic_salary" decimal NOT NULL, "allowances" decimal NOT NULL, "deductions" decimal NOT NULL, "net_salary" decimal NOT NULL, "employee_id" bigint NOT NULL REFERENCES "employees_employee" ("id") DEFERRABLE INITIALLY DEFERRED, "overtime_amount" decimal NOT NULL, "overtime_hours" decimal NOT NULL, "overtime_rate" decimal NOT NULL);

-- index: accounts_user_groups_group_id_bd11a704
CREATE INDEX "accounts_user_groups_group_id_bd11a704" ON "accounts_user_groups" ("group_id");

-- index: accounts_user_groups_user_id_52b62117
CREATE INDEX "accounts_user_groups_user_id_52b62117" ON "accounts_user_groups" ("user_id");

-- index: accounts_user_groups_user_id_group_id_59c0b32f_uniq
CREATE UNIQUE INDEX "accounts_user_groups_user_id_group_id_59c0b32f_uniq" ON "accounts_user_groups" ("user_id", "group_id");

-- index: accounts_user_user_permissions_permission_id_113bb443
CREATE INDEX "accounts_user_user_permissions_permission_id_113bb443" ON "accounts_user_user_permissions" ("permission_id");

-- index: accounts_user_user_permissions_user_id_e4f0a161
CREATE INDEX "accounts_user_user_permissions_user_id_e4f0a161" ON "accounts_user_user_permissions" ("user_id");

-- index: accounts_user_user_permissions_user_id_permission_id_2ab516c2_uniq
CREATE UNIQUE INDEX "accounts_user_user_permissions_user_id_permission_id_2ab516c2_uniq" ON "accounts_user_user_permissions" ("user_id", "permission_id");

-- index: attendance_attendance_employee_id_63b4db5a
CREATE INDEX "attendance_attendance_employee_id_63b4db5a" ON "attendance_attendance" ("employee_id");

-- index: attendance_attendance_employee_id_date_cb2c479f_uniq
CREATE UNIQUE INDEX "attendance_attendance_employee_id_date_cb2c479f_uniq" ON "attendance_attendance" ("employee_id", "date");

-- index: auth_group_permissions_group_id_b120cbf9
CREATE INDEX "auth_group_permissions_group_id_b120cbf9" ON "auth_group_permissions" ("group_id");

-- index: auth_group_permissions_group_id_permission_id_0cd325b0_uniq
CREATE UNIQUE INDEX "auth_group_permissions_group_id_permission_id_0cd325b0_uniq" ON "auth_group_permissions" ("group_id", "permission_id");

-- index: auth_group_permissions_permission_id_84c5c92e
CREATE INDEX "auth_group_permissions_permission_id_84c5c92e" ON "auth_group_permissions" ("permission_id");

-- index: auth_permission_content_type_id_2f476e4b
CREATE INDEX "auth_permission_content_type_id_2f476e4b" ON "auth_permission" ("content_type_id");

-- index: auth_permission_content_type_id_codename_01ab375a_uniq
CREATE UNIQUE INDEX "auth_permission_content_type_id_codename_01ab375a_uniq" ON "auth_permission" ("content_type_id", "codename");

-- index: django_admin_log_content_type_id_c4bce8eb
CREATE INDEX "django_admin_log_content_type_id_c4bce8eb" ON "django_admin_log" ("content_type_id");

-- index: django_admin_log_user_id_c564eba6
CREATE INDEX "django_admin_log_user_id_c564eba6" ON "django_admin_log" ("user_id");

-- index: django_content_type_app_label_model_76bd3d3b_uniq
CREATE UNIQUE INDEX "django_content_type_app_label_model_76bd3d3b_uniq" ON "django_content_type" ("app_label", "model");

-- index: django_session_expire_date_a5c62663
CREATE INDEX "django_session_expire_date_a5c62663" ON "django_session" ("expire_date");

-- index: leave_management_leave_employee_id_703574c2
CREATE INDEX "leave_management_leave_employee_id_703574c2" ON "leave_management_leave" ("employee_id");

-- index: payroll_payroll_employee_id_cd24ccf6
CREATE INDEX "payroll_payroll_employee_id_cd24ccf6" ON "payroll_payroll" ("employee_id");

-- index: payroll_payroll_employee_id_month_a9abffd7_uniq
CREATE UNIQUE INDEX "payroll_payroll_employee_id_month_a9abffd7_uniq" ON "payroll_payroll" ("employee_id", "month");

COMMIT;
PRAGMA foreign_keys=ON;