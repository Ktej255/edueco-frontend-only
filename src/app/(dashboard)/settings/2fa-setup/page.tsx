"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, Copy, Download } from "lucide-react";
import { twoFactorService } from "@/services/twoFactorService";
import { useToast } from "@/hooks/use-toast";

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<"generate" | "verify" | "complete">(
    "generate",
  );
  const [secret, setSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Generate secret and QR code
  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await twoFactorService.setup();
      setSecret(data.secret);
      setQrCode(data.qr_code);
      setStep("verify");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Failed to generate 2FA setup. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code and enable 2FA
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setLoading(false);
      return;
    }

    try {
      const data = await twoFactorService.verifySetup(secret, verificationCode);

      if (data.success && data.backup_codes) {
        setBackupCodes(data.backup_codes);
        setStep("complete");
        toast({
          title: "Success!",
          description: "2FA has been enabled for your account.",
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  const downloadBackupCodes = () => {
    const content = `Two-Factor Authentication Backup Codes\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join("\n")}\n\nKeep these codes safe! Each can only be used once.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "2fa-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Backup codes saved to file",
    });
  };

  const handleFinish = () => {
    router.push("/settings/security");
  };

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Enable Two-Factor Authentication</h1>
        <p className="text-muted-foreground mt-2">
          Add an extra layer of security to your account
        </p>
      </div>

      {/* Step 1: Generate */}
      {step === "generate" && (
        <Card>
          <CardHeader>
            <CardTitle>Setup Two-Factor Authentication</CardTitle>
            <CardDescription>
              We'll generate a QR code for you to scan with your authenticator
              app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">You'll need:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>
                  An authenticator app (Google Authenticator, Authy, 1Password,
                  etc.)
                </li>
                <li>Your mobile device with the app installed</li>
              </ul>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate QR Code"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Verify */}
      {step === "verify" && (
        <Card>
          <CardHeader>
            <CardTitle>Scan QR Code</CardTitle>
            <CardDescription>
              Use your authenticator app to scan this QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Display */}
            <div className="flex flex-col items-center space-y-4">
              <div className="border-4 border-gray-200 rounded-lg p-4 bg-white">
                <img
                  src={`data:image/png;base64,${qrCode}`}
                  alt="2FA QR Code"
                  className="w-64 h-64"
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm font-medium">
                  Can't scan? Enter this code manually:
                </p>
                <div className="flex items-center gap-2 justify-center">
                  <code className="px-3 py-1.5 bg-muted rounded text-sm font-mono">
                    {secret}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(secret)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">
                  Enter the 6-digit code from your app
                </Label>
                <Input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setVerificationCode(value);
                    setError("");
                  }}
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                  autoComplete="off"
                  autoFocus
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("generate")}
                  disabled={loading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Enable"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Complete - Show Backup Codes */}
      {step === "complete" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <CardTitle>2FA Enabled Successfully!</CardTitle>
            </div>
            <CardDescription>
              Save your backup codes in a safe place
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                <strong>Important:</strong> Save these backup codes now. You
                won't be able to see them again! Each code can only be used
                once.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-4 bg-muted rounded-lg">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="font-mono text-sm px-3 py-2 bg-background rounded border text-center"
                  >
                    {code}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(backupCodes.join("\n"))}
                  className="flex-1"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Codes
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadBackupCodes}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-blue-900">What's next?</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Store these codes in a password manager or safe place</li>
                <li>
                  Use a backup code if you lose access to your authenticator app
                </li>
                <li>
                  Each code works only once - you'll get new ones when you
                  disable and re-enable 2FA
                </li>
              </ul>
            </div>

            <Button onClick={handleFinish} className="w-full">
              Go to Security Settings
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
