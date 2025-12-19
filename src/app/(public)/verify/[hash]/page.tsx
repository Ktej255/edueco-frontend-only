"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  ShieldCheck,
  Clock,
  FileText,
  Hash,
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface VerificationResult {
  verified: boolean;
  chain_valid: boolean;
  block_index: number;
  timestamp: string;
  certificate_data: {
    certificate_number: string;
    student_name: string;
    course_title: string;
    issued_at: string;
    issuer: string;
  };
  hash: string;
}

export default function VerificationPage() {
  const params = useParams();
  const hash = params.hash as string;
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hash) {
      verifyCertificate();
    }
  }, [hash]);

  const verifyCertificate = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/verification/verify/${hash}`,
      );
      setResult(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Verification failed:", err);
      setError(
        "Certificate could not be verified. The hash may be invalid or the record does not exist.",
      );
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying on blockchain ledger...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 rounded-xl border border-red-900/50 p-8 text-center">
          <div className="bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Verification Failed
          </h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/"
            className="text-cyan-500 hover:text-cyan-400 font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900/20 to-cyan-900/20 p-8 text-center border-b border-gray-800">
          <div className="bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <ShieldCheck className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Certificate Verified
          </h1>
          <p className="text-green-400 font-medium">
            This credential is authentic and recorded on the blockchain.
          </p>
        </div>

        {/* Certificate Details */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                Student
              </label>
              <p className="text-lg font-semibold text-white">
                {result.certificate_data.student_name}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                Course
              </label>
              <p className="text-lg font-semibold text-white">
                {result.certificate_data.course_title}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                Issued On
              </label>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>
                  {new Date(
                    result.certificate_data.issued_at,
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                Certificate ID
              </label>
              <div className="flex items-center gap-2 text-gray-300">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="font-mono">
                  {result.certificate_data.certificate_number}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
              <Hash className="h-4 w-4" /> Blockchain Record
            </h3>
            <div className="bg-black/50 rounded-lg p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Block Index:</span>
                <span className="text-cyan-500">#{result.block_index}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Timestamp:</span>
                <span className="text-gray-300">
                  {new Date(result.timestamp).toUTCString()}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block">Cryptographic Hash:</span>
                <span className="text-gray-400 break-all bg-gray-800/50 p-2 rounded block">
                  {result.hash}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className={`w-2 h-2 rounded-full ${result.chain_valid ? "bg-green-500" : "bg-red-500"}`}
                />
                <span
                  className={
                    result.chain_valid ? "text-green-500" : "text-red-500"
                  }
                >
                  {result.chain_valid
                    ? "Ledger Integrity Verified"
                    : "Ledger Compromised"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 p-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            Verified by Eduecosystem Blockchain Ledger • Immutable Record
          </p>
        </div>
      </div>
    </div>
  );
}
