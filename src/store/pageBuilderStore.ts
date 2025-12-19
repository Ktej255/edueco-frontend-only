import { create } from "zustand";

export interface PageSection {
  id: string;
  type:
    | "hero"
    | "features"
    | "curriculum"
    | "instructor"
    | "testimonials"
    | "faq"
    | "pricing"
    | "stats"
    | "video"
    | "richtext";
  content: Record<string, any>;
  styles: Record<string, any>;
}

export interface PageBuilderState {
  sections: PageSection[];
  selectedSectionId: string | null;
  isDirty: boolean;

  // Actions
  addSection: (type: PageSection["type"]) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, updates: Partial<PageSection>) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  selectSection: (id: string | null) => void;
  setSections: (sections: PageSection[]) => void;
  setIsDirty: (dirty: boolean) => void;
  resetBuilder: () => void;
}

export const usePageBuilder = create<PageBuilderState>((set) => ({
  sections: [],
  selectedSectionId: null,
  isDirty: false,

  addSection: (type) =>
    set((state) => {
      const newSection: PageSection = {
        id: `section-${Date.now()}`,
        type,
        content: getDefaultContent(type),
        styles: getDefaultStyles(type),
      };
      return {
        sections: [...state.sections, newSection],
        selectedSectionId: newSection.id,
        isDirty: true,
      };
    }),

  removeSection: (id) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
      selectedSectionId:
        state.selectedSectionId === id ? null : state.selectedSectionId,
      isDirty: true,
    })),

  updateSection: (id, updates) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
      isDirty: true,
    })),

  reorderSections: (fromIndex, toIndex) =>
    set((state) => {
      const newSections = [...state.sections];
      const [removed] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, removed);
      return { sections: newSections, isDirty: true };
    }),

  selectSection: (id) => set({ selectedSectionId: id }),

  setSections: (sections) => set({ sections, isDirty: false }),

  setIsDirty: (dirty) => set({ isDirty: dirty }),

  resetBuilder: () =>
    set({ sections: [], selectedSectionId: null, isDirty: false }),
}));

// Default content for each section type
function getDefaultContent(type: PageSection["type"]): Record<string, any> {
  switch (type) {
    case "hero":
      return {
        title: "Your Course Title",
        subtitle: "Transform your skills with this comprehensive course",
        ctaText: "Enroll Now",
        backgroundImage: "",
      };
    case "features":
      return {
        features: [
          {
            icon: "check",
            title: "Feature 1",
            description: "Description here",
          },
          {
            icon: "check",
            title: "Feature 2",
            description: "Description here",
          },
          {
            icon: "check",
            title: "Feature 3",
            description: "Description here",
          },
        ],
      };
    case "curriculum":
      return {
        title: "Course Curriculum",
        showModules: true,
      };
    case "instructor":
      return {
        name: "Instructor Name",
        title: "Expert Instructor",
        bio: "Brief bio about the instructor",
        photo: "",
      };
    case "testimonials":
      return {
        testimonials: [
          { name: "Student 1", rating: 5, text: "Great course!" },
          { name: "Student 2", rating: 5, text: "Highly recommended!" },
        ],
      };
    case "faq":
      return {
        faqs: [
          { question: "Question 1?", answer: "Answer 1" },
          { question: "Question 2?", answer: "Answer 2" },
        ],
      };
    case "pricing":
      return {
        price: 0,
        currency: "INR",
        features: ["Feature 1", "Feature 2", "Feature 3"],
      };
    case "stats":
      return {
        stats: [
          { label: "Students", value: "1000+" },
          { label: "Hours", value: "10" },
          { label: "Rating", value: "4.8" },
        ],
      };
    case "video":
      return {
        videoUrl: "",
        title: "Course Preview",
      };
    case "richtext":
      return {
        html: "<p>Your content here</p>",
      };
    default:
      return {};
  }
}

// Default styles for each section type
function getDefaultStyles(type: PageSection["type"]): Record<string, any> {
  return {
    padding: "large",
    backgroundColor: "transparent",
    textAlign: "center",
  };
}
