"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface TwoFactorVerificationProps {
  onVerify: (code: string) => Promise<void>;
  onCancel?: () => void;
  title?: string;
  description?: string;
  allowBackupCode?: boolean;
}

export function TwoFactorVerification({
  onVerify,
  onCancel,
  title = "Two-Factor Authentication",
  description = "Enter the 6-digit code from your authenticator app",
  allowBackupCode = true,
}: TwoFactorVerificationProps) {
  const [code, setCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Please enter a code");
      return;
    }

    if (!useBackupCode && code.length !== 6) {
      setError("Code must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      await onVerify(code);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // For TOTP codes, only allow numbers and limit to 6 digits
    if (!useBackupCode) {
      if (!/^\d*$/.test(value) || value.length > 6) return;
    }

    setCode(value);
    setError("");
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {useBackupCode
            ? "Enter one of your backup recovery codes"
            : description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">
            {useBackupCode ? "Backup Code" : "Verification Code"}
          </Label>
          <Input
            id="code"
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder={useBackupCode ? "XXXXXXXX" : "000000"}
            className="text-center text-2xl tracking-widest"
            autoComplete="off"
            autoFocus
            disabled={loading}
            maxLength={useBackupCode ? undefined : 6}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !code.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>

          {allowBackupCode && (
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setCode("");
                setError("");
              }}
              disabled={loading}
            >
              {useBackupCode
                ? "Use authenticator app instead"
                : "Use backup code instead"}
            </Button>
          )}

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="text-xs text-center text-muted-foreground">
        <p>
          Lost access to your authenticator app?{" "}
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => setUseBackupCode(true)}
          >
            Use a backup code
          </button>
        </p>
      </div>
    </div>
  );
}
