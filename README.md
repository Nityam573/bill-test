# Billions Wallet Verification Integration Example

This project is a demo backend and static UI for integrating verifications via Billions Wallet. It allows you to generate verification requests and verify zero-knowledge proofs from the wallet. 

## 📋 Supported Verification Types

- **POH (Proof of Humanity)**: Verify users are real humans via `Human` credential
- **POU (Proof of Uniqueness)**: Verify user uniqueness via `Uniqueness` credential
- **POVH (Proof of Verified Humaity)** Verify that users are `Verified human` via Verified Human (passport/Aadhaar) cred
## Quick Start

1. **Install dependencies**

```bash
cd "Integration-for-verifiers (Billions Wallet)/js"
npm install
```

### 2. Configure Environment Variables

Create a `.env` file based on the `env.example` in the `js/` directory:

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```bash
# Server Configuration
PORT=8080
HOST_URL=https://your-domain.com  # Your production domain or ngrok URL for development

# Verifier Configuration  
VERIFIER_DID=your_verifier_did_here
USE_CASE=POU  # Options: POH, POU, POVH
NULLIFIER_SESSION_ID=your_nullifier_session_id

# Redis Configuration (Production)
REDIS_HOST=redis-10577.c14.us-east-1-2.ec2.redns.redis-cloud.com
REDIS_PORT=10577
REDIS_USERNAME=default
REDIS_PASSWORD=RjBmT7Oj1xtassQ3b5KJVZ4qPRD3knaA
```

### 3. Set Up Public Access

The Billions mobile app sends callbacks to your server, so you need public access. Use tools like:
- ngrok
- localtunnel


### 4. Start the Server

```bash
node index.js
```

You should see:
```
🚀 Privado verifier backend running on port 8080
🔧 Using verification configuration: POU (Verified Human)
✅ Redis connected successfully
📊 Redis storage enabled for production scalability
```

### 5. Test the Integration

1. **Open your browser** to `http://localhost:8080`
2. **Check health status** at `http://localhost:8080/api/health` to verify Redis connection
3. **Reload** the page to start a session and invoke verification request.
4. **Click** the button to continue flow on Billions Web Wallet or **Scan the QR after downloading the APP** to continue the flow on the native app.
5. **Complete verification** in the app
6. **See status update** on the web page

### 6. Production Features

This implementation includes production-ready features:

- **Redis Storage**: Persistent storage for sessions and verifications
- **Health Check**: `/api/health` endpoint for monitoring
- **Graceful Shutdown**: Proper cleanup of Redis connections
- **Error Handling**: Comprehensive error handling for Redis operations
- **TTL Management**: Automatic expiration of stored data
- **Security**: Rate limiting, CORS, and security headers


---

**Ready to integrate Billions verification into your application? Start with this example and customize it for your needs!** 🚀

## License
MIT


