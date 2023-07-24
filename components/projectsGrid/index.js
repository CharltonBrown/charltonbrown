import React, { useState } from 'react';
import clsx from 'clsx';

import OddEvenGrid from '@/components/oddEvenGrid';

const ALL_PROJECTS = 'All Projects';

export default function ProjectsGrid({ projects, projectTypes }) {
  const [displayData, setDisplayData] = useState(projects);
  const [activeType, setActiveType] = useState(ALL_PROJECTS);

  const handleClick = (type) => {
    if (type === activeType) return;
    setActiveType(type);
    setDisplayData([]);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    if (type === ALL_PROJECTS) {
      setTimeout(() => {
        setDisplayData(projects);
      }, 400);
      return;
    }

    const filteredData = projects.filter(
      (project) => project.projectType.typeTitle === type,
    );

    setTimeout(() => {
      setDisplayData(filteredData);
    }, 400);
  };

  const filteredProjectTypes = projectTypes.filter((type) =>
    projects.some(
      (project) => project.projectType.typeTitle === type.typeTitle,
    ),
  );

  return (
    <div className="flex" id="content">
      <aside className="w-[220px] h-screen sticky top-0 flex flex-col justify-center">
        <nav>
          <ul className="flex flex-col">
            <li>
              <button
                type="button"
                onClick={() => handleClick('All Projects')}
                className={clsx(
                  ALL_PROJECTS !== activeType && 'text-silver',
                  'text-xl',
                )}
              >
                {ALL_PROJECTS}
              </button>
            </li>
            {filteredProjectTypes.map((type) => (
              <li key={type.id}>
                <button
                  type="button"
                  onClick={() => handleClick(type.typeTitle)}
                  className={clsx(
                    type.typeTitle !== activeType && 'text-silver',
                    'text-xl',
                  )}
                >
                  {type.typeTitle}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="pt-[200px] pl-8">
        <OddEvenGrid
          items={displayData}
          parentSlug="projects"
          type="projects"
        />
      </div>
    </div>
  );
}
