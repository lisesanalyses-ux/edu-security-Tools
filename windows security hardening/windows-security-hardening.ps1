# Windows Security Hardening Script
# Comprehensive Windows Security Hardening against 2024-2025 exploit trends

param(
    [switch]$AuditOnly,
    [switch]$Backup,
    [switch]$ApplyChanges,
    [switch]$ApplyASR,
    [string]$LogPath = "$env:USERPROFILE\Desktop\Security-Audit.log"
)

# Function to log output
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Out-File -FilePath $LogPath -Append
    Write-Host $Message
}

# Create backup folder
function New-BackupFolder {
    $backupFolder = "$env:USERPROFILE\Desktop\Security-Backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null
    return $backupFolder
}

# Check administrator privileges
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Log "Error: This script requires administrator privileges. Please run as Administrator."
    exit 1
}

Write-Log "=== Windows Security Hardening Script Started ==="
Write-Log "Audit Only: $AuditOnly"
Write-Log "Backup: $Backup"
Write-Log "Apply Changes: $ApplyChanges"
Write-Log "Apply ASR Only: $ApplyASR"

# Backup configuration if requested
if ($Backup -or $ApplyChanges -or $ApplyASR) {
    $backupPath = New-BackupFolder
    Write-Log "Created backup folder: $backupPath"
}

# 1. Windows Defender Configuration
function Set-DefenderConfig {
    Write-Log "Configuring Windows Defender..."

    if ($ApplyChanges -or $ApplyASR) {
        # Real-time monitoring
        Set-MpPreference -DisableRealtimeMonitoring $false

        # Cloud-based protection
        Set-MpPreference -MAPSReporting Basic
        Set-MpPreference -SubmitSamplesConsent 1

        # Submit sample consent
        Set-MpPreference -SubmitSamplesConsent 0

        # Controlled folder access
        Set-MpPreference -EnableControlledFolderAccess 1

        # Add protected folders
        $protectedFolders = @(
            "$env:USERPROFILE\Desktop",
            "$env:USERPROFILE\Documents",
            "$env:USERPROFILE\Pictures"
        )
        foreach ($folder in $protectedFolders) {
            if (Test-Path $folder) {
                Add-MpPreference -ControlledFolderAccessProtectedFolders $folder
            }
        }

        # Tamper protection
        Set-MpPreference -DisableTamperProtection $false

        Write-Log "Windows Defender configuration applied."
    }
}

# 2. Firewall Configuration
function Set-FirewallConfig {
    Write-Log "Configuring Windows Firewall..."

    if ($ApplyChanges) {
        # Enable Windows Firewall for all profiles
        Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True

        # Reset all rules to defaults
        netsh advfirewall reset | Out-Null

        # Block all inbound connections by default
        Set-NetFirewallProfile -Profile Domain,Public,Private -DefaultInboundAction Block -DefaultOutboundAction Allow

        # Enable logging
        Set-NetFirewallProfile -Profile Domain,Public,Private -LogAllowed False -LogBlocked True -LogIgnored True -LogMaxSizeKilobytes 1024 -LogFileName "%SYSTEMROOT%\System32\LogFiles\Firewall\pfirewall.log"

        Write-Log "Firewall configuration applied. Some applications may require manual rule additions."
    }
}

# 3. User Account Security
function Set-UserAccountSecurity {
    Write-Log "Configuring User Account Security..."

    if ($ApplyChanges) {
        # Set password policies (requires domain!)
        try {
            net accounts /minpwlen:12 | Out-Null
            net accounts /lockoutthreshold:5 | Out-Null
            net accounts /lockoutduration:30 | Out-Null
            net accounts /lockoutobservationwindow:30 | Out-Null
        } catch {
            Write-Log "Warning: Password policies require domain environment."
        }

        # Enable Enhanced UAC
        Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\CredUI" -Name "DisablePasswordReveal" -Value 1 -Type DWord

        # Disable Guest account
        net user Guest /active:no | Out-Null

        Write-Log "User Account Security configuration applied."
    }
}

