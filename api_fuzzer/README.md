# Custom Web/API Fuzzer

A lightweight Python tool for automating fuzz testing of web APIs to discover vulnerabilities and unexpected behavior.

## Features

- **Fuzz Payload Generation**: Generates various invalid inputs including SQL injection, XSS, path traversal, command injection, and random data
- **HTTP Methods**: Supports GET, POST, PUT, PATCH requests
- **Vulnerability Detection**: Identifies server errors, malformed responses, and reflected inputs
- **Rate Limiting**: Configurable delay between requests to avoid overwhelming targets

## Requirements

- Python 3.6+
- `requests` library:
  ```
  pip install requests
  ```

## Usage

```
python api_fuzzer.py --url https://example.com/api/endpoint --method POST --delay 0.5
```

### Arguments

- `--url`: Target API endpoint (required, must include http:// or https://)
- `--method`: HTTP method (default: GET, options: GET, POST, PUT, PATCH)
- `--delay`: Seconds to wait between requests (default: 0.1)

## Example

```
python api_fuzzer.py --url https://httpbin.org/post --method POST
```

This will send various fuzzed payloads to the endpoint and highlight any anomalies.

## Files

- `api_fuzzer.py`: Main fuzzer script
- `README.md`: This documentation

## Important Notes

- Use only against targets you have permission to test
- Be respectful with rate limiting to avoid DoS
- This is for educational purposes; advanced fuzzing requires specialized tools
