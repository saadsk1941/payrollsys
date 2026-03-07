# Smart Payroll and HR Management System
## Black Book (53 Pages)

Note: Replace placeholders like [College Name], [Student Name], [Roll No.], [Guide Name] before final print.

## Page 1 - Cover Page
**Project Title:** Smart Payroll and HR Management System  
**Submitted To:** [College Name / University Name]  
**Submitted By:** [Student Name], [Roll No.], [Class]  
**Guided By:** [Guide Name], [Department]  
**Academic Year:** 2025-26

A web-based enterprise application was designed and implemented to automate employee management, attendance, leave processing, and monthly payroll generation. The system uses a React frontend and Django REST backend with JWT-based authentication. The main objective is to reduce manual effort, increase payroll accuracy, and provide real-time administrative reporting for HR and management users.

## Page 2 - Inner Title Page
This report presents the design, development, testing, and deployment documentation of the Smart Payroll and HR Management System. The project is developed as a full-stack software solution under academic supervision. It demonstrates practical implementation of software engineering principles, database design, API architecture, frontend-backend integration, and role-based access control in a real organizational use case.

The implementation focuses on modularity, maintainability, and extensibility. Core modules include user authentication, employee records, attendance tracking, leave management, payroll processing, and dashboard analytics.

## Page 3 - Certificate
This is to certify that the project report titled **"Smart Payroll and HR Management System"** submitted by **[Student Name]** in partial fulfillment of the requirements for the degree/course **[Course Name]** is a bona fide record of work carried out under my supervision during the academic year **2025-26**.

**Guide Signature:** ____________________  
**Head of Department:** ____________________  
**Date:** ____________________

## Page 4 - Declaration
I hereby declare that the project report entitled **"Smart Payroll and HR Management System"** is my original work and has been carried out under proper academic guidance. The work has not been submitted previously for the award of any degree or diploma at any institution.

All references used in this report have been acknowledged appropriately.

**Student Signature:** ____________________  
**Name:** [Student Name]  
**Date:** ____________________

## Page 5 - Acknowledgement
I express my sincere gratitude to **[Guide Name]** for valuable guidance, support, and technical suggestions throughout this project. I thank the faculty members of **[Department Name]** for academic direction and encouragement.

I also thank my classmates and family for constant motivation and feedback during implementation and testing. Their support helped complete this project successfully within the planned timeline.

## Page 6 - Abstract
The Smart Payroll and HR Management System is a centralized web application for managing employee lifecycle and payroll activities. Traditional payroll operations are often manual, error-prone, and time consuming. This project addresses these limitations through automated record handling and secure digital workflows.

The backend is implemented using Django and Django REST Framework with JWT authentication. The frontend is built using React and Axios for API communication. The system provides modules for employee CRUD, daily attendance, leave application and approval, payroll computation, and dashboard summaries.

The project demonstrates improved transparency, better data consistency, reduced processing effort, and faster decision-making. It can be used by small and medium organizations and can be extended with advanced features like biometric integration, payslip generation, and analytics dashboards.

## Page 7 - Table of Contents (Part 1)
1. Introduction  
2. Organization Profile and Problem Statement  
3. Existing System and Proposed System  
4. Objectives and Scope  
5. Feasibility Study  
6. Literature Survey  
7. Requirement Analysis  
8. Software Requirement Specification

## Page 8 - Table of Contents (Part 2)
9. System Design and Architecture  
10. Database Design  
11. Module Description  
12. API Documentation  
13. Frontend Design  
14. Security and Access Control  
15. Testing Strategy and Results  
16. Deployment, Conclusion, Future Scope, Bibliography, Appendix

## Page 9 - Introduction
Human Resource and payroll operations are fundamental administrative functions in every organization. Maintaining employee details, tracking attendance, handling leave requests, and calculating monthly salaries involve repetitive and sensitive tasks. In many institutions these operations are still managed using spreadsheets or disconnected tools, resulting in errors and poor traceability.

The developed system digitizes the complete workflow through a single web platform. Authorized users can manage employee records, mark attendance, process leave requests, and create payroll entries with automatic net salary computation. Management receives dashboard-level insights for workforce and payroll status.

## Page 10 - Need for the Project
Manual HR and payroll workflows create several problems: delayed updates, duplicate records, inconsistent attendance data, and incorrect salary calculations. HR teams spend significant effort in reconciliation instead of strategic tasks.

