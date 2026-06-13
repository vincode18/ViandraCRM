# UT Service Console MVP — Quick Reference Guide
## Handy Commands, Endpoints & Checklists

---

## 🚀 Quick Start Commands

### Database Setup
```bash
# Execute SQL schema
mysql -u root -p UT_ServiceConsole < DATABASE_SCHEMA_UT_SERVICE_CONSOLE.sql

# Connect to database
mysql -u root -p -e "USE UT_ServiceConsole; SHOW TABLES;"

# Verify sample data
mysql -u root -p -e "USE UT_ServiceConsole; SELECT COUNT(*) FROM Users; SELECT COUNT(*) FROM Cases;"
```

### .NET Core Setup
```bash
# Create new project
dotnet new webapi -n UT.ServiceConsole.API
cd UT.ServiceConsole.API

# Add NuGet packages
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Pomelo.EntityFrameworkCore.MySql
dotnet add package FluentValidation
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
dotnet add package Serilog.AspNetCore
dotnet add package Swashbuckle.AspNetCore

# Restore & build
dotnet restore
dotnet build

# Run development server
dotnet run

# Apply EF Core migrations
dotnet ef migrations add InitialCreate
dotnet ef database update

# Run tests
dotnet test
```

### Docker Deployment
```bash
# Build image
docker build -t ut-service-console:latest .

# Run container
docker run -d -p 5000:5000 \
  -e ConnectionStrings__DefaultConnection="Server=mysql;Database=UT_ServiceConsole;User=root;Password=root;" \
  ut-service-console:latest

# Push to registry
docker tag ut-service-console:latest your-registry/ut-service-console:latest
docker push your-registry/ut-service-console:latest
```

---

## 📡 API Endpoints Quick Reference

### Authentication
```
POST   /api/auth/login
  Body: { "username": "john.doe@utconsole.com", "password": "SecurePass123!" }
  Response: 200 OK { "token": "jwt...", "user": {...} }

POST   /api/auth/logout
  Headers: Authorization: Bearer {token}
  Response: 200 OK { "success": true }

POST   /api/auth/refresh-token
  Body: { "refreshToken": "..." }
  Response: 200 OK { "token": "jwt..." }

POST   /api/auth/forgot-password
  Body: { "email": "john@example.com" }
  Response: 200 OK { "success": true }

POST   /api/auth/validate-password
  Body: { "password": "NewPass123!" }
  Response: 200 OK { "success": true, "message": "Password is valid" }
```

### Cases
```
POST   /api/cases
  Body: {
    "caseType": "Request",
    "priority": "Medium",
    "subject": "Hydraulic Leak",
    "description": "...",
    "assetId": 5,
    "accountId": 3
  }
  Response: 201 Created { "caseId": 101, "caseNumber": "CASE-20260526-00101" }

GET    /api/cases/101
  Response: 200 OK { full case object with all related data }

PATCH  /api/cases/101
  Body: { "status": "Assigned", "priority": "High" }
  Response: 200 OK { "success": true }

DELETE /api/cases/101
  Response: 204 No Content

GET    /api/cases?status=Open&priority=High&skip=0&take=25
  Response: 200 OK { "data": [...], "totalCount": 45, "pageSize": 25 }

GET    /api/cases/search?query=hydraulic
  Response: 200 OK { "data": [...], "totalCount": 3 }
```

### Work Orders
```
POST   /api/workorders
  Body: {
    "caseId": 101,
    "ownerId": 1,
    "subject": "Hydraulic System Repair",
    "description": "Replace cylinder seal and hose",
    "startDate": "2026-05-26T07:31:00Z"
  }
  Response: 201 Created { "workOrderId": 150, "workOrderNumber": "WO-20260526-00150" }

GET    /api/workorders/150
  Response: 200 OK { full work order object }

PATCH  /api/workorders/150
  Body: { "status": "InProgress", "actualStartDate": "2026-05-26T07:35:00Z" }
  Response: 200 OK { "success": true }

DELETE /api/workorders/150
  Response: 204 No Content

GET    /api/workorders?status=InProgress&skip=0&take=25
  Response: 200 OK { "data": [...], "totalCount": 12 }

GET    /api/workorders/search?query=WO-20260526
  Response: 200 OK { "data": [...] }
```

### Search (Global)
```
GET    /api/search?query=hydraulic&type=all&skip=0&take=25
  Response: 200 OK {
    "results": {
      "cases": [...],
      "workOrders": [...],
      "assets": [...],
      "accounts": [...]
    },
    "totalCount": 42
  }
```

---

## 🗄️ Database Quick Reference

### Connection String
```
Server=localhost;Database=UT_ServiceConsole;User=root;Password=root;Port=3306;SslMode=Preferred;
```

### User Credentials (Sample Data)
```
Username: john.doe@utconsole.com
Password: (will be hashed - update with actual hash)
Role: ServiceAdvisor

Username: budi.santoso@utconsole.com
Password: (will be hashed)
Role: Mechanic

Username: admin@utconsole.com
Password: (will be hashed)
Role: Admin
```

### Common Queries
```sql
-- Active cases by priority
SELECT CaseNumber, Subject, Priority, Status
FROM Cases
WHERE Status IN ('Open', 'Assigned', 'InProgress')
ORDER BY Priority DESC, CreatedDate ASC;

-- Mechanic workload
SELECT u.FirstName, u.LastName, COUNT(w.WorkOrderID) as TotalWOs
FROM Users u
LEFT JOIN WorkOrders w ON u.UserID = w.AssignedMechanicID
WHERE u.Role = 'Mechanic'
GROUP BY u.UserID, u.FirstName, u.LastName;

-- SLA compliance status
SELECT c.CaseNumber, s.SLAType, s.TargetDate, s.IsBreached,
       DATEDIFF(s.TargetDate, NOW()) as DaysRemaining
FROM Cases c
INNER JOIN SLA s ON c.CaseID = s.CaseID
WHERE c.Status != 'Closed'
ORDER BY s.TargetDate ASC;

-- Recent activity log
SELECT EntityName, ActionType, FieldName, OldValue, NewValue, ChangedDate
FROM AuditLog
ORDER BY ChangedDate DESC
LIMIT 20;

-- Login history
SELECT u.Username, l.LoginDate, l.LogoutDate, l.Success
FROM LoginHistory l
JOIN Users u ON l.UserID = u.UserID
ORDER BY l.LoginDate DESC
LIMIT 50;
```

---

## 🧪 Testing Checklist

### Authentication Tests
- [ ] Valid login returns JWT token
- [ ] Invalid credentials returns 401
- [ ] Account locks after 5 failed attempts
- [ ] Token expires after 8 hours
- [ ] Refresh token generates new JWT
- [ ] Logout clears session
- [ ] Password validation works

### Case Management Tests
- [ ] Create case generates unique case number
- [ ] Case detail loads all related objects
- [ ] Update case logs audit trail
- [ ] Status transitions work correctly
- [ ] SLA dates calculated correctly
- [ ] Search returns relevant results
- [ ] Filtering by status/priority works
- [ ] Delete case with confirmation works
- [ ] Assign case to owner sends notification

### Work Order Tests
- [ ] Create WO links to case correctly
- [ ] WO detail shows all related data
- [ ] Status transitions update timestamps
- [ ] Assign mechanic works
- [ ] Link to asset works
- [ ] Search/filter functions work
- [ ] Delete WO cascades correctly
- [ ] TSR scores calculated correctly

### Integration Tests
- [ ] Login → Create Case → Link WO → Update Status
- [ ] User with Mechanic role can see assigned WOs
- [ ] Manager can view all cases
- [ ] Admin can manage users
- [ ] Audit log captures all changes

### Performance Tests
- [ ] Case detail page loads < 2 seconds
- [ ] Case list with 1000 records loads < 1 second
- [ ] Search with 10K+ records returns < 1 second
- [ ] Database queries use indexes

### Security Tests
- [ ] SQL injection attempts blocked
- [ ] Cross-site scripting (XSS) blocked
- [ ] Cross-site request forgery (CSRF) protected
- [ ] Unauthorized API access blocked
- [ ] Password hashing verified
- [ ] Sensitive data not logged
- [ ] HTTPS enforced in production

---

## 🔑 Default Test Credentials

**Admin User**
```
Email: admin@utconsole.com
Password: (set during setup)
Role: Admin
```

**Service Advisor**
```
Email: john.doe@utconsole.com
Password: (set during setup)
Role: ServiceAdvisor
```

**Mechanic**
```
Email: budi.santoso@utconsole.com
Password: (set during setup)
Role: Mechanic
```

**Manager**
```
Email: manager.user@utconsole.com
Password: (set during setup)
Role: Manager
```

---

## 📝 Sample API Request/Response

### Login Request
```bash
curl -X POST http://localhost:7001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe@utconsole.com",
    "password": "SecurePass123!",
    "rememberMe": false
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 28800,
  "user": {
    "userId": 2,
    "username": "john.doe@utconsole.com",
    "email": "john.doe@utconsole.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "ServiceAdvisor",
    "department": "Operations"
  }
}
```

### Create Case Request
```bash
curl -X POST http://localhost:7001/api/cases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "caseType": "Request",
    "priority": "High",
    "subject": "Hydraulic Leak on Right Cylinder",
    "description": "Operator reported significant hydraulic fluid leakage...",
    "assetId": 1,
    "accountId": 1,
    "assignedOwnerId": 2
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "caseId": 102,
  "caseNumber": "CASE-20260528-00102",
  "status": "Open",
  "createdDate": "2026-05-28T10:30:00Z"
}
```

---

## 🐛 Debugging Tips

### View Logs
```bash
# Real-time log viewing
tail -f logs/api-*.txt

# Search for errors
grep "ERROR" logs/api-*.txt

# View specific date logs
cat logs/api-2026-05-28.txt
```

