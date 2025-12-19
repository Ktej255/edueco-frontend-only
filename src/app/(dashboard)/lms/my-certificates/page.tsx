"use client";

import { useState, useEffect } from "react";
import { Award, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificatePreview } from "@/components/features/lms/CertificatePreview";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import api from "@/lib/api";

interface Certificate {
  id: number;
  certificate_number: string;
  course_title: string;
  student_name: string;
  instructor_name: string;
  issued_at: string;
  pdf_url: string | null;
}

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await api.get("/certificates/my-certificates");
      setCertificates(response.data);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certNumber: string) => {
    try {
      // In a real app, this would trigger a file download
      const response = await api.get(`/certificates/${certNumber}/download`);
      window.open(response.data.download_url, "_blank");
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            My Certificates
          </h1>
          <p className="text-gray-400">
            View and download your earned certificates
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
            <Award className="h-16 w-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No certificates yet
            </h3>
            <p className="text-gray-400 mb-6">
              Complete courses to earn certificates. Keep learning!
            </p>
            <Button
              className="bg-cyan-600 hover:bg-cyan-500"
              onClick={() => (window.location.href = "/lms/courses")}
            >
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg">
                    <Award className="h-8 w-8 text-cyan-400" />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700"
                      >
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl bg-transparent border-0 p-0">
                      <CertificatePreview
                        studentName={cert.student_name}
                        courseTitle={cert.course_title}
                        instructorName={cert.instructor_name}
                        issueDate={cert.issued_at}
                        certificateId={cert.certificate_number}
                        onDownload={() =>
                          handleDownload(cert.certificate_number)
                        }
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                  {cert.course_title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Issued on {new Date(cert.issued_at).toLocaleDateString()}
                </p>

                <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500">
                    {cert.certificate_number}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    onClick={() => handleDownload(cert.certificate_number)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