The project is required to:
- provide a centralized data repository,
- ensure role-based secure access,
- automate payroll computation,
- reduce documentation overhead,
- improve auditability and reporting.

By computerizing routine processes, the system increases accuracy, operational speed, and administrative accountability.

## Page 11 - Organization Profile (Sample Write-up)
The target organization is assumed to be a medium-scale enterprise with multiple departments and a growing employee base. HR and payroll tasks are handled monthly, and attendance/leave records are generated daily.

The organization needs a lightweight, cost-effective, web-based platform that can run on standard infrastructure without complex setup. The Smart Payroll and HR Management System matches this requirement by offering an SQLite-based default setup with optional PostgreSQL support for scale.

## Page 12 - Problem Statement
The primary problem addressed by this project is lack of integrated HR and payroll automation. Existing practices often maintain employee, attendance, leave, and payroll data in separate files. This causes:
- data inconsistency,
- delayed payroll preparation,
- human calculation errors,
- limited visibility for management,
- weak control on who can access or modify records.

Therefore, a secure and integrated software solution is needed to streamline all core HR operations.

## Page 13 - Existing System Analysis
In the existing environment, employee records are mostly maintained manually, attendance is often marked in registers or spreadsheets, leave approvals are handled informally, and salary sheets are prepared at month-end using formulas.

Limitations include poor validation, no centralized audit trail, repeated data entry, and high dependency on specific staff members. Report generation is manual and decision-making is delayed due to fragmented data.

## Page 14 - Proposed System Overview
The proposed solution is a full-stack web application with six key modules:
1. Authentication and user roles
2. Employee management
3. Attendance management
4. Leave management
5. Payroll management
6. Dashboard analytics

The backend exposes REST APIs secured with JWT tokens. The React frontend consumes APIs and presents role-specific workflows. The system enforces structured data handling, unique constraints, and standardized operational screens.

## Page 15 - Objectives
Main objectives of the project are:
- design a secure role-based HR and payroll platform,
- maintain accurate employee master data,
- track attendance and leave events,
- automate net salary calculation,
- provide dashboard indicators for management,
- reduce manual paperwork and processing time,
- create a maintainable modular codebase.

## Page 16 - Scope of the Project
Current scope includes core administrative functions for small and medium organizations:
- User login with role-based authorization (Admin, HR, Employee)
- Employee CRUD operations
- Attendance marking and listing
- Leave request and status management
- Payroll record creation with automatic net salary
- Dashboard summary for key metrics

Out of scope for this version: biometric device integration, taxation engine, statutory compliance automation, and downloadable payslip PDFs.

## Page 17 - Feasibility Study: Technical
Technical feasibility is high. The solution uses widely adopted technologies: React, Django, Django REST Framework, SQLite/PostgreSQL, and JWT authentication. Development tools are stable and supported.

The project can run on ordinary systems with Python 3.10+ and Node.js 18+. The codebase is modular with separate backend apps (ccounts, employees, ttendance, leave_management, payroll, dashboard), making maintenance and extension straightforward.

## Page 18 - Feasibility Study: Economic and Operational
Economic feasibility is favorable because all core technologies are open source. Development and deployment costs are low compared to proprietary HR suites.

Operational feasibility is also strong. The UI is simple and menu-driven. HR staff can quickly perform routine tasks with minimal training. Automation reduces repetitive manual effort and improves confidence in payroll output.

## Page 19 - Literature Survey
A survey of payroll and HRMS implementations shows common architecture patterns: centralized employee data, transactional attendance/leave workflows, payroll computation engine, and reporting dashboard. Most modern systems rely on REST APIs and token-based authentication for secure access.

Open-source ecosystems provide robust tools for rapid implementation. Django REST Framework supports secure API development; React supports dynamic user interfaces. The current project adopts these proven patterns to achieve practical, maintainable results.

## Page 20 - Requirement Gathering Method
Requirements were derived from HR workflow analysis and translated into functional modules. Inputs considered:
- employee onboarding and profile management,
- daily attendance tracking,
- leave request lifecycle,
- monthly payroll processing,
- role-wise access control,
- summary insights for administrators.

Requirements were prioritized to build a minimum viable but usable system first, followed by extensible architecture for future enhancements.

