import React from "react";
import { Award, Download, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CertificateProps {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  certificateId: string;
  onDownload?: () => void;
}

export function CertificatePreview({
  studentName,
  courseTitle,
  instructorName,
  issueDate,
  certificateId,
  onDownload,
}: CertificateProps) {
  return (
    <div className="relative w-full max-w-4xl mx-auto p-8 bg-white shadow-2xl border-8 border-double border-slate-200 rounded-lg">
      {/* Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-lg m-4" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-lg m-4" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-lg m-4" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-lg m-4" />

      <div className="text-center space-y-8 py-12 px-8 border-2 border-slate-100 m-4">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <Award className="w-24 h-24 text-primary" />
          </div>
          <h1 className="text-5xl font-serif text-slate-900 tracking-wide">
            Certificate of Completion
          </h1>
          <p className="text-xl text-slate-500 font-light uppercase tracking-widest">
            This is to certify that
          </p>
        </div>

        {/* Student Name */}
        <div className="py-4 border-b-2 border-slate-100 max-w-2xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-primary italic">
            {studentName}
          </h2>
        </div>

        {/* Course Details */}
        <div className="space-y-4">
          <p className="text-xl text-slate-600">
            has successfully completed the course
          </p>
          <h3 className="text-3xl font-bold text-slate-800">{courseTitle}</h3>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-2 gap-12 max-w-3xl mx-auto mt-12 pt-8">
          <div className="text-center space-y-2">
            <div className="w-full border-b border-slate-300 pb-2">
              <p className="font-serif text-xl">{instructorName}</p>
            </div>
            <p className="text-sm text-slate-500 uppercase tracking-wider">
              Instructor
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-full border-b border-slate-300 pb-2">
              <p className="font-serif text-xl">
                {new Date(issueDate).toLocaleDateString()}
              </p>
            </div>
            <p className="text-sm text-slate-500 uppercase tracking-wider">
              Date Issued
            </p>
          </div>
        </div>

        {/* Certificate ID */}
        <div className="mt-12 text-xs text-slate-400 font-mono">
          Certificate ID: {certificateId}
        </div>
      </div>

      {/* Actions Overlay (Only visible on screen) */}
      <div className="absolute top-4 right-4 flex gap-2 print:hidden">
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
