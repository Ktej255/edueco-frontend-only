"use client";

import { PageSection } from "@/store/pageBuilderStore";
import { CheckCircle, Star, Users, BookOpen, Trophy } from "lucide-react";

interface SectionRendererProps {
  section: PageSection;
  isPreview?: boolean;
}

export function SectionRenderer({
  section,
  isPreview = false,
}: SectionRendererProps) {
  const { type, content, styles } = section;

  const paddingClass =
    styles.padding === "large"
      ? "py-20 px-8"
      : styles.padding === "medium"
        ? "py-12 px-6"
        : "py-6 px-4";
  const bgClass =
    styles.backgroundColor !== "transparent"
      ? `bg-${styles.backgroundColor}`
      : "";
  const textAlignClass = `text-${styles.textAlign || "center"}`;

  switch (type) {
    case "hero":
      return (
        <div
          className={`${paddingClass} ${bgClass} bg-gradient-to-br from-cyan-600 to-blue-700 text-white`}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">{content.title}</h1>
            <p className="text-xl mb-8 text-cyan-100">{content.subtitle}</p>
            <button className="bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:bg-cyan-50 transition">
              {content.ctaText}
            </button>
          </div>
        </div>
      );

    case "features":
      return (
        <div className={`${paddingClass} ${bgClass}`}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.features?.map((feature: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-gray-900 p-6 rounded-lg border border-gray-800"
                >
                  <CheckCircle className="h-12 w-12 text-cyan-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "curriculum":
      return (
        <div className={`${paddingClass} ${bgClass} bg-gray-900`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {content.title}
            </h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <BookOpen className="h-5 w-5" />
                <span>Course curriculum will be displayed here</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "instructor":
      return (
        <div className={`${paddingClass} ${bgClass}`}>
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <Users className="h-16 w-16 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-1">
                {content.name}
              </h3>
              <p className="text-cyan-400 mb-3">{content.title}</p>
              <p className="text-gray-400">{content.bio}</p>
            </div>
          </div>
        </div>
      );

    case "testimonials":
      return (
        <div className={`${paddingClass} ${bgClass} bg-gray-900`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              What Students Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.testimonials?.map((testimonial: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-gray-800 p-6 rounded-lg border border-gray-700"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">{testimonial.text}</p>
                  <p className="text-cyan-400 font-semibold">
                    {testimonial.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "stats":
      return (
        <div
          className={`${paddingClass} ${bgClass} bg-gradient-to-r from-cyan-900 to-blue-900`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.stats?.map((stat: any, idx: number) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "pricing":
      return (
        <div className={`${paddingClass} ${bgClass}`}>
          <div className="max-w-md mx-auto bg-gray-900 rounded-xl border-2 border-cyan-500 p-8">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-2">
                ₹{content.price}
              </div>
              <div className="text-gray-400">One-time payment</div>
            </div>
            <ul className="space-y-3 mb-6">
              {content.features?.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="h-5 w-5 text-cyan-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-500 transition">
              Enroll Now
            </button>
          </div>
        </div>
      );

    default:
      return (
        <div className={`${paddingClass} ${bgClass} bg-gray-800`}>
          <div className="max-w-4xl mx-auto text-center text-gray-400">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p>Section type: {type}</p>
          </div>
        </div>
      );
  }
}
