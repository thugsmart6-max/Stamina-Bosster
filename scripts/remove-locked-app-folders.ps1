# Run this script in PowerShell **as Administrator** to remove broken
# src/app/preview and src/app/success folders (leftover from i18n migration).
# After removal, you can use default Turbopack: npm run dev

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$targets = @(
  Join-Path $root "src\app\preview"
  Join-Path $root "src\app\success"
)

foreach ($path in $targets) {
  if (-not (Test-Path -LiteralPath $path)) {
    Write-Host "Skip (not found): $path"
    continue
  }
  Write-Host "Removing: $path"
  takeown /f $path /a /r /d y | Out-Null
  icacls $path /reset /t /c | Out-Null
  icacls $path /grant "${env:USERNAME}:(F)" /t | Out-Null
  Remove-Item -LiteralPath $path -Recurse -Force
}

Write-Host "Done. Restart dev server with: npm run dev"
