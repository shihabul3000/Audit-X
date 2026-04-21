$body = '{"email":"admin@audit-x.com","password":"Admin@123456"}'
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body $body
Write-Host "Status: $($response.StatusCode)"
$response.Headers
Write-Host $response.Content