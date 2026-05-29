-- ============================================================================
-- UT SERVICE CONSOLE - MySQL Database Schema
-- Database: UT_ServiceConsole
-- Version: 1.0
-- Created: May 28, 2026
-- ============================================================================

-- Drop existing database (optional, use with caution)
-- DROP DATABASE IF EXISTS UT_ServiceConsole;

-- Create database
CREATE DATABASE IF NOT EXISTS UT_ServiceConsole
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE UT_ServiceConsole;

-- ============================================================================
-- TABLE 1: Users
-- ============================================================================
CREATE TABLE Users (
  UserID INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(100) UNIQUE NOT NULL,
  Email VARCHAR(150) UNIQUE NOT NULL,
  PasswordHash VARCHAR(255) NOT NULL,
  FirstName VARCHAR(100),
  LastName VARCHAR(100),
  Role VARCHAR(50) NOT NULL COMMENT 'ServiceAdvisor, Mechanic, Manager, Admin',
  Department VARCHAR(100),
  PhoneNumber VARCHAR(20),
  IsActive BOOLEAN DEFAULT TRUE,
  LastLoginDate DATETIME,
  FailedLoginAttempts INT DEFAULT 0,
  IsLockedOut BOOLEAN DEFAULT FALSE,
  LockoutEndDate DATETIME,
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  LastModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CreatedBy INT,
  LastModifiedBy INT,
  FOREIGN KEY (CreatedBy) REFERENCES Users(UserID),
  FOREIGN KEY (LastModifiedBy) REFERENCES Users(UserID),
  INDEX idx_username (Username),
  INDEX idx_email (Email),
  INDEX idx_role (Role),
  INDEX idx_isActive (IsActive),
  FULLTEXT INDEX ft_name (FirstName, LastName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 2: Accounts (Customers)
-- ============================================================================
CREATE TABLE Accounts (
  AccountID INT PRIMARY KEY AUTO_INCREMENT,
  AccountName VARCHAR(200) UNIQUE NOT NULL,
  CustomerSupportType VARCHAR(100) COMMENT 'Dedicated Customer, Standard, Premium, etc.',
  PhoneNumber VARCHAR(20),
  Email VARCHAR(150),
  Website VARCHAR(255),
  Industry VARCHAR(100),
  Address TEXT,
  City VARCHAR(100),
  State VARCHAR(100),
  PostalCode VARCHAR(20),
  Country VARCHAR(100),
  Status VARCHAR(50) DEFAULT 'Active',
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  LastModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CreatedBy INT,
  LastModifiedBy INT,
  FOREIGN KEY (CreatedBy) REFERENCES Users(UserID),
  FOREIGN KEY (LastModifiedBy) REFERENCES Users(UserID),
  INDEX idx_accountName (AccountName),
  INDEX idx_status (Status),
  INDEX idx_industry (Industry),
  FULLTEXT INDEX ft_account (AccountName, City)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 3: Contacts
-- ============================================================================
CREATE TABLE Contacts (
  ContactID INT PRIMARY KEY AUTO_INCREMENT,
  ContactName VARCHAR(200) NOT NULL,
  Email VARCHAR(150),
  PhoneNumber VARCHAR(20),
  Title VARCHAR(100),
  Department VARCHAR(100),
  AccountID INT NOT NULL,
  IsPrimary BOOLEAN DEFAULT FALSE,
  Status VARCHAR(50) DEFAULT 'Active',
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  LastModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CreatedBy INT,
  LastModifiedBy INT,
  FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID) ON DELETE CASCADE,
  FOREIGN KEY (CreatedBy) REFERENCES Users(UserID),
  FOREIGN KEY (LastModifiedBy) REFERENCES Users(UserID),
  INDEX idx_accountID (AccountID),
  INDEX idx_email (Email),
  INDEX idx_isPrimary (IsPrimary),
  FULLTEXT INDEX ft_contact (ContactName, Email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 4: Assets (Equipment/Machinery)
-- ============================================================================
CREATE TABLE Assets (
  AssetID INT PRIMARY KEY AUTO_INCREMENT,
  AssetName VARCHAR(200) NOT NULL,
  EquipmentNumber VARCHAR(100) UNIQUE,
  SerialNumber VARCHAR(100),
  UnitModel VARCHAR(100),
  UnitCode VARCHAR(50),
  MaterialNumber VARCHAR(100),
  SMR DECIMAL(10,2) COMMENT 'Service Meter Reading (hm, km, hrs, etc.)',
  EquipmentUoM VARCHAR(20) COMMENT 'Unit of Measurement: hm, km, hrs, days, etc.',
  MeasuringDate DATETIME,
  WarrantyStartDate DATE,
  WarrantyEndDate DATE,
  InWarranty BOOLEAN,
  Plant VARCHAR(50),
  ServiceArea VARCHAR(100),
  Location VARCHAR(200),
  AccountID INT,
  Status VARCHAR(50) DEFAULT 'Active',
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  LastModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CreatedBy INT,
  LastModifiedBy INT,
  FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID) ON DELETE SET NULL,
  FOREIGN KEY (CreatedBy) REFERENCES Users(UserID),
  FOREIGN KEY (LastModifiedBy) REFERENCES Users(UserID),
  INDEX idx_equipmentNumber (EquipmentNumber),
  INDEX idx_serialNumber (SerialNumber),
  INDEX idx_accountID (AccountID),
  INDEX idx_plant (Plant),
  INDEX idx_status (Status),
  FULLTEXT INDEX ft_asset (AssetName, UnitModel, MaterialNumber)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 5: Cases
-- ============================================================================
CREATE TABLE Cases (
  CaseID INT PRIMARY KEY AUTO_INCREMENT,
  CaseNumber VARCHAR(50) UNIQUE NOT NULL COMMENT 'Format: CASE-YYYYMMDD-XXXXX',
  CaseType VARCHAR(50) NOT NULL COMMENT 'Request, Incident, Problem, Change',
  Priority VARCHAR(20) NOT NULL COMMENT 'Low, Medium, High, Critical',
  Status VARCHAR(50) NOT NULL DEFAULT 'Open' COMMENT 'Open, Assigned, InProgress, Resolved, Closed',
  Subject VARCHAR(200) NOT NULL,
  Description TEXT,
  AssetID INT,
  AccountID INT,
  ContactID INT,
  AssignedOwnerID INT,
  StartDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  TargetResolutionDate DATETIME,
  ClosedDate DATETIME,
  SLABreached BOOLEAN DEFAULT FALSE,
  ComplianceScore DECIMAL(5,2),
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  LastModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CreatedBy INT NOT NULL,
  LastModifiedBy INT,
  FOREIGN KEY (AssetID) REFERENCES Assets(AssetID) ON DELETE SET NULL,
  FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID) ON DELETE SET NULL,
  FOREIGN KEY (ContactID) REFERENCES Contacts(ContactID) ON DELETE SET NULL,
  FOREIGN KEY (AssignedOwnerID) REFERENCES Users(UserID) ON DELETE SET NULL,
  FOREIGN KEY (CreatedBy) REFERENCES Users(UserID),
  FOREIGN KEY (LastModifiedBy) REFERENCES Users(UserID),
  INDEX idx_caseNumber (CaseNumber),
  INDEX idx_status (Status),
  INDEX idx_priority (Priority),
  INDEX idx_caseType (CaseType),
  INDEX idx_assignedOwner (AssignedOwnerID),
  INDEX idx_accountID (AccountID),
  INDEX idx_assetID (AssetID),
  INDEX idx_createdDate (CreatedDate),
  INDEX idx_closedDate (ClosedDate),
  FULLTEXT INDEX ft_case (Subject, Description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 6: WorkOrders
-- ============================================================================
CREATE TABLE WorkOrders (
  WorkOrderID INT PRIMARY KEY AUTO_INCREMENT,
  WorkOrderNumber VARCHAR(50) UNIQUE NOT NULL COMMENT 'Format: WO-YYYYMMDD-XXXXX',
  CaseID INT NOT NULL,
  Status VARCHAR(50) NOT NULL DEFAULT 'New' COMMENT 'New, InProgress, Completed, Closed, Cancelled, OnHold',
  OwnerID INT NOT NULL,
  AssignedMechanicID INT,
  AccountID INT,
  ContactID INT,
  AssetID INT,
  Subject VARCHAR(200) NOT NULL,
  Description TEXT,
  StartDate DATETIME,
  EndDate DATETIME,
  ActualStartDate DATETIME,
  ActualEndDate DATETIME,
  WorkCenter VARCHAR(100),
  Plant VARCHAR(50),
  CostCenter VARCHAR(100),
  ObjectPart VARCHAR(200),
  SpecificObjectPart VARCHAR(200),
  MalfunctionStartDate DATETIME,
  MalfunctionEndDate DATETIME,
  BreakdownIndicator BOOLEAN DEFAULT FALSE,
  LastSMR DECIMAL(10,2),
  ActualSMR DECIMAL(10,2),
  TSRDataScore INT DEFAULT 0 COMMENT '0-100',
  TSRRootCauseScore INT DEFAULT 0 COMMENT '0-100',
  TSRMonitoringScore INT DEFAULT 0 COMMENT '0-100',
  ABRFileDate DATETIME,
  SAPWorkOrderNumber VARCHAR(50),
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  LastModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CreatedBy INT NOT NULL,
  LastModifiedBy INT,
  FOREIGN KEY (CaseID) REFERENCES Cases(CaseID) ON DELETE CASCADE,
  FOREIGN KEY (OwnerID) REFERENCES Users(UserID),
  FOREIGN KEY (AssignedMechanicID) REFERENCES Users(UserID) ON DELETE SET NULL,
  FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID) ON DELETE SET NULL,
  FOREIGN KEY (ContactID) REFERENCES Contacts(ContactID) ON DELETE SET NULL,
  FOREIGN KEY (AssetID) REFERENCES Assets(AssetID) ON DELETE SET NULL,
  FOREIGN KEY (CreatedBy) REFERENCES Users(UserID),
  FOREIGN KEY (LastModifiedBy) REFERENCES Users(UserID),
  INDEX idx_workOrderNumber (WorkOrderNumber),
  INDEX idx_caseID (CaseID),
  INDEX idx_status (Status),
  INDEX idx_assignedMechanic (AssignedMechanicID),
  INDEX idx_ownerID (OwnerID),
  INDEX idx_accountID (AccountID),
  INDEX idx_assetID (AssetID),
  INDEX idx_createdDate (CreatedDate),
  FULLTEXT INDEX ft_workorder (Subject, Description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 7: CaseNotes
-- ============================================================================
CREATE TABLE CaseNotes (
  NoteID INT PRIMARY KEY AUTO_INCREMENT,
  CaseID INT NOT NULL,
  NoteText TEXT NOT NULL,
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  CreatedBy INT NOT NULL,
  LastModifiedDate DATETIME,
  LastModifiedBy INT,
  FOREIGN KEY (CaseID) REFERENCES Cases(CaseID) ON DELETE CASCADE,
  FOREIGN KEY (CreatedBy) REFERENCES Users(UserID),
  FOREIGN KEY (LastModifiedBy) REFERENCES Users(UserID),
  INDEX idx_caseID (CaseID),
  INDEX idx_createdDate (CreatedDate),
  FULLTEXT INDEX ft_note (NoteText)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 8: WorkOrderNotes
-- ============================================================================
CREATE TABLE WorkOrderNotes (
  NoteID INT PRIMARY KEY AUTO_INCREMENT,
  WorkOrderID INT NOT NULL,
  NoteText TEXT NOT NULL,
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  CreatedBy INT NOT NULL,
  LastModifiedDate DATETIME,
  LastModifiedBy INT,
  FOREIGN KEY (WorkOrderID) REFERENCES WorkOrders(WorkOrderID) ON DELETE CASCADE,
  FOREIGN KEY (CreatedBy) REFERENCES Users(UserID),
  FOREIGN KEY (LastModifiedBy) REFERENCES Users(UserID),
  INDEX idx_workOrderID (WorkOrderID),
  INDEX idx_createdDate (CreatedDate),
  FULLTEXT INDEX ft_note (NoteText)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 9: SLA (Service Level Agreements)
-- ============================================================================
CREATE TABLE SLA (
  SLAID INT PRIMARY KEY AUTO_INCREMENT,
  CaseID INT NOT NULL,
  SLAType VARCHAR(50) NOT NULL COMMENT 'OTFMechanic, OTFSolution, SLAClosure',
  TargetDate DATETIME NOT NULL,
  CompletionDate DATETIME,
  IsBreached BOOLEAN DEFAULT FALSE,
  BreachedDate DATETIME,
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (CaseID) REFERENCES Cases(CaseID) ON DELETE CASCADE,
  INDEX idx_caseID (CaseID),
  INDEX idx_slaType (SLAType),
  INDEX idx_isBreached (IsBreached),
  INDEX idx_targetDate (TargetDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 10: AuditLog
-- ============================================================================
CREATE TABLE AuditLog (
  LogID INT PRIMARY KEY AUTO_INCREMENT,
  EntityName VARCHAR(100) NOT NULL COMMENT 'Case, WorkOrder, User, Account, etc.',
  EntityID INT NOT NULL,
  ActionType VARCHAR(50) NOT NULL COMMENT 'Create, Update, Delete, Approve, Reject',
  FieldName VARCHAR(100),
  OldValue TEXT,
  NewValue TEXT,
  ChangedBy INT NOT NULL,
  ChangedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  IPAddress VARCHAR(45),
  UserAgent VARCHAR(500),
  FOREIGN KEY (ChangedBy) REFERENCES Users(UserID),
  INDEX idx_entityName (EntityName),
  INDEX idx_entityID (EntityID),
  INDEX idx_actionType (ActionType),
  INDEX idx_changedDate (ChangedDate),
  INDEX idx_changedBy (ChangedBy),
  INDEX idx_entity_action (EntityName, ActionType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 11: LoginHistory
-- ============================================================================
CREATE TABLE LoginHistory (
  LoginID INT PRIMARY KEY AUTO_INCREMENT,
  UserID INT NOT NULL,
  LoginDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  LogoutDate DATETIME,
  IPAddress VARCHAR(45),
  UserAgent VARCHAR(500),
  Success BOOLEAN DEFAULT TRUE,
  FailureReason VARCHAR(255),
  FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
  INDEX idx_userID (UserID),
  INDEX idx_loginDate (LoginDate),
  INDEX idx_success (Success)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 12: Roles (Future use for RBAC)
-- ============================================================================
CREATE TABLE Roles (
  RoleID INT PRIMARY KEY AUTO_INCREMENT,
  RoleName VARCHAR(50) UNIQUE NOT NULL,
  Description TEXT,
  IsActive BOOLEAN DEFAULT TRUE,
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_roleName (RoleName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 13: Permissions (Future use for RBAC)
-- ============================================================================
CREATE TABLE Permissions (
  PermissionID INT PRIMARY KEY AUTO_INCREMENT,
  PermissionName VARCHAR(100) UNIQUE NOT NULL,
  Description TEXT,
  Module VARCHAR(50),
  CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_module (Module),
  INDEX idx_permissionName (PermissionName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 14: RolePermissions (Future use for RBAC)
-- ============================================================================
CREATE TABLE RolePermissions (
  RoleID INT NOT NULL,
  PermissionID INT NOT NULL,
  PRIMARY KEY (RoleID, PermissionID),
  FOREIGN KEY (RoleID) REFERENCES Roles(RoleID) ON DELETE CASCADE,
  FOREIGN KEY (PermissionID) REFERENCES Permissions(PermissionID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================

-- Insert default roles
INSERT INTO Roles (RoleName, Description, IsActive) VALUES
('Admin', 'System Administrator', TRUE),
('Manager', 'Case Manager / Supervisor', TRUE),
('ServiceAdvisor', 'Service Advisor / Case Creator', TRUE),
('Mechanic', 'Field Mechanic / Technician', TRUE);

-- Insert sample users (passwords should be hashed in production)
INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, Role, Department, PhoneNumber, IsActive) VALUES
('admin@utconsole.com', 'admin@utconsole.com', 'HASHED_PASSWORD_HERE', 'System', 'Administrator', 'Admin', 'IT', '+62811234567', TRUE),
('john.doe@utconsole.com', 'john.doe@utconsole.com', 'HASHED_PASSWORD_HERE', 'John', 'Doe', 'ServiceAdvisor', 'Operations', '+62811234568', TRUE),
('budi.santoso@utconsole.com', 'budi.santoso@utconsole.com', 'HASHED_PASSWORD_HERE', 'Budi', 'Santoso', 'Mechanic', 'Field Services', '+62811234569', TRUE),
('manager.user@utconsole.com', 'manager.user@utconsole.com', 'HASHED_PASSWORD_HERE', 'Manager', 'User', 'Manager', 'Operations', '+62811234570', TRUE);

-- Insert sample accounts
INSERT INTO Accounts (AccountName, CustomerSupportType, PhoneNumber, Email, Industry, City, Country, Status) VALUES
('PUTRA PERKASA ABADI', 'Dedicated Customer', '+62-711-12345', 'contact@putraabadi.co.id', 'MNG', 'Palembang', 'Indonesia', 'Active'),
('SIMS JAYA KALTIM', 'Standard', '+62-541-98765', 'info@simskaltim.co.id', 'MNG', 'Samarinda', 'Indonesia', 'Active'),
('PT. UNITED TRACTORS', 'Premium', '+62-21-5555555', 'utgroup@unitedtractors.com', 'EQP', 'Jakarta', 'Indonesia', 'Active');

-- Insert sample assets
INSERT INTO Assets (AssetName, EquipmentNumber, SerialNumber, UnitModel, UnitCode, MaterialNumber, SMR, EquipmentUoM, Plant, ServiceArea, Location, AccountID, Status) VALUES
('GD-829 Komatsu D85ESS-2', '232656', '13405', 'Komatsu D85ESS-2', 'GD-829', 'GD825A-2/S3', 14250.0, 'hm', 'TJE', 'Tanjung Enim PPA', 'Site B - Pit 4', 1, 'Active'),
('GD-830 PC2000 Excavator', NULL, '13406', 'Komatsu PC2000', 'GD-830', 'PC2000-8', 12500.0, 'hm', 'TJE', 'Tanjung Enim PPA', 'Site A - Loading Area', 1, 'Active'),
('GD-831 HD785 Truck', '232657', '13407', 'Komatsu HD785', 'GD-831', 'HD785-7', 16750.0, 'km', 'TJE', 'Tanjung Enim PPA', 'Transportation', 2, 'Active');

-- Insert sample contacts
INSERT INTO Contacts (ContactName, Email, PhoneNumber, Title, Department, AccountID, IsPrimary, Status) VALUES
('Andi Wijaya', 'andi@putraabadi.co.id', '+62-811-111-2222', 'Operations Manager', 'Operations', 1, TRUE, 'Active'),
('Rini Kartika', 'rini@putraabadi.co.id', '+62-811-333-4444', 'Technical Lead', 'Maintenance', 1, FALSE, 'Active'),
('Burhan', 'burhan@simskaltim.co.id', '+62-811-555-6666', 'Fleet Manager', 'Fleet', 2, TRUE, 'Active');

-- Insert sample cases
INSERT INTO Cases (CaseNumber, CaseType, Priority, Status, Subject, Description, AssetID, AccountID, ContactID, AssignedOwnerID, StartDate, CreatedBy) VALUES
('CASE-20260526-00101', 'Request', 'Medium', 'Open', 'Hydraulic Leak on Right Cylinder', 'Operator reported significant hydraulic fluid leakage near right cylinder. Equipment grounded pending repair. Requires immediate inspection and replacement parts.', 1, 1, 1, 2, '2026-05-26 07:31:00', 2),
('CASE-20260525-00100', 'Incident', 'High', 'Assigned', 'Engine Overheating Issue', 'Unit GD-830 experiencing elevated coolant temperatures. Initial diagnostics show potential radiator blockage or fan malfunction.', 2, 1, 1, 2, '2026-05-25 10:15:00', 2),
('CASE-20260524-00099', 'Problem', 'Critical', 'InProgress', 'Transmission Failure GD-831', 'Complete transmission failure reported during operation. Unit HD785 unable to shift gears. Requires major overhaul or replacement.', 3, 2, 3, 4, '2026-05-24 08:00:00', 2);

-- Insert sample work orders
INSERT INTO WorkOrders (WorkOrderNumber, CaseID, Status, OwnerID, AssignedMechanicID, AccountID, ContactID, AssetID, Subject, Description, StartDate, EndDate, WorkCenter, Plant, LastSMR, CreatedBy) VALUES
('WO-20260526-00101', 1, 'New', 2, 3, 1, 1, 1, 'Hydraulic System Repair - GD-829', 'Replace hydraulic cylinder seal and hose assembly. Check fluid level and top up if necessary.', '2026-05-26 07:31:00', '2026-05-27 07:31:00', 'FM-TJEPA', 'TJE', 14250.0, 2),
('WO-20260525-00100', 2, 'InProgress', 2, 3, 1, 1, 2, 'Engine Cooling System Diagnosis - GD-830', 'Inspect radiator, fans, and coolant system. Perform flush if blockage found. Test thermostat operation.', '2026-05-25 10:15:00', '2026-05-26 10:15:00', 'FM-TJEPA', 'TJE', 12500.0, 2),
('WO-20260524-00099', 3, 'InProgress', 4, 3, 2, 3, 3, 'Transmission Overhaul - GD-831', 'Complete transmission tear-down and inspection. Identify failed components and plan replacement strategy.', '2026-05-24 08:00:00', '2026-05-28 08:00:00', 'FM-KALTIM', 'KTM', 16750.0, 2);

-- Insert sample SLA records
INSERT INTO SLA (CaseID, SLAType, TargetDate, IsBreached) VALUES
(1, 'OTFMechanic', '2026-05-26 11:31:00', FALSE),
(1, 'OTFSolution', '2026-05-27 07:31:00', FALSE),
(1, 'SLAClosure', '2026-06-02 07:31:00', FALSE),
(2, 'OTFMechanic', '2026-05-25 14:15:00', FALSE),
(2, 'OTFSolution', '2026-05-26 10:15:00', FALSE),
(2, 'SLAClosure', '2026-06-01 10:15:00', FALSE);

-- Insert sample permissions
INSERT INTO Permissions (PermissionName, Description, Module) VALUES
('Case.Create', 'Create new cases', 'Cases'),
('Case.Read', 'View case details', 'Cases'),
('Case.Update', 'Edit case information', 'Cases'),
('Case.Delete', 'Delete cases', 'Cases'),
('WorkOrder.Create', 'Create new work orders', 'WorkOrders'),
('WorkOrder.Read', 'View work order details', 'WorkOrders'),
('WorkOrder.Update', 'Edit work order information', 'WorkOrders'),
('WorkOrder.Delete', 'Delete work orders', 'WorkOrders'),
('User.Read', 'View user information', 'Users'),
('User.Manage', 'Manage users (create, update, delete)', 'Users'),
('Report.View', 'View reports and analytics', 'Reports');

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Case Status queries
CREATE INDEX idx_cases_status_createdDate ON Cases(Status, CreatedDate DESC);
CREATE INDEX idx_cases_assignedOwner_status ON Cases(AssignedOwnerID, Status);
CREATE INDEX idx_cases_accountID_status ON Cases(AccountID, Status);

-- Work Order status queries
CREATE INDEX idx_workorders_status_createdDate ON WorkOrders(Status, CreatedDate DESC);
CREATE INDEX idx_workorders_mechanic_status ON WorkOrders(AssignedMechanicID, Status);

-- Audit log queries
CREATE INDEX idx_auditlog_entity ON AuditLog(EntityName, EntityID, ChangedDate DESC);

-- Login history queries
CREATE INDEX idx_loginhistory_user_date ON LoginHistory(UserID, LoginDate DESC);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active cases by status
CREATE VIEW vw_ActiveCases AS
SELECT 
  c.CaseID,
  c.CaseNumber,
  c.Subject,
  c.Priority,
  c.Status,
  ac.AccountName,
  u.FirstName AS OwnerFirstName,
  u.LastName AS OwnerLastName,
  c.StartDate,
  c.CreatedDate
FROM Cases c
LEFT JOIN Accounts ac ON c.AccountID = ac.AccountID
LEFT JOIN Users u ON c.AssignedOwnerID = u.UserID
WHERE c.Status IN ('Open', 'Assigned', 'InProgress')
ORDER BY c.Priority DESC, c.CreatedDate ASC;

-- Mechanics workload
CREATE VIEW vw_MechanicWorkload AS
SELECT 
  u.UserID,
  CONCAT(u.FirstName, ' ', u.LastName) AS MechanicName,
  COUNT(wo.WorkOrderID) AS TotalWorkOrders,
  SUM(CASE WHEN wo.Status = 'InProgress' THEN 1 ELSE 0 END) AS ActiveWorkOrders,
  SUM(CASE WHEN wo.Status = 'New' THEN 1 ELSE 0 END) AS PendingWorkOrders
FROM Users u
LEFT JOIN WorkOrders wo ON u.UserID = wo.AssignedMechanicID
WHERE u.Role = 'Mechanic' AND u.IsActive = TRUE
GROUP BY u.UserID, u.FirstName, u.LastName;

-- SLA compliance
CREATE VIEW vw_SLACompliance AS
SELECT 
  c.CaseID,
  c.CaseNumber,
  c.Subject,
  s.SLAType,
  s.TargetDate,
  s.CompletionDate,
  s.IsBreached,
  DATEDIFF(s.TargetDate, NOW()) AS DaysRemaining,
  CASE 
    WHEN s.IsBreached THEN 'BREACHED'
    WHEN DATEDIFF(s.TargetDate, NOW()) <= 0 THEN 'EXPIRED'
    WHEN DATEDIFF(s.TargetDate, NOW()) <= 1 THEN 'AT RISK'
    ELSE 'ON TRACK'
  END AS SLAStatus
FROM Cases c
INNER JOIN SLA s ON c.CaseID = s.CaseID
WHERE c.Status != 'Closed'
ORDER BY s.TargetDate ASC;

-- ============================================================================
-- STORED PROCEDURES (Optional, for Phase 2+)
-- ============================================================================

-- Procedure to update SLA status
DELIMITER //

CREATE PROCEDURE UpdateSLAStatus()
BEGIN
  UPDATE SLA
  SET IsBreached = TRUE,
      BreachedDate = NOW()
  WHERE IsBreached = FALSE
    AND TargetDate < NOW()
    AND CompletionDate IS NULL;
END //

-- Procedure to calculate case metrics
CREATE PROCEDURE CalculateCaseMetrics(IN p_CaseID INT)
BEGIN
  DECLARE v_TotalNotes INT;
  DECLARE v_TotalWOs INT;
  
  SELECT COUNT(*) INTO v_TotalNotes FROM CaseNotes WHERE CaseID = p_CaseID;
  SELECT COUNT(*) INTO v_TotalWOs FROM WorkOrders WHERE CaseID = p_CaseID;
  
  SELECT 
    p_CaseID AS CaseID,
    v_TotalNotes AS TotalNotes,
    v_TotalWOs AS TotalWorkOrders;
END //

DELIMITER ;

-- ============================================================================
-- END OF DATABASE SCHEMA
-- ============================================================================
-- Total tables created: 14
-- Primary entities: Users, Cases, WorkOrders, Assets, Accounts, Contacts
-- Supporting tables: CaseNotes, WorkOrderNotes, SLA, AuditLog, LoginHistory, Roles, Permissions, RolePermissions
-- Views created: 3 (vw_ActiveCases, vw_MechanicWorkload, vw_SLACompliance)
-- Stored procedures: 2 (UpdateSLAStatus, CalculateCaseMetrics)
-- ============================================================================
