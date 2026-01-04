# Docker-Git Solutions Validator
# Проверяет соответствие решений требованиям заданий

function Validate-Solution {
    param(
        [int]$TaskNumber,
        [string]$SolutionPath
    )
    
    if (-not (Test-Path $SolutionPath)) {
        return [PSCustomObject]@{
            Task = $TaskNumber
            Status = "MISSING"
            Score = 0
            Issues = @("Файл решения не найден")
        }
    }
    
    $content = Get-Content -Path $SolutionPath -Raw
    $lines = ($content -split "`n").Count
    $sizeKB = [math]::Round((Get-Item $SolutionPath).Length / 1024, 2)
    
    # Критерии проверки
    $checks = @{
        HasHeader = $content -match "===.*TASK.*SOLUTION.*==="
        HasDate = $content -match "Date:.*\d{4}-\d{2}-\d{2}"
        HasObjective = $content -match "OBJECTIVE:|ЦЕЛЬ:"
        HasSteps = $content -match "STEP-BY-STEP|ШАГИ:|EXECUTION"
        HasCommands = $content -match "(git|docker).*\s+\w+"
        HasOutput = $content -match "Output:|Результат:|git log|docker ps"
        HasVerification = $content -match "VERIFICATION|ПРОВЕРКА|REQUIREMENTS MET"
    }
    
    $passedChecks = ($checks.Values | Where-Object { $_ -eq $true }).Count
    $totalChecks = $checks.Count
    $score = [math]::Round(($passedChecks / $totalChecks) * 100, 0)
    
    $issues = @()
    foreach ($check in $checks.GetEnumerator()) {
        if (-not $check.Value) {
            $issues += "Отсутствует: $($check.Key)"
        }
    }
    
    if ($lines -lt 30) {
        $issues += "Слишком короткое решение ($lines строк)"
    }
    
    if ($sizeKB -lt 1) {
        $issues += "Маленький размер ($sizeKB KB)"
    }
    
    $status = if ($score -ge 80) { "PASS" } elseif ($score -ge 60) { "WARNING" } else { "FAIL" }
    
    return [PSCustomObject]@{
        Task = $TaskNumber
        Status = $status
        Score = $score
        Size = "$sizeKB KB"
        Lines = $lines
        Issues = $issues
    }
}

# Проверяем все решения
Write-Host "=== VALIDATION REPORT ===" -ForegroundColor Cyan
Write-Host ""

$results = @()
for ($i = 1; $i -le 10; $i++) {
    $solutionFile = "solutions\task-0$i.txt"
    if ($i -eq 10) { $solutionFile = "solutions\task-10.txt" }
    
    $result = Validate-Solution -TaskNumber $i -SolutionPath $solutionFile
    $results += $result
    
    $color = switch ($result.Status) {
        "PASS" { "Green" }
        "WARNING" { "Yellow" }
        "FAIL" { "Red" }
        "MISSING" { "Magenta" }
    }
    
    Write-Host "Task $($i.ToString().PadRight(2)): " -NoNewline
    Write-Host $result.Status.PadRight(8) -ForegroundColor $color -NoNewline
    Write-Host " | Score: $($result.Score.ToString().PadLeft(3))% | " -NoNewline
    Write-Host "Size: $($result.Size.PadLeft(8)) | " -NoNewline
    Write-Host "Lines: $($result.Lines.ToString().PadLeft(4))"
    
    if ($result.Issues.Count -gt 0) {
        foreach ($issue in $result.Issues) {
            Write-Host "   ️  $issue" -ForegroundColor DarkYellow
        }
    }
}

# Сводная статистика
Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan

$passed = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($results | Where-Object { $_.Status -in @("FAIL", "MISSING") }).Count
$totalScore = [math]::Round(($results | Where-Object { $_.Status -ne "MISSING" } | Measure-Object -Property Score -Average).Average, 1)

Write-Host "Total Tasks: 10"
Write-Host "Passed: $passed"
Write-Host "Failed: $failed"
Write-Host "Average Score: ${totalScore}%"

if ($passed -eq 10) {
    Write-Host "`n✅ ALL TASKS PASSED VALIDATION" -ForegroundColor Green
} else {
    Write-Host "`n ️  SOME TASKS NEED ATTENTION" -ForegroundColor Yellow
}

# Сохраняем отчет
$report = $results | ConvertTo-Json -Depth 3
$report | Out-File -FilePath "validation-report.json" -Encoding UTF8
Write-Host "`nValidation report saved to validation-report.json"
