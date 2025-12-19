"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  LifeBuoy,
  Users,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  Link as LinkIcon,
  Sparkles,
  User,
  Palette,
  MessageSquare,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

const avatarPurposes = [
  {
    id: "sales",
    icon: ShoppingBag,
    title: "Sales",
    description: "Chat with your potential audience & guide them to purchase your courses, webinars or memberships",
  },
  {
    id: "support",
    icon: LifeBuoy,
    title: "Support",
    description: "Provide personalized assistance to your current users, answer their questions, and help them get maximum value",
  },
  {
    id: "engage",
    icon: Users,
    title: "Engage",
    description: "Deliver tailored guidance and expertise to individual users, focusing on their specific goals and challenges",
  },
  {
    id: "generic",
    icon: HelpCircle,
    title: "I don't know yet",
    description: "Interact generically using your authentic tone and communication style, building connections",
  },
];

const steps = [
  { id: 1, label: "Add purpose" },
  { id: 2, label: "Feed AI brain" },
  { id: 3, label: "Finishing touches" },
];

export default function AIAvatarsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 2 state
  const [knowledgeBase, setKnowledgeBase] = useState({
    documents: [] as File[],
    urls: "",
    instructions: "",
  });

  // Step 3 state
  const [avatarConfig, setAvatarConfig] = useState({
    name: "",
    description: "",
    personality: "",
    tone: "professional",
    responseStyle: "concise",
  });

  const handleContinue = () => {
    if (currentStep === 1 && selectedPurpose) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      handleCreateAvatar();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setKnowledgeBase((prev) => ({
        ...prev,
        documents: [...prev.documents, ...files],
      }));
    }
  };

  const removeDocument = (index: number) => {
    setKnowledgeBase((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleCreateAvatar = async () => {
    try {
      setLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("purpose", selectedPurpose || "");
      formData.append("name", avatarConfig.name);
      formData.append("description", avatarConfig.description);
      formData.append("personality", avatarConfig.personality);
      formData.append("tone", avatarConfig.tone);
      formData.append("response_style", avatarConfig.responseStyle);
      formData.append("urls", knowledgeBase.urls);
      formData.append("instructions", knowledgeBase.instructions);

      knowledgeBase.documents.forEach((file) => {
        formData.append("documents", file);
      });

      await api.post("/ai/avatars", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Redirect to avatars list
      router.push("/ai-avatars/list");
    } catch (error) {
      console.error("Failed to create avatar:", error);
      alert("Failed to create avatar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canContinue = () => {
    if (currentStep === 1) return selectedPurpose !== null;
    if (currentStep === 2) return true; // Optional step
    if (currentStep === 3) return avatarConfig.name.trim() !== "";
    return false;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step.id === currentStep
                      ? "bg-blue-600 text-white"
                      : step.id < currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                >
                  {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span
                  className={`ml-2 text-sm ${step.id === currentStep
                      ? "text-blue-400 font-medium"
                      : step.id < currentStep
                        ? "text-green-400"
                        : "text-gray-500"
                    }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-24 h-0.5 bg-gray-700 mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Add Purpose */}
        {currentStep === 1 && (
          <div>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-3">What would your AI avatar do?</h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                AI avatars can do many things. Choose the one that you want it to do right
                now. Don't worry, you can always create multiple avatars to do more things.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {avatarPurposes.map((purpose) => {
                const Icon = purpose.icon;
                return (
                  <Card
                    key={purpose.id}
                    className={`cursor-pointer transition-all ${selectedPurpose === purpose.id
                        ? "bg-blue-950/50 border-blue-600 border-2"
                        : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                      }`}
                    onClick={() => setSelectedPurpose(purpose.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg ${selectedPurpose === purpose.id
                              ? "bg-blue-600"
                              : "bg-gray-800"
                            }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{purpose.title}</h3>
                          <p className="text-gray-400">{purpose.description}</p>
                        </div>
                        {selectedPurpose === purpose.id && (
                          <div className="text-blue-600">
                            <Check className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Feed AI Brain */}
        {currentStep === 2 && (
          <div>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-3">Feed your AI's brain</h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Upload documents, add URLs, or provide instructions to train your AI avatar
                with your knowledge and expertise.
              </p>
            </div>

            <div className="space-y-6">
              {/* Document Upload */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <Label className="text-lg font-semibold">Upload Documents</Label>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    PDFs, Word docs, text files, or any learning materials
                  </p>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-600 transition-colors">
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt,.md"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-blue-400 hover:text-blue-300">
                        Click to upload
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                  </div>
                  {knowledgeBase.documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {knowledgeBase.documents.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-800 p-3 rounded"
                        >
                          <span className="text-sm">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* URLs */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <LinkIcon className="w-5 h-5 text-blue-400" />
                    <Label className="text-lg font-semibold">Website URLs</Label>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Add URLs to web pages you want your AI to learn from (one per line)
                  </p>
                  <Textarea
                    placeholder="https://example.com/about&#10;https://example.com/faq"
                    rows={4}
                    value={knowledgeBase.urls}
                    onChange={(e) =>
                      setKnowledgeBase((prev) => ({ ...prev, urls: e.target.value }))
                    }
                    className="bg-gray-800 border-gray-700"
                  />
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <Label className="text-lg font-semibold">Special Instructions</Label>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Any specific guidelines or context for your AI avatar
                  </p>
                  <Textarea
                    placeholder="E.g., Always be enthusiastic about our courses, mention our money-back guarantee when discussing pricing..."
                    rows={5}
                    value={knowledgeBase.instructions}
                    onChange={(e) =>
                      setKnowledgeBase((prev) => ({
                        ...prev,
                        instructions: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-700"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: Finishing Touches */}
        {currentStep === 3 && (
          <div>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-3">Finishing touches</h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Customize your AI avatar's personality and communication style
              </p>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-blue-400" />
                    <Label className="text-lg font-semibold">Avatar Name *</Label>
                  </div>
                  <Input
                    placeholder="E.g., Learning Assistant, Sales Guide, Support Helper"
                    value={avatarConfig.name}
                    onChange={(e) =>
                      setAvatarConfig((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="bg-gray-800 border-gray-700"
                  />
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <Label className="text-lg font-semibold">Description</Label>
                  </div>
                  <Textarea
                    placeholder="Brief description of what this avatar does..."
                    rows={3}
                    value={avatarConfig.description}
                    onChange={(e) =>
                      setAvatarConfig((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="bg-gray-800 border-gray-700"
                  />
                </CardContent>
              </Card>

              {/* Personality */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Palette className="w-5 h-5 text-blue-400" />
                    <Label className="text-lg font-semibold">Personality Traits</Label>
                  </div>
                  <Textarea
                    placeholder="E.g., Friendly, professional, empathetic, patient..."
                    rows={3}
                    value={avatarConfig.personality}
                    onChange={(e) =>
                      setAvatarConfig((prev) => ({ ...prev, personality: e.target.value }))
                    }
                    className="bg-gray-800 border-gray-700"
                  />
                </CardContent>
              </Card>

              {/* Tone & Style */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-6">
                    <Label className="text-base font-semibold mb-3 block">Tone</Label>
                    <select
                      value={avatarConfig.tone}
                      onChange={(e) =>
                        setAvatarConfig((prev) => ({ ...prev, tone: e.target.value }))
                      }
                      className="w-full bg-gray-800 border-gray-700 rounded p-2 text-white"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="formal">Formal</option>
                    </select>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-6">
                    <Label className="text-base font-semibold mb-3 block">
                      Response Style
                    </Label>
                    <select
                      value={avatarConfig.responseStyle}
                      onChange={(e) =>
                        setAvatarConfig((prev) => ({
                          ...prev,
                          responseStyle: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-800 border-gray-700 rounded p-2 text-white"
                    >
                      <option value="concise">Concise</option>
                      <option value="detailed">Detailed</option>
                      <option value="conversational">Conversational</option>
                    </select>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="lg"
            disabled={currentStep === 1}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back
          </Button>

          <Button
            onClick={handleContinue}
            disabled={!canContinue() || loading}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            {loading
              ? "Creating..."
              : currentStep === 3
                ? "Create Avatar"
                : "Continue"}
            {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
