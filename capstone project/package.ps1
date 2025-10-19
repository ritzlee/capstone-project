$src = Split-Path -Parent $MyInvocation.MyCommand.Definition
$desktop = [Environment]::GetFolderPath('Desktop')
$timestamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
$dest = Join-Path $desktop "capstone-project-$timestamp.zip"

Write-Output "Packaging project from: $src"
Compress-Archive -Path (Join-Path $src '*') -DestinationPath $dest -Force
Write-Output "Created package: $dest"