## Page 21 - Functional Requirements (Part 1)
FR-1: System shall authenticate users via username and password.  
FR-2: System shall issue JWT access and refresh tokens on successful login.  
FR-3: System shall allow authenticated users to view their own profile (/api/accounts/me/).  
FR-4: Admin shall manage system users and roles.  
FR-5: Admin/HR shall create, update, list, and delete employee records.

## Page 22 - Functional Requirements (Part 2)
FR-6: Authenticated users shall create attendance entries.  
FR-7: Admin/HR shall view and manage all attendance records.  
FR-8: Employees shall submit leave requests.  
FR-9: Admin/HR shall approve/reject leave records.  
FR-10: Admin/HR shall create payroll entries with allowances and deductions.  
FR-11: System shall auto-calculate net salary = basic + allowances - deductions.  
FR-12: Dashboard shall show workforce and payroll summary.

## Page 23 - Non-Functional Requirements
- Security: JWT authentication and role-based authorization.
- Performance: Fast CRUD operations on moderate data volume.
- Reliability: Database constraints for uniqueness and integrity.
- Usability: Simple forms, tables, and action buttons.
- Maintainability: Modular app structure and serializer-based validation.
- Scalability: Optional PostgreSQL configuration for production scale.
- Portability: Runs on Windows with setup scripts (setup.bat, 
un.bat).

## Page 24 - Software Requirement Specification
**Frontend:** React 18, Axios, React Router, React Select, FontAwesome, Chart.js  
**Backend:** Python, Django, Django REST Framework, SimpleJWT, CORS Headers  
**Database:** SQLite (default), PostgreSQL (optional)  
**OS/Runtime:** Windows environment supported with batch scripts  
**API Style:** REST over HTTP  
**Auth:** Bearer token (JWT)

## Page 25 - System Architecture
The architecture follows a client-server model.

Frontend (React) handles presentation and user interactions. It communicates with Django REST endpoints using Axios. Backend contains domain-specific apps and business logic. Database stores persistent entities such as users, employees, attendance, leaves, and payroll records.

Authentication flow: user logs in -> backend issues JWT tokens -> frontend stores tokens -> API calls include Bearer token.

## Page 26 - High-Level Design
Major layers:
- Presentation layer: React pages (Dashboard, Employees, Attendance, Leave, Payroll, Login)
- Service/API layer: Axios instance with auth interceptor
- Application layer: Django viewsets and API views
- Business/data layer: models, serializers, permissions
- Persistence layer: SQLite/PostgreSQL

This layered approach keeps concerns separated and reduces coupling.

## Page 27 - Database Design Introduction
Database schema is normalized for core entities and relationships. Key relationship pattern: one employee can have many attendance records, leave records, and payroll records.

Important integrity rules include:
- unique email for employee,
- unique attendance per employee per date,
- unique payroll entry per employee per month,
- role values constrained via choices.

## Page 28 - Data Dictionary: User and Employee
**User (accounts_user):**
- username, email, password hash
- role (ADMIN, HR, EMPLOYEE)
- phone, address

**Employee (employees_employee):**
- user (optional one-to-one link)
- name, email, phone
- department, designation
- joining_date
- basic_salary

Purpose: separates login identity from HR profile while allowing linkage.

## Page 29 - Data Dictionary: Attendance and Leave
**Attendance (attendance_attendance):**
- employee (foreign key)
- date
- status (PRESENT/ABSENT)
- unique(employee, date)

**Leave (leave_management_leave):**
- employee (foreign key)
- leave_type (CASUAL/SICK/ANNUAL)
- from_date, to_date
- status (PENDING/APPROVED/REJECTED)
- reason

These structures model daily presence and planned absence workflows.

## Page 30 - Data Dictionary: Payroll
**Payroll (payroll_payroll):**
- employee (foreign key)
- month (first day of month format)
- basic_salary
- allowances
- deductions
- net_salary (computed)
- unique(employee, month)

Business rule is enforced in model save() method to calculate net salary consistently across all inserts/updates.

## Page 31 - Module Description: Authentication
Endpoints:
- POST /api/auth/login/
- POST /api/auth/refresh/
- GET /api/accounts/me/

Login returns access and refresh token. Access token is attached in API headers using Axios interceptor. Unauthorized calls are blocked by default DRF permission (IsAuthenticated).

