$targetFile = "c:\Users\hp\Desktop\Assignments\Audit-X\Actual-Project\Frontend\allcodecopy.txt"
$sourceDirs = @("c:\Users\hp\Desktop\Assignments\Audit-X\Actual-Project\Frontend", "c:\Users\hp\Desktop\Assignments\Audit-X\Actual-Project\Backend")

# Clear target file
if (Test-Path $targetFile) {
    Remove-Item -Force $targetFile
}
New-Item -ItemType File -Force -Path $targetFile | Out-Null

$extensions = @(".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".env", ".json")

Get-ChildItem -Path $sourceDirs -Recurse -File | Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\dist\\" -and
    $_.FullName -notmatch "\\build\\" -and
    $_.FullName -notmatch "\\.git\\" -and
    $_.FullName -notmatch "n4_13_complete_code\.txt" -and
    $_.Name -ne "allcodecopy.txt" -and
    $_.Name -ne "package-lock.json" -and
    $extensions -contains $_.Extension
} | ForEach-Object {
    $header = "`r`n`r`n/* =========================================================`r`n * File: $($_.FullName)`r`n * ========================================================= */`r`n`r`n"
    Add-Content -Path $targetFile -Value $header
    Get-Content $_.FullName -Raw | Add-Content -Path $targetFile
}
Write-Host "Code gathering complete!"
