$body = @{
    email = "admin@audit-x.com"
    password = "Admin@123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method POST -Body $body -ContentType "application/json"