Role information returned in user profile is used to control UI behavior and backend authorization.

## Page 32 - Module Description: Employee Management
Employee module provides complete CRUD through REST viewset:
- Create new employee
- List employee records
- Update employee information
- Delete employee

Access control: only Admin/HR users can manage employees. Frontend includes form handling for add/edit operations and table listing with actions.

This module acts as master data source for attendance, leave, and payroll modules.

## Page 33 - Module Description: Attendance Management
Attendance module records day-wise employee status.

Key features:
- Add attendance entry with employee, date, status
- List attendance records with employee name
- Restrict management operations to Admin/HR
- Prevent duplicate daily entries through unique constraint

The module ensures consistent attendance capture and supports dashboard metrics for present employees.

## Page 34 - Module Description: Leave Management
Leave module captures leave lifecycle.

Key features:
- Create leave request with date range and type
- Track status as Pending/Approved/Rejected
- Employee-level filtering for employee role users
- Admin/HR rights for update and approval actions

This module supports controlled leave processing and integrates with dashboard statistics (on_leave_today).

## Page 35 - Module Description: Payroll Management
Payroll module handles monthly compensation records.

Key features:
- Payroll entry form with month, basic salary, allowances, deductions
- Automatic net salary calculation in model layer
- Unique payroll per employee per month
- API summary endpoint for total net salary of current month

By centralizing payroll logic, manual spreadsheet errors are minimized.

## Page 36 - Module Description: Dashboard
Dashboard summary endpoint (/api/dashboard/summary/) computes:
- total employees,
- present today count,
- on leave today count,
- total payroll for current month,
- attendance status distribution.

Frontend dashboard displays cards and quick actions. It also allows quick employee addition, linking analytics to operations.

## Page 37 - API Documentation (Core)
- POST /api/auth/login/ -> JWT token pair
- POST /api/auth/refresh/ -> new access token
- GET /api/accounts/me/ -> authenticated user profile
- GET/POST /api/employees/
- PUT/DELETE /api/employees/{id}/
- GET/POST /api/attendance/
- GET/POST /api/leave/
- GET/POST /api/payroll/
- GET /api/payroll/summary/
- GET /api/dashboard/summary/

## Page 38 - Sample Request/Response
Example login request:
`json
{ "username": "admin", "password": "admin123" }
`
Response contains ccess and 
efresh JWT tokens.

Example payroll create request:
`json
{
  "employee": 3,
  "month": "2026-03-01",
  "basic_salary": 30000,
  "allowances": 5000,
  "deductions": 1200
}
`
System stores computed 
et_salary automatically.

## Page 39 - Frontend Design and Navigation
Frontend is built with React Router and protected routes. Without login, users are redirected to /login. On successful authentication, top navigation provides module-wise access:
- Dashboard
- Employees
- Attendance
- Leave
- Payroll

A reusable Axios client injects Bearer token into each request. Theme toggle and user dropdown improve usability.

## Page 40 - UI Components and Interaction
Each module page uses consistent UI patterns:
- Header and action button
- Collapsible add/edit form
- Table listing records
- Inline operations (edit/delete where applicable)

React state management with hooks (useState, useEffect) drives data loading and form handling. Date formatting is displayed in user-friendly format for better readability.

## Page 41 - Security Design
Security controls implemented:
- JWT authentication for all protected APIs
- Global DRF permission IsAuthenticated
- Role-based custom permissions (IsAdmin, IsHR, IsAdminOrHR)
- Endpoint-level restrictions in viewsets
- Employee-specific leave filtering for EMPLOYEE role

This design prevents unauthorized access and ensures only eligible roles can modify sensitive HR/payroll data.

## Page 42 - Validation and Integrity Controls
Integrity is maintained using model constraints and serializer contracts:
- Unique constraints on attendance/date and payroll/month
- Field types for salary and dates
- Controlled choice values for status/type fields
- Read-only 
et_salary to avoid manual tampering

Backend-level validation ensures consistent records even if frontend behavior changes.

## Page 43 - Testing Strategy
Testing was performed at three levels:
1. Unit-level model and serializer behavior checks
2. API endpoint testing with role-based scenarios
3. UI-level workflow validation through manual integration runs

Primary test goals:
- Authentication success/failure behavior
- CRUD correctness
- Permission enforcement
- Salary calculation correctness
- Dashboard aggregation accuracy

