## Cryptix - Password Manager

Cryptix is a secure password manager that allows users to store documents, login credentials, IDs, and bank card information. Built using TypeScript, React, Next.js, Firebase (for data storage), and Clerk (for authentication).

### 🔐 How Data Is Stored
*Encryption:* Data is encrypted using AES-256-GCM for confidentiality and integrity.
*Zero-Knowledge Architecture:* No sensitive data is ever visible or accessible on the server. Decryption happens only on the client.
*Data Export:* Users can securely reveal their data on the client and export it as a CSV file.

### ⚠️ Security Notice
Cryptix is still a work in progress, and while encryption is in place, there are current security concerns, such as key exposure - the encryption key is temporarily accessible in memory, making it vulnerable to extraction.

I am working on secure key storage and hardware-backed encryption to mitigate these risks. Feel free to experiment with Cryptix, but do not use it to store real passwords yet!
