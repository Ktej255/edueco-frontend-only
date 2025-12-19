"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  Quote,
  Eye,
  Link as LinkIcon,
} from "lucide-react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  height = "400px",
}: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = value;
    }
  }, [value]);

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText =
      textarea.value.substring(0, start) +
      before +
      selectedText +
      after +
      textarea.value.substring(end);

    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length,
      );
    }, 0);
  };

  const formatters = [
    {
      icon: <Bold className="w-4 h-4" />,
      action: () => insertMarkdown("**", "**"),
      label: "Bold",
    },
    {
      icon: <Italic className="w-4 h-4" />,
      action: () => insertMarkdown("*", "*"),
      label: "Italic",
    },
    {
      icon: <Heading1 className="w-4 h-4" />,
      action: () => insertMarkdown("# "),
      label: "Heading 1",
    },
    {
      icon: <Heading2 className="w-4 h-4" />,
      action: () => insertMarkdown("## "),
      label: "Heading 2",
    },
    {
      icon: <List className="w-4 h-4" />,
      action: () => insertMarkdown("- "),
      label: "Bullet List",
    },
    {
      icon: <ListOrdered className="w-4 h-4" />,
      action: () => insertMarkdown("1. "),
      label: "Numbered List",
    },
    {
      icon: <Code className="w-4 h-4" />,
      action: () => insertMarkdown("`", "`"),
      label: "Inline Code",
    },
    {
      icon: <Quote className="w-4 h-4" />,
      action: () => insertMarkdown("> "),
      label: "Quote",
    },
    {
      icon: <LinkIcon className="w-4 h-4" />,
      action: () => insertMarkdown("[", "](url)"),
      label: "Link",
    },
  ];

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering (you can replace with react-markdown for production)
    let html = text
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>',
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-2xl font-bold mb-3 mt-5">$1</h2>',
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-3xl font-bold mb-4 mt-6">$1</h1>',
      )
      // Bold
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      // Code
      .replace(
        /`(.*?)`/gim,
        '<code class="bg-gray-800 px-1 py-0.5 rounded">$1</code>',
      )
      // Lists
      .replace(/^\- (.*$)/gim, '<li class="ml-6">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>')
      // Quotes
      .replace(
        /^\> (.*$)/gim,
        '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-400">$1</blockquote>',
      )
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/gim,
        '<a href="$2" class="text-blue-500 hover:underline" target="_blank">$1</a>',
      )
      // Line breaks
      .replace(/\n/gim, "<br/>");

    return html;
  };

  return (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-800 p-2 flex items-center gap-1 bg-gray-850">
        {formatters.map((formatter, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={formatter.action}
            className="h-8 w-8 p-0 hover:bg-gray-800"
            title={formatter.label}
          >
            {formatter.icon}
          </Button>
        ))}
        <div className="ml-auto flex gap-2">
          <Button
            variant={showPreview ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="h-8"
          >
            <Eye className="w-4 h-4 mr-1" />
            {showPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div style={{ height }}>
        {showPreview ? (
          <div
            className="p-4 overflow-y-auto h-full prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            className="w-full h-full p-4 bg-gray-900 text-gray-100 resize-none focus:outline-none font-mono text-sm"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>

      {/* Help Text */}
      <div className="border-t border-gray-800 px-4 py-2 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Supports Markdown formatting</span>
          <span>{value.length} characters</span>
        </div>
      </div>
    </Card>
  );
}