### Database Debugging
```sql
-- Check if connection works
SELECT VERSION();

-- Verify tables exist
SHOW TABLES;

-- Check data integrity
SELECT * FROM Cases;
SELECT * FROM WorkOrders WHERE CaseID = 101;

-- View audit trail
SELECT * FROM AuditLog WHERE EntityName = 'Case' AND EntityID = 101;

-- Check SLA status
SELECT * FROM SLA WHERE CaseID = 101;
```

### API Debugging (Postman)
```
1. Set Authorization type to "Bearer Token"
2. Paste token in token field
3. Test endpoint
4. Check response status code
5. View response body for error messages
6. Check network tab for timing
```

### .NET Debugging
```csharp
// Add logging
_logger.LogInformation($"Creating case: {request.Subject}");
_logger.LogError($"Error: {ex.Message}");

// Add breakpoints in VS Code/Visual Studio
// Press F5 to debug
// Step through code with F10 (step over) or F11 (step into)
```

---

## 📊 Status Code Reference

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET request successful |
| 201 | Created | POST successful, resource created |
| 204 | No Content | DELETE successful |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Database/server down |

---

## 🎯 Priority Features (MVP)

### MUST HAVE (Sprint 1-2)
- [x] User authentication (login/logout)
- [x] Case CRUD operations
- [x] Work Order CRUD operations
- [x] Case-WO linking
- [x] Status transitions
- [x] Basic search

### SHOULD HAVE (Sprint 3-4)
- [x] SLA tracking
- [x] Audit logging
- [x] Advanced filtering
- [x] Activity timeline
- [x] Role-based access

### NICE TO HAVE (Sprint 5+)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] File attachments
- [ ] Advanced reporting
- [ ] Mobile app

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (unit + integration)
- [ ] Code review completed
- [ ] Security audit passed
- [ ] Performance tests passed
- [ ] Backup created
- [ ] Rollback plan ready

### Deployment
- [ ] Build Docker image
- [ ] Push to registry
- [ ] Update deployment config
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Verify in production
- [ ] Monitor error logs

### Post-Deployment
- [ ] Verify all endpoints working
- [ ] Check database integrity
- [ ] Monitor server performance
- [ ] Review logs for errors
- [ ] Document any issues
- [ ] Notify stakeholders
- [ ] Create post-deployment report

---

## 🔗 Useful Links

**Documentation:**
- FRD: `FRD_UT_SERVICE_CONSOLE_MVP.md`
- Database Schema: `DATABASE_SCHEMA_UT_SERVICE_CONSOLE.sql`
- Implementation: `DOTNET_IMPLEMENTATION_GUIDE.md`

**Official Resources:**
- .NET Documentation: https://docs.microsoft.com/en-us/dotnet/
- Entity Framework Core: https://docs.microsoft.com/en-us/ef/core/
- MySQL Documentation: https://dev.mysql.com/doc/
- JWT.io: https://jwt.io/

**Development Tools:**
- Visual Studio Code: https://code.visualstudio.com/
- Postman: https://www.postman.com/
- MySQL Workbench: https://www.mysql.com/products/workbench/
- Docker: https://www.docker.com/

---

## 📞 Quick Troubleshooting

### Issue: Database connection fails
```
Solution: 
1. Check MySQL is running: mysql --version
2. Verify connection string in appsettings.json
3. Test manually: mysql -u root -p -e "SELECT 1"
4. Check firewall allows port 3306
```

### Issue: JWT token invalid
```
Solution:
1. Verify token is properly formatted
2. Check secret key in appsettings.json
3. Verify token hasn't expired (8 hours)
4. Check Authorization header format: "Bearer {token}"
```

### Issue: Case not found (404)
```
Solution:
1. Verify case exists: SELECT * FROM Cases WHERE CaseID = {id}
2. Check user has permission to view case
3. Verify endpoint URL is correct
4. Check case wasn't deleted
```

### Issue: Port 7001 already in use
```
Solution:
dotnet run --urls "https://localhost:7002"
# or modify appsettings.json with different port
```

### Issue: EF Core migration error
```
Solution:
1. Drop and recreate database
2. Run: dotnet ef database drop
3. Run: dotnet ef database update
4. Or manually execute: DATABASE_SCHEMA_UT_SERVICE_CONSOLE.sql
```

---

## 🎓 Learning Resources

### .NET Core Best Practices
- Clean Architecture pattern
- Dependency Injection
- Repository Pattern
- Async/Await patterns
- SOLID principles

### Database Design
- Entity-Relationship modeling
- Index optimization
- Query performance tuning
- Backup strategies
- Data normalization

### Security
- Password hashing (SHA-256)
- JWT token management
- HTTPS/TLS encryption
- CORS configuration
- Input validation

### Testing
- Unit testing (xUnit, NUnit)
- Integration testing
- API endpoint testing
- Mock objects
- Test fixtures

---

**Last Updated:** May 28, 2026  
**Version:** 1.0  
**Status:** Ready for Use

Happy coding! 🚀

