"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Brain,
  TrendingUp,
  FileText,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function GraphologyPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/grapho/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Analysis failed. Please try again.",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(droppedFile);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          ✍️ AI Handwriting Analysis
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Upload a sample of your handwriting to unlock personality insights and
          cognitive patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="bg-gray-900 border-gray-800 p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Upload className="mr-2 h-5 w-5 text-purple-400" />
            Upload Handwriting Sample
          </h3>

          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 transition-colors"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">
                Drop your image here or click to browse
              </p>
              <p className="text-gray-400 text-sm">
                Supports JPG, PNG up to 10MB
              </p>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border-2 border-purple-500/30">
                <img src={preview} alt="Preview" className="w-full" />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleUpload}
                  disabled={analyzing}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                >
                  {analyzing ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Handwriting
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setResult(null);
                  }}
                  variant="outline"
                  className="border-gray-700 text-gray-400"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}
        </Card>

        {/* Results Section */}
        <Card className="bg-gray-900 border-gray-800 p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Brain className="mr-2 h-5 w-5 text-cyan-400" />
            Analysis Results
          </h3>

          {!result ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FileText className="h-20 w-20 text-gray-700 mb-4" />
              <p className="text-gray-500">
                Upload and analyze a sample to see results
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Extracted Text */}
              {result.extracted_text && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase">
                    Extracted Text
                  </h4>
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-white">{result.extracted_text}</p>
                  </div>
                </div>
              )}

              {/* Handwriting Features */}
              {result.features && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase">
                    Handwriting Characteristics
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(result.features).map(
                      ([key, value]: [string, any]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg"
                        >
                          <span className="text-white capitalize">
                            {key.replace("_", " ")}
                          </span>
                          <span className="text-cyan-400 font-bold">
                            {value}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Personality Analysis */}
              {result.analysis && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase flex items-center">
                    <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
                    Personality Insights
                  </h4>
                  <div className="space-y-3">
                    {result.analysis.traits?.map((trait: any, i: number) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white">{trait.trait}</span>
                          <span className="text-purple-400 font-bold">
                            {trait.score}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${trait.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reward */}
              <div className="p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Sparkles className="h-5 w-5 text-yellow-400" />
                    </div>
                    <span className="text-white">Analysis Complete!</span>
                  </div>
                  <span className="text-yellow-400 font-bold">+50 Coins</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30 p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Check className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">Accurate Analysis</h4>
              <p className="text-gray-400 text-sm">
                Our AI-powered OCR extracts text with 95%+ accuracy and analyzes
                20+ handwriting features
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">
                Personality Insights
              </h4>
              <p className="text-gray-400 text-sm">
                Discover cognitive patterns, learning styles, and personality
                traits from your writing
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30 p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">Track Progress</h4>
              <p className="text-gray-400 text-sm">
                Upload multiple samples over time to see how your writing and
                traits evolve
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
