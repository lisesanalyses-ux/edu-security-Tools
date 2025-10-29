// Reversio Pro - Main Script
document.addEventListener('DOMContentLoaded', function() {
    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }

    // Module navigation
    const launchButtons = document.querySelectorAll('.launch-btn');
    const moduleContent = document.getElementById('module-content');
    const dashboard = document.querySelector('.dashboard');

    launchButtons.forEach(button => {
        button.addEventListener('click', function() {
            const module = this.parentElement.dataset.module;
            loadModule(module);
        });
    });

    // Update time
    updateTime();
    setInterval(updateTime, 1000);

    // Update battery (simulated)
    updateBattery();
    setInterval(updateBattery, 30000);
});

function updateTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();
    timeElement.textContent = `Time: ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function updateBattery() {
    const batteryElement = document.getElementById('battery');
    // Simulate battery drain
    const currentBattery = parseInt(batteryElement.textContent.match(/\d+/)[0]);
    const newBattery = Math.max(10, currentBattery - Math.floor(Math.random() * 5));
    batteryElement.textContent = `Battery: ${newBattery}%`;
}

function loadModule(moduleName) {
    const moduleContent = document.getElementById('module-content');
    const dashboard = document.querySelector('.dashboard');

    dashboard.style.display = 'none';
    moduleContent.classList.remove('hidden');

    let content = '';

    switch(moduleName) {
        case 'decompiler':
            content = createDecompilerModule();
            break;
        case 'proto-capture':
            content = createProtoCaptureModule();
            break;
        case 'flash-toolkit':
            content = createFlashToolkitModule();
            break;
        case 'debug-run':
            content = createDebugRunModule();
            break;
        case 'power-audit':
            content = createPowerAuditModule();
            break;
        default:
            content = '<p>Module not found</p>';
    }

    moduleContent.innerHTML = content;

    // Add back button functionality
    const backBtn = moduleContent.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            moduleContent.classList.add('hidden');
            dashboard.style.display = 'block';
        });
    }

    // Add module-specific functionality
    initializeModule(moduleName);
}

function createDecompilerModule() {
    return `
        <div class="module-header">
            <h3>DECOMPILER-lite</h3>
            <button class="back-btn">Back</button>
        </div>
        <div class="form-group">
            <label for="firmware-file">Firmware File:</label>
            <input type="file" id="firmware-file" accept=".bin,.hex,.elf">
        </div>
        <div class="form-group">
            <label for="arch-select">Architecture:</label>
            <select id="arch-select">
                <option value="arm">ARM</option>
                <option value="x86">x86</option>
                <option value="x64">x64</option>
                <option value="mips">MIPS</option>
            </select>
        </div>
        <button class="btn" id="decompile-btn">Decompile</button>
        <button class="btn btn-secondary" id="export-decompile">Export Results</button>
        <div class="results" id="decompile-results"></div>
    `;
}

function createProtoCaptureModule() {
    return `
        <div class="module-header">
            <h3>PROTO-CAPTURE</h3>
            <button class="back-btn">Back</button>
        </div>
        <div class="form-group">
            <label for="interface-select">Interface:</label>
            <select id="interface-select">
                <option value="usb">USB</option>
                <option value="serial">Serial</option>
                <option value="spi">SPI</option>
                <option value="i2c">I2C</option>
                <option value="can">CAN</option>
            </select>
        </div>
        <div class="form-group">
            <label for="capture-duration">Duration (seconds):</label>
            <input type="number" id="capture-duration" value="10" min="1" max="300">
        </div>
        <button class="btn" id="start-capture-btn">Start Capture</button>
        <button class="btn btn-secondary" id="export-capture">Export Capture</button>
        <div class="results" id="capture-results"></div>
    `;
}

function createFlashToolkitModule() {
    return `
        <div class="module-header">
            <h3>FLASH-TOOLKIT</h3>
            <button class="back-btn">Back</button>
        </div>
        <div class="form-group">
            <label for="flash-file">Flash File:</label>
            <input type="file" id="flash-file" accept=".bin,.hex">
        </div>
        <div class="form-group">
            <label for="chip-select">Chip Type:</label>
            <select id="chip-select">
                <option value="nor">NOR Flash</option>
                <option value="nand">NAND Flash</option>
                <option value="eeprom">EEPROM</option>
            </select>
        </div>
        <button class="btn" id="read-flash-btn">Read Flash</button>
        <button class="btn" id="write-flash-btn">Write Flash</button>
        <button class="btn btn-secondary" id="export-flash">Export Data</button>
        <div class="results" id="flash-results"></div>
    `;
}

function createDebugRunModule() {
    return `
        <div class="module-header">
            <h3>DEBUG-RUN</h3>
            <button class="back-btn">Back</button>
        </div>
        <div class="form-group">
            <label for="debug-target">Target Binary:</label>
            <input type="file" id="debug-target" accept=".bin,.elf,.exe">
        </div>
        <div class="form-group">
            <label for="debug-args">Arguments:</label>
            <input type="text" id="debug-args" placeholder="Command line arguments">
        </div>
        <button class="btn" id="run-debug-btn">Run in Sandbox</button>
        <button class="btn btn-secondary" id="export-debug">Export Log</button>
        <div class="results" id="debug-results"></div>
    `;
}

function createPowerAuditModule() {
    return `
        <div class="module-header">
            <h3>POWER-AUDIT</h3>
            <button class="back-btn">Back</button>
        </div>
        <div class="form-group">
            <label for="audit-duration">Audit Duration (seconds):</label>
            <input type="number" id="audit-duration" value="30" min="5" max="300">
        </div>
        <div class="form-group">
            <label for="sample-rate">Sample Rate (Hz):</label>
            <select id="sample-rate">
                <option value="10">10 Hz</option>
                <option value="50">50 Hz</option>
                <option value="100">100 Hz</option>
            </select>
        </div>
        <button class="btn" id="start-audit-btn">Start Audit</button>
        <button class="btn btn-secondary" id="export-audit">Export Report</button>
        <div class="results" id="audit-results"></div>
    `;
}

function initializeModule(moduleName) {
    switch(moduleName) {
        case 'decompiler':
            initDecompiler();
            break;
        case 'proto-capture':
            initProtoCapture();
            break;
        case 'flash-toolkit':
            initFlashToolkit();
            break;
        case 'debug-run':
            initDebugRun();
            break;
        case 'power-audit':
            initPowerAudit();
            break;
    }
}

function initDecompiler() {
    const decompileBtn = document.getElementById('decompile-btn');
    const exportBtn = document.getElementById('export-decompile');
    const results = document.getElementById('decompile-results');

    decompileBtn.addEventListener('click', function() {
        results.innerHTML = '<pre>Analyzing firmware...\n\nDecompiled functions:\n- main()\n- init_hardware()\n- process_data()\n- security_check()\n\nVulnerabilities found:\n- Buffer overflow in process_data()\n- Weak encryption in security_check()\n\nAnalysis complete.</pre>';
    });

    exportBtn.addEventListener('click', function() {
        exportData('decompile_results.json', { functions: ['main', 'init_hardware'], vulnerabilities: ['buffer_overflow', 'weak_encryption'] });
    });
}

function initProtoCapture() {
    const startBtn = document.getElementById('start-capture-btn');
    const exportBtn = document.getElementById('export-capture');
    const results = document.getElementById('capture-results');

    startBtn.addEventListener('click', function() {
        const duration = document.getElementById('capture-duration').value;
        results.innerHTML = `<pre>Capturing protocol data for ${duration} seconds...\n\nPackets captured:\n1. USB: SETUP (0x80) -> ACK\n2. SPI: MOSI: 0xDEADBEEF\n3. I2C: START -> 0x50 -> DATA -> STOP\n4. CAN: ID: 0x123, DATA: 0xFF00AA55\n\nCapture complete. ${Math.floor(Math.random() * 100) + 50} packets analyzed.</pre>`;
    });

    exportBtn.addEventListener('click', function() {
        exportData('protocol_capture.pcap', { packets: ['usb_setup', 'spi_data', 'i2c_transaction', 'can_frame'] });
    });
}

function initFlashToolkit() {
    const readBtn = document.getElementById('read-flash-btn');
    const writeBtn = document.getElementById('write-flash-btn');
    const exportBtn = document.getElementById('export-flash');
    const results = document.getElementById('flash-results');

    readBtn.addEventListener('click', function() {
        results.innerHTML = '<pre>Reading flash memory...\n\nChip ID: 0xEF4017\nSize: 16MB\n\nData dump:\n00000000: FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF\n00000010: 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F\n...\n\nRead complete.</pre>';
    });

    writeBtn.addEventListener('click', function() {
        results.innerHTML = '<pre>Writing to flash memory...\n\nVerifying write...\nBlock 0: OK\nBlock 1: OK\n...\n\nWrite complete. Verification passed.</pre>';
    });

    exportBtn.addEventListener('click', function() {
        exportData('flash_dump.bin', { chip_id: '0xEF4017', size: '16MB', data: 'binary_data_here' });
    });
}

function initDebugRun() {
    const runBtn = document.getElementById('run-debug-btn');
    const exportBtn = document.getElementById('export-debug');
    const results = document.getElementById('debug-results');

    runBtn.addEventListener('click', function() {
        results.innerHTML = '<pre>Running binary in sandbox...\n\nProcess started: PID 1234\n\nOutput:\nInitializing hardware...\nLoading configuration...\nProcessing input data...\nSecurity check passed.\n\nExecution time: 2.3 seconds\nMemory usage: 45MB\nSystem calls: 127\n\nSandbox terminated safely.</pre>';
    });

    exportBtn.addEventListener('click', function() {
        exportData('debug_log.txt', { pid: 1234, execution_time: '2.3s', memory: '45MB', syscalls: 127 });
    });
}

function initPowerAudit() {
    const startBtn = document.getElementById('start-audit-btn');
    const exportBtn = document.getElementById('export-audit');
    const results = document.getElementById('audit-results');

    startBtn.addEventListener('click', function() {
        const duration = document.getElementById('audit-duration').value;
        results.innerHTML = `<pre>Power audit running for ${duration} seconds...\n\nMeasurements:\nTime(s) | Voltage(V) | Current(mA) | Power(mW)\n--------|------------|-------------|-----------\n0.0     | 3.3        | 150         | 495\n1.0     | 3.3        | 180         | 594\n2.0     | 3.3        | 200         | 660\n...\n\nPeak power: 750mW\nAverage power: 580mW\nEnergy consumed: 17.4J\n\nAudit complete.</pre>`;
    });

    exportBtn.addEventListener('click', function() {
        exportData('power_audit.csv', [
            { time: 0.0, voltage: 3.3, current: 150, power: 495 },
            { time: 1.0, voltage: 3.3, current: 180, power: 594 }
        ]);
    });
}

function exportData(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
