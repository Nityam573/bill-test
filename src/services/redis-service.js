/**
 * Redis Service for Verifier
 * 
 * Handles all Redis operations for session management and verification storage.
 * Replaces in-memory storage for production scalability.
 */

const { createClient } = require('redis');

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Initialize Redis connection
   */
  async connect() {
    try {
      this.client = createClient({
        username: process.env.REDIS_USERNAME || 'default',
        password: process.env.REDIS_PASSWORD || 'RjBmT7Oj1xtassQ3b5KJVZ4qPRD3knaA',
        socket: {
          host: process.env.REDIS_HOST || 'redis-10577.c14.us-east-1-2.ec2.redns.redis-cloud.com',
          port: parseInt(process.env.REDIS_PORT) || 10577
        }
      });

      this.client.on('error', err => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
      });

      this.client.on('disconnect', () => {
        console.log('❌ Redis disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
      
      // Test connection
      await this.client.ping();
      console.log('✅ Redis connection established and tested');
      
    } catch (error) {
      console.error('❌ Failed to connect to Redis:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      console.log('✅ Redis disconnected gracefully');
    }
  }

  /**
   * Store auth request with session ID
   * @param {number} sessionId - Session identifier
   * @param {Object} authRequest - Auth request object
   * @param {number} ttl - Time to live in seconds (default: 1 hour)
   */
  async setAuthRequest(sessionId, authRequest, ttl = 3600) {
    try {
      const key = `auth_request:${sessionId}`;
      await this.client.setEx(key, ttl, JSON.stringify(authRequest));
      console.log(`✅ Auth request stored for session ${sessionId}`);
    } catch (error) {
      console.error(`❌ Failed to store auth request for session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Get auth request by session ID
   * @param {number} sessionId - Session identifier
   * @returns {Object|null} Auth request object or null if not found
   */
  async getAuthRequest(sessionId) {
    try {
      const key = `auth_request:${sessionId}`;
      const result = await this.client.get(key);
      return result ? JSON.parse(result) : null;
    } catch (error) {
      console.error(`❌ Failed to get auth request for session ${sessionId}:`, error);
      return null;
    }
  }

  /**
   * Delete auth request by session ID
   * @param {number} sessionId - Session identifier
   */
  async deleteAuthRequest(sessionId) {
    try {
      const key = `auth_request:${sessionId}`;
      await this.client.del(key);
      console.log(`✅ Auth request deleted for session ${sessionId}`);
    } catch (error) {
      console.error(`❌ Failed to delete auth request for session ${sessionId}:`, error);
    }
  }

  /**
   * Store user verification status
   * @param {string} nullifier - User nullifier (unique identifier)
   * @param {Object} verificationData - Verification data
   * @param {number} ttl - Time to live in seconds (default: 24 hours)
   */
  async setUserVerification(nullifier, verificationData, ttl = 86400) {
    try {
      const key = `user_verification:${nullifier}`;
      await this.client.setEx(key, ttl, JSON.stringify(verificationData));
      console.log(`✅ User verification stored for nullifier ${nullifier}`);
    } catch (error) {
      console.error(`❌ Failed to store user verification for nullifier ${nullifier}:`, error);
      throw error;
    }
  }

  /**
   * Get user verification status
   * @param {string} nullifier - User nullifier (unique identifier)
   * @returns {Object|null} Verification data or null if not found
   */
  async getUserVerification(nullifier) {
    try {
      const key = `user_verification:${nullifier}`;
      const result = await this.client.get(key);
      return result ? JSON.parse(result) : null;
    } catch (error) {
      console.error(`❌ Failed to get user verification for nullifier ${nullifier}:`, error);
      return null;
    }
  }

  /**
   * Check if user is already verified
   * @param {string} nullifier - User nullifier (unique identifier)
   * @returns {boolean} True if user is verified
   */
  async isUserVerified(nullifier) {
    try {
      const verification = await this.getUserVerification(nullifier);
      return verification && verification.verified === true;
    } catch (error) {
      console.error(`❌ Failed to check user verification for nullifier ${nullifier}:`, error);
      return false;
    }
  }

  /**
   * Store verification status for a request
   * @param {number} requestId - Request identifier
   * @param {string} status - Status (pending, success, failed)
   * @param {number} ttl - Time to live in seconds (default: 1 hour)
   */
  async setVerificationStatus(requestId, status, ttl = 3600) {
    try {
      const key = `verification_status:${requestId}`;
      await this.client.setEx(key, ttl, status);
      console.log(`✅ Verification status set for request ${requestId}: ${status}`);
    } catch (error) {
      console.error(`❌ Failed to set verification status for request ${requestId}:`, error);
      throw error;
    }
  }

  /**
   * Get verification status for a request
   * @param {number} requestId - Request identifier
   * @returns {string|null} Status or null if not found
   */
  async getVerificationStatus(requestId) {
    try {
      const key = `verification_status:${requestId}`;
      return await this.client.get(key);
    } catch (error) {
      console.error(`❌ Failed to get verification status for request ${requestId}:`, error);
      return null;
    }
  }

  /**
   * Health check for Redis connection
   * @returns {boolean} True if Redis is connected and responding
   */
  async healthCheck() {
    try {
      if (!this.client || !this.isConnected) {
        return false;
      }
      const pong = await this.client.ping();
      return pong === 'PONG';
    } catch (error) {
      console.error('❌ Redis health check failed:', error);
      return false;
    }
  }

  /**
   * Get Redis connection status
   * @returns {boolean} True if connected
   */
  isHealthy() {
    return this.isConnected;
  }
}

// Create singleton instance
const redisService = new RedisService();

module.exports = redisService;
