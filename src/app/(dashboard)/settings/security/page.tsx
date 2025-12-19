"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { twoFactorService } from "@/services/twoFactorService";
import { TwoFactorVerification } from "@/components/auth/TwoFactorVerification";
import { useToast } from "@/hooks/use-toast";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDisableDialog, setShowDisableDialog] = useState(false);

  useEffect(() => {
    checkTwoFactorStatus();
  }, []);

  const checkTwoFactorStatus = async () => {
    try {
      const status = await twoFactorService.getStatus();
      setTwoFactorEnabled(status.is_enabled);
    } catch (error) {
      console.error("Failed to check 2FA status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = () => {
    router.push("/settings/2fa-setup");
  };

  const handleDisable2FA = async (code: string) => {
    try {
      await twoFactorService.disable(code);
      setTwoFactorEnabled(false);
      setShowDisableDialog(false);
      toast({
        title: "Success",
        description: "2FA has been disabled for your account",
      });
    } catch (error: any) {
      throw error; // Let the TwoFactorVerification component handle the error
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account security and authentication methods
        </p>
      </div>

      {/* Two-Factor Authentication Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {twoFactorEnabled ? (
                <ShieldCheck className="h-8 w-8 text-green-600" />
              ) : (
                <ShieldAlert className="h-8 w-8 text-orange-600" />
              )}
              <div>
                <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </div>
            </div>
            <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
              {twoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showDisableDialog ? (
            <>
              <div className="text-sm text-muted-foreground">
                {twoFactorEnabled ? (
                  <p>
                    Your account is protected with two-factor authentication.
                    You'll need to enter a code from your authenticator app when
                    signing in.
                  </p>
                ) : (
                  <p>
                    Two-factor authentication is currently disabled. We
                    recommend enabling it to add an extra layer of security to
                    your account.
                  </p>
                )}
              </div>

              {!twoFactorEnabled ? (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                    Why enable 2FA?
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li>
                      Protects your account even if your password is compromised
                    </li>
                    <li>
                      Prevents unauthorized access to your courses and data
                    </li>
                    <li>Industry-standard security practice</li>
                  </ul>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    If you've lost access to your authenticator app, you can use
                    one of your backup codes to sign in and disable 2FA.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={
                  twoFactorEnabled
                    ? () => setShowDisableDialog(true)
                    : handleEnable2FA
                }
                variant={twoFactorEnabled ? "destructive" : "default"}
                className="w-full sm:w-auto"
              >
                {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Warning:</strong> Disabling 2FA will make your account
                  less secure. You'll need to enter a verification code to
                  confirm.
                </AlertDescription>
              </Alert>

              <TwoFactorVerification
                onVerify={handleDisable2FA}
                onCancel={() => setShowDisableDialog(false)}
                title="Disable Two-Factor Authentication"
                description="Enter your 2FA code to disable two-factor authentication"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password regularly to keep your account secure
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>

      {/* Sessions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage devices where you're currently signed in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>This feature will be available soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
