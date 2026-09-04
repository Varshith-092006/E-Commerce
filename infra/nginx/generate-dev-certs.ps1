$certsDir = Join-Path $PSScriptRoot "certs"
if (!(Test-Path $certsDir)) {
    New-Item -ItemType Directory -Force -Path $certsDir | Out-Null
}

$keyPath = Join-Path $certsDir "server.key"
$crtPath = Join-Path $certsDir "server.crt"

if (Get-Command openssl -ErrorAction SilentlyContinue) {
    & openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $keyPath -out $crtPath -subj "/C=US/ST=State/L=City/O=EcommercePlatform/OU=Engineering/CN=localhost"
    Write-Host "Generated self-signed certificates using openssl at $certsDir"
} else {
    Write-Warning "openssl command not found. Please install OpenSSL or generate certificates manually."
}
