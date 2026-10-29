import crypto from 'crypto';
import { env } from '../config/env';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

// The key must be exactly 32 bytes for aes-256-gcm
// We use a Buffer to ensure standard character encoding doesn't break byte length
const key = Buffer.from(env.MESSAGE_ENCRYPTION_KEY, 'utf-8').subarray(0, 32);

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a single string formatted as: iv:authTag:encryptedText
 */
export const encryptMessage = (text: string | null | undefined): string | null => {
  if (!text) return null;

  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted: string = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt message content');
  }
};

/**
 * Decrypts a ciphertext string encrypted with AES-256-GCM.
 * The input must be formatted as: iv:authTag:encryptedText
 */
export const decryptMessage = (encryptedText: string | null | undefined): string | null => {
  if (!encryptedText) return null;
  
  // If the text doesn't look like our encrypted format (legacy messages), return as is
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    return encryptedText;
  }

  const ivHex = parts[0];
  const authTagHex = parts[1];
  const encryptedHex = parts[2];

  if (!ivHex || !authTagHex || !encryptedHex) {
    return encryptedText;
  }

  try {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted: string = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed for a message:', error);
    return '[(Message encrypted or unreadable)]';
  }
};