## Page 44 - Test Cases (Representative)
- TC-01: Valid admin login -> tokens generated (Pass)
- TC-02: Invalid login -> unauthorized response (Pass)
- TC-03: HR creates employee -> record stored (Pass)
- TC-04: Duplicate attendance same employee/date -> rejected (Pass)
- TC-05: Payroll net calculation equals formula -> verified (Pass)
- TC-06: Employee attempts restricted update action -> blocked (Pass)

## Page 45 - Result Analysis
The implemented system successfully automates critical HR and payroll workflows. Administrative tasks are completed faster than spreadsheet-based methods. Data duplication is reduced due to centralized persistence and constraints.

Dashboard provides immediate operational visibility. Salary computation is consistent because it is executed in backend model logic. Role-based access improves governance and minimizes accidental misuse.

Overall project objectives were achieved in functional and technical dimensions.

## Page 46 - Deployment and Execution Steps
Local setup steps:
1. Run setup.bat (creates venv, installs dependencies, migrates DB, creates admin).
2. Run 
un.bat (starts backend and frontend).
3. Access backend at http://127.0.0.1:8000 and frontend at http://localhost:3000.
4. Default admin credentials: dmin / admin123.

Database can be switched to PostgreSQL using environment variables (USE_POSTGRES=True, DB credentials).

## Page 47 - Project Management and Timeline
Indicative development plan:
- Week 1: Requirement analysis and architecture planning
- Week 2: Backend project setup and authentication
- Week 3: Employee and attendance modules
- Week 4: Leave and payroll modules
- Week 5: Dashboard, frontend integration
- Week 6: Testing, debugging, documentation

The modular timeline reduced risk and enabled progressive validation.

## Page 48 - Limitations
Current version limitations:
- No biometric attendance integration
- No automatic tax/statutory deductions
- No downloadable payslip PDF
- Limited automated test coverage in repository
- Minimal audit log/user activity tracking
- UI can be further improved for enterprise-level analytics

These limitations are acceptable for an academic MVP and define clear enhancement paths.

## Page 49 - Future Scope
Planned enhancements:
- Payroll slip generation (PDF and email)
- Advanced role matrix and approval workflows
- Tax, PF, ESI, and compliance calculations
- Biometric or RFID attendance integration
- Leave balance policies and accrual engine
- Graphical analytics and trend forecasting
- Containerized cloud deployment and CI/CD pipeline

## Page 50 - Conclusion
The Smart Payroll and HR Management System demonstrates practical full-stack engineering for a real business domain. It successfully integrates employee records, attendance, leave, payroll, and dashboard summaries in a secure role-based platform.

The project improves operational efficiency, reduces manual processing errors, and provides a scalable foundation for future enterprise-grade enhancements. It also validates the applicability of Django REST and React for building reliable administrative systems.

## Page 51 - Bibliography
1. Django Documentation - https://docs.djangoproject.com/  
2. Django REST Framework - https://www.django-rest-framework.org/  
3. Simple JWT Docs - https://django-rest-framework-simplejwt.readthedocs.io/  
4. React Documentation - https://react.dev/  
5. Axios Documentation - https://axios-http.com/  
6. Chart.js Documentation - https://www.chartjs.org/docs/latest/

## Page 52 - Appendix A: Code Snapshot Index
Important project files:
- ackend/hr_system/settings.py
- ackend/hr_system/urls.py
- ackend/accounts/models.py, permissions.py, iews.py
- ackend/employees/models.py, iews.py
- ackend/attendance/models.py, iews.py
- ackend/leave_management/models.py, iews.py
- ackend/payroll/models.py, iews.py
- ackend/dashboard/views.py
- rontend/src/App.js
- rontend/src/pages/*.js

## Page 53 - Appendix B: Viva Questions and Answers
Q1. Why JWT is used?  
A: It enables stateless secure API authentication and easy token refresh.

Q2. Where is payroll formula implemented?  
A: In Payroll.save() model method on backend.

Q3. How is role-based security enforced?  
A: Custom permission classes and action-wise checks in DRF views.

Q4. Why use React + Django?  
A: Clear separation of frontend and backend with scalable REST architecture.

Q5. How can system be scaled?  
A: Switch to PostgreSQL, add caching, CI/CD, and cloud deployment.