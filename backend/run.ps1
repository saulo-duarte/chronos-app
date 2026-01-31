function Load-DotEnv {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Path
    )
 
    if (-not (Test-Path $Path)) {
        Write-Error "Arquivo .env não encontrado em: $Path"
        exit 1
    }
 
    Write-Host "Carregando variáveis do arquivo .env..."
 
    Get-Content $Path | ForEach-Object {
        $line = $_.Trim()
 
        if ($line -notmatch '^\s*#|^\s*$') {
            if ($line -match '^([a-zA-Z_]+[a-zA-Z0-9_]*)=(.*)$') {
                $key = $Matches[1]
                $value = $Matches[2]
 
                if ($value -match '^"(.*)"$') {
                    $value = $Matches[1]
                } elseif ($value -match "^'(.*)'$") {
                    $value = $Matches[1]
                }
 
                [Environment]::SetEnvironmentVariable($key, $value, 'Process')
                Write-Host " -> Definido $key" -ForegroundColor Green
            }
        }
    }
}
 
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$EnvFilePath = Join-Path $ScriptDir ".env"
 
Load-DotEnv -Path $EnvFilePath
 
 
Write-Host "`nExecutando 'go run main.go'..."
try {
    go run main.go
}
catch {
    Write-Error "Falha ao executar 'go run main.go': $($_.Exception.Message)"
    exit 1
}