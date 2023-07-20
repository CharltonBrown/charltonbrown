import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import OddEvenGrid from '@/components/oddEvenGrid';

export default function ProjectsGrid({ projects, projectTypes }) {
  const chunkSize = 2;
  const chunks = [];

  for (let i = 0; i < projects.length; i += chunkSize) {
    const chunk = {
      id: uuidv4(),
      projects: projects.slice(i, i + chunkSize),
    };
    chunks.push(chunk);
  }

  return (
    <div className="flex">
      <aside className="w-[220px] h-screen sticky top-0 flex flex-col justify-center">
        <nav>
          <ul className="flex flex-col">
            {projectTypes.map((type) => (
              <li key={type.id}>
                <button type="button" className="text-xl text-silver ">
                  {type.typeTitle}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="pt-[200px] pl-8">
        <OddEvenGrid items={projects} parentSlug="projects" type="projects" />
      </div>
    </div>
  );
}
