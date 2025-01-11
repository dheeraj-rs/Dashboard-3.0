import { Section } from '../types/scheduler';

interface SectionGroup {
  speaker: string;
  role: string;
  sections: Section[];
}

export function groupSectionsByRole(sections: Section[]): SectionGroup[] {
  const groups: SectionGroup[] = [];
  
  sections.forEach(section => {
    const existingGroup = groups.find(
      group => group.speaker === section.speaker && group.role === section.role
    );
    
    if (existingGroup) {
      existingGroup.sections.push(section);
    } else {
      groups.push({
        speaker: section.speaker,
        role: section.role,
        sections: [section]
      });
    }
  });

  // Sort groups by start time of first section
  return groups.sort((a, b) => {
    const aTime = a.sections[0].timeSlot.start;
    const bTime = b.sections[0].timeSlot.start;
    return aTime.localeCompare(bTime);
  });
}