# Stop duplicate Next.js dev servers and clear the dev lock for this project.
# Usage: .\scripts\dev-clean.ps1

$root = Split-Path -Parent $PSScriptRoot
$lock = Join-Path $root ".next\dev\lock"

Write-Host "Stopping Node processes on ports 3000-3002..."
foreach ($port in 3000, 3001, 3002) {
  Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    ForEach-Object {
      $pid = $_.OwningProcess
      if ($pid) {
        Write-Host "  Port $port -> PID $pid"
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
      }
    }
}

if (Test-Path $lock) {
  Remove-Item $lock -Force
  Write-Host "Removed $lock"
}

Write-Host ""
Write-Host "Done. Start one dev server: npm run dev"
Write-Host ""
Write-Host "If you still see EPERM on src\app\preview or success, run as Administrator:"
Write-Host "  .\scripts\remove-locked-app-folders.ps1"
