# Windows Security Hardening Script

Komplexní bezpečnostní skript pro ochranu Windows systémů proti současným exploit trendům (2024-2025).

## 🚀 Funkce

### **1. Windows Defender Configuration**
- Real-time monitoring
- Cloud-based protection
- Network protection
- Controlled folder access (anti-ransomware)
- Attack Surface Reduction (ASR) rules
- Tamper protection

### **2. Firewall Configuration**
- Advanced firewall rules
- Inbound connection blocking
- Custom rules for attack vectors
- Comprehensive logging

### **3. User Account Security**
- Password policies
- Account lockout configuration
- UAC (User Account Control)
- Guest account management
- Windows Hello support

### **4. Audit and Logging**
- Advanced audit policies
- Event log configuration
- Security event monitoring
- PowerShell logging

### **5. Network Security**
- Service hardening
- Credential Guard
- Virtualization-based security
- Unnecessary service disabling

### **6. Patch Management**
- Automatic Windows updates
- Microsoft Update integration
- Update service configuration

### **7. Anti-Ransomware Protection**
- Controlled folder access
- System folder protection
- Process mitigation
- Ransomware-specific rules

### **8. Monitoring and Alerting**
- Windows Event Forwarding
- Sysmon integration
- Enhanced visibility
- Security monitoring

## 📋 Požadavky

- Windows 10/11 (x64)
- Administrator privileges
- PowerShell 5.1+
- Internet connection (for updates)

## 🛠️ Použití

### **Základní spuštění:**
```powershell
.\windows-security-hardening.ps1
```

### **Audit režim (bez změn):**
```powershell
.\windows-security-hardening.ps1 -AuditOnly
```

### **S backupem konfigurace:**
```powershell
.\windows-security-hardening.ps1 -Backup
```

### **Vlastní log cesta:**
```powershell
.\windows-security-hardening.ps1 -LogPath "C:\Security\audit.log"
```

### **Kompletní hardening:**
```powershell
.\windows-security-hardening.ps1 -ApplyChanges -Backup
```

### **Pouze ASR rules:**
```powershell
.\windows-security-hardening.ps1 -ApplyASR -Backup
```

## 📁 Výstupy

### **Log soubor:**
- `Security-Audit.log` na ploše
- Detailní záznam všech operací
- Error reporting a troubleshooting

### **Backup složka:**
- `Security-Backup-YYYYMMDD-HHMMSS` na ploše
- Firewall rules export
- Security policy backup
- Audit policy configuration

## ⚠️ Důležité upozornění

### **Před spuštěním:**
1. **Zálohujte data** - skript provádí systémové změny
2. **Spusťte jako Administrator** - vyžaduje oprávnění
3. **Zkontrolujte kompatibilitu** - testujte na neprodukčních systémech
4. **Přečtěte log** - vždy zkontrolujte výstup

### **Možné dopady:**
- Některé aplikace mohou vyžadovat firewall exceptions
- Síťové služby mohou být ovlivněny
- Legacy aplikace mohou mít problémy s ASR rules

## 🔧 Přizpůsobení

### **Úprava chráněných složek:**
```powershell
$protectedFolders = @(
    "C:\Custom\Folder1",
    "C:\Custom\Folder2"
)
```

### **Přidání firewall rules:**
```powershell
$customRules = @(
    @{Name="Custom Service"; Port=8080; Direction="Inbound"; Action="Allow"}
)
```

### **Konfigurace ASR rules:**
```powershell
$asrRules = @(
    "rule-guid-here", # Popis pravidla
    "another-rule-guid"  # Další pravidlo
)
```

## 📊 Monitoring

### **Po spuštění:**
1. **Zkontrolujte Windows Security** - ověřte nastavení
2. **Prohlédněte Event Viewer** - zkontrolujte logy
3. **Testujte konektivitu** - ověřte síťové služby
4. **Monitorujte výkon** - sledujte systémové prostředky

### **Pravidelné úkoly:**
- Spouštějte skript měsíčně pro audit
- Kontrolujte Windows Update
- Monitorujte security logy
- Aktualizujte ASR rules podle nových hrozeb

## 🆘 Troubleshooting

### **Časté problémy:**

**"Access Denied" error:**
- Spusťte PowerShell jako Administrator
- Zkontrolujte antivirové nastavení

**Firewall blokuje aplikace:**
- Přidejte specifické firewall rules
- Zkontrolujte log soubor pro detaily

**ASR rules příliš restriktivní:**
- Dočasně vypněte specifické ASR rules
- Přidejte exceptions pro legitimní aplikace

**Výkonnostní problémy:**
- Zkontrolujte resource utilization
- Upravte monitoring intenzitu
- Optimalizujte log retention

## 📞 Podpora

### **Log soubor obsahuje:**
- System information
- Applied configurations
- Error messages
- Troubleshooting data

### **Problémy:**
1. Zkontrolujte log soubor
2. Ověřte systémové požadavky
3. Testujte v safe módu
4. Kontaktujte IT podporu

## 🔒 Bezpečnostní doporučení

### **Best Practices:**
- **Pravidelné spouštění** - měsíční security audit
- **Monitoring** - kontinuální sledování logů
- **Backup** - pravidelné zálohování konfigurace
- **Testing** - testování na neprodukčních systémech
- **Updates** - udržování Windows a aplikací aktuální

### **Zero Trust přístup:**
- Verify every access request
- Implement least privilege
- Use multi-factor authentication
- Monitor and log all activities

## 📈 Aktualizace

### **Pro aktualizace:**
1. Zkontrolujte GitHub repository
2. Stáhněte novou verzi
3. Zálohujte konfiguraci
4. Spusťte aktualizovaný skript

### **Nové funkce:**
- AI-based threat detection
- Cloud security integration
- Advanced behavioral analysis
- Automated incident response

---

**⚠️ Disclaimer:** Tento skript provádí významné systémové změny. Vždy zálohujte data a testujte na neprodukčních systémech před nasazením v produkčním prostředí.