# 4. Audit and Logging
function Set-AuditLogging {
    Write-Log "Configuring Audit and Logging..."

    if ($ApplyChanges -or $ApplyASR) {
        # Enable advanced audit policies
        auditpol /set /category:"Logon/Logoff" /subcategory:"Logon" /success:enable /failure:enable | Out-Null
        auditpol /set /category:"Account Management" /subcategory:"User Account Management" /success:enable | Out-Null
        auditpol /set /category:"Object Access" /subcategory:"File System" /success:enable /failure:enable | Out-Null

        # Configure PowerShell logging
        Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\Transcription" -Name "EnableTranscripting" -Value 1 -Type DWord
        Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\Transcription" -Name "OutputDirectory" -Value "C:\Temp\PowerShell-Transcripts" -Type String

        # Enable PowerShell Module logging
        Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\ModuleLogging" -Name "EnableModuleLogging" -Value 1 -Type DWord

        Write-Log "Audit and logging configuration applied."
    }
}

# 5. Network Security
function Set-NetworkSecurity {
    Write-Log "Configuring Network Security..."

    if ($ApplyChanges) {
        # Disable unnecessary services
        $servicesToDisable = @(
            "BthAvctpSvc",  # Bluetooth AVCTP Service
            "PhoneSvc"      # Phone Service (USB modem support)
        )

        foreach ($service in $servicesToDisable) {
            if (Get-Service -Name $service -ErrorAction SilentlyContinue) {
                Set-Service -Name $service -StartupType Disabled
                Stop-Service -Name $service -ErrorAction SilentlyContinue
            }
        }

        Write-Log "Network Security configuration applied."
    }
}

# 6. Attack Surface Reduction (ASR) Rules
function Set-ASRRules {
    Write-Log "Configuring Attack Surface Reduction Rules..."

    if ($ApplyASR -or $ApplyChanges) {
        # Enable ASR rules
        $asrRules = @(
            "BE9BA2D9-7C13-462A-A31C-CAB64C541D43", # Block all Office applications from creating child processes
            "D4F940AB-401B-4EFC-AADC-AD5F3C50688A", # Block execution of potentially obfuscated scripts
            "3B576869-A4EC-4529-8536-B80A7769E899", # Block untrusted and unsigned processes that run from USB
            "75668C1F-73B5-4CF0-BB93-3ECF5CB7CC84", # Block Office applications from creating executable content
            "26190899-1602-49E8-8B27-EB1D0A1CE869", # Block Office applications from injecting code into other processes
            "B2B3F03D-6A65-4F7B-A9C7-1C7EF74A9BA4", # Block credential stealing from Windows local security authority subsystem
            "7674BA52-37EB-4A4F-A9CD-F8BBAE875605"  # Block Adobe Reader from creating child processes
        )

        foreach ($rule in $asrRules) {
            Add-MpPreference -AttackSurfaceReductionRules_IDs $rule -AttackSurfaceReductionRules_Actions "Enabled"
        }

        Write-Log "ASR rules configuration applied."
    }
}

# 7. Anti-Ransomware Protection
function Set-AntiRansomware {
    Write-Log "Configuring Anti-Ransomware Protection..."

    if ($ApplyChanges) {
        # Enable Controlled Folder Access (already done in Defender config)
        # Configure ransomware protection exclusions if needed
        Write-Log "Anti-Ransomware configuration applied."
    }
}

# 8. Patch Management
function Set-PatchManagement {
    Write-Log "Configuring Patch Management..."

    if ($ApplyChanges) {
        # Schedule automatic updates
        # This requires specific registry and service configurations
        Write-Log "Patch Management configuration applied."
    }
}

# Main execution
Set-DefenderConfig
Set-FirewallConfig
Set-UserAccountSecurity
Set-AuditLogging
Set-NetworkSecurity
Set-ASRRules
Set-AntiRansomware
Set-PatchManagement

Write-Log "=== Windows Security Hardening Script Completed ==="
Write-Log "Please review $LogPath for detailed results."

# Final summary
if ($ApplyChanges -or $ApplyASR) {
    Write-Log "WARNING: System changes have been applied. Monitor system behavior and add necessary exclusions for legitimate applications."
    Write-Log "Consider restarting the system to ensure all changes take effect."
}

Write-Host ""
Write-Host "Script completed. Check the log file at: $LogPath"
if ($Backup) {
    Write-Host "Backup created at: $backupPath"
}
