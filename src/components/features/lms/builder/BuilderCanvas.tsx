"use client";

import { usePageBuilder } from "@/store/pageBuilderStore";
import { SectionRenderer } from "./SectionRenderer";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Layout } from "lucide-react";
import { PageSection } from "@/store/pageBuilderStore";

function SortableSection({ section }: { section: PageSection }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });
  const selectSection = usePageBuilder((state) => state.selectSection);
  const removeSection = usePageBuilder((state) => state.removeSection);
  const selectedSectionId = usePageBuilder((state) => state.selectedSectionId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedSectionId === section.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isSelected ? "ring-2 ring-cyan-500" : ""}`}
    >
      {/* Hover Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          {...attributes}
          {...listeners}
          className="p-2 bg-gray-900 rounded-lg border border-gray-700 hover:border-cyan-500 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeSection(section.id);
          }}
          className="p-2 bg-gray-900 rounded-lg border border-gray-700 hover:border-red-500 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Section Content */}
      <div onClick={() => selectSection(section.id)} className="cursor-pointer">
        <SectionRenderer section={section} isPreview />
      </div>
    </div>
  );
}

export function BuilderCanvas() {
  const sections = usePageBuilder((state) => state.sections);
  const reorderSections = usePageBuilder((state) => state.reorderSections);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      reorderSections(oldIndex, newIndex);
    }
  }

  if (sections.length === 0) {
    return (
      <div className="flex-1 bg-black overflow-y-auto flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Layout className="h-16 w-16 mx-auto mb-4 text-gray-700" />
          <p className="text-lg">
            Click sections on the left to add them to your page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-black overflow-y-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section) => (
            <SortableSection key={section.id} section={section} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
