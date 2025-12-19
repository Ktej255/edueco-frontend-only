/**
 * Two-Factor Authentication Service
 *
 * API client for 2FA operations including setup, verification, and login.
 */

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface TwoFactorSetupResponse {
  secret: string;
  qr_code: string;
}

export interface TwoFactorVerifyResponse {
  success: boolean;
  backup_codes?: string[];
  message: string;
}

export interface TwoFactorStatusResponse {
  is_enabled: boolean;
}

class TwoFactorService {
  /**
   * Initiate 2FA setup - generates secret and QR code
   */
  async setup(): Promise<TwoFactorSetupResponse> {
    const response = await axios.post(
      `${API_URL}/api/v1/2fa/setup`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );
    return response.data;
  }

  /**
   * Verify setup and enable 2FA - returns backup codes
   */
  async verifySetup(
    secret: string,
    code: string,
  ): Promise<TwoFactorVerifyResponse> {
    const response = await axios.post(
      `${API_URL}/api/v1/2fa/verify-setup`,
      { secret, code },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );
    return response.data;
  }

  /**
   * Disable 2FA - requires valid code for security
   */
  async disable(code: string): Promise<TwoFactorVerifyResponse> {
    const response = await axios.post(
      `${API_URL}/api/v1/2fa/disable`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );
    return response.data;
  }

  /**
   * Verify 2FA code during login
   */
  async verifyLogin(code: string): Promise<{
    access_token: string;
    token_type: string;
    require_2fa: boolean;
  }> {
    const response = await axios.post(
      `${API_URL}/api/v1/2fa/verify-login`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );
    return response.data;
  }

  /**
   * Get 2FA status for current user
   */
  async getStatus(): Promise<TwoFactorStatusResponse> {
    const response = await axios.get(`${API_URL}/api/v1/2fa/status`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
    return response.data;
  }

  /**
   * Get auth token from localStorage
   */
  private getToken(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") || "";
  }
}

export const twoFactorService = new TwoFactorService();
