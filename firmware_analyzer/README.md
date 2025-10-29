# Firmware Analyzer (Web GUI)

A Progressive Web App (PWA) for basic static analysis of firmware files. Built with Vue.js, featuring a modern responsive UI.

## Features

- **File Upload**: Drag and drop or select firmware files (.bin, .img, .elf, .exe)
- **File Type Detection**: Identifies common binary formats using magic bytes
- **String Extraction**: Extracts printable ASCII strings from binary data
- **Hex Dump**: Displays first 256 bytes with hex and ASCII representation
- **Entropy Analysis**: Calculates Shannon entropy to assess randomness
- **PWA Support**: Installable offline-capable app

## Requirements

- Modern web browser with JavaScript enabled
- No server required - runs entirely in the browser

## Usage

1. Open `index.html` in your web browser
2. Select a firmware file using the file picker
3. Click "Analyze Firmware"
4. View analysis results in the sections below

## Analysis Explanations

- **File Info**: Basic file metadata
- **File Type Detection**: Attempts to identify the binary format
- **Strings**: Extracted human-readable strings (useful for embedded device analysis)
- **Hex Dump**: Raw hexadecimal view of the file
- **Entropy Analysis**: Measures data randomness (high entropy may indicate compression/encryption)

## Limitations

- Client-side only (no advanced decompilation or emulation)
- Limited to basic static analysis
- Large files may cause browser performance issues

## Files

- `index.html`: Main application
- `manifest.json`: PWA manifest
- `sw.js`: Service worker for offline functionality
- `README.md`: This documentation

## Installation as PWA

Install the web app from the browser for offline use and app-like experience.
