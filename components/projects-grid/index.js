import React, { useState } from 'react';
import clsx from 'clsx';

import OddEvenGrid from '@/components/odd-even-grid';
import SubNavigation from '@/components/sub-navigation';

const ALL_PROJECTS = 'All Projects';

export default function ProjectsGrid({ projects, projectTypes }) {
  const [displayData, setDisplayData] = useState(projects);
  const [activeType, setActiveType] = useState(ALL_PROJECTS);

  const handleClick = (type) => {
    if (type === activeType) return;
    setActiveType(type);
    setDisplayData([]);

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
    <div className="flex">
      <SubNavigation>
        <nav>
          <ul className="flex flex-col">
            <li className="mb-2">
              <button
                type="button"
                onClick={() => handleClick('All Projects')}
                className={clsx(
                  'text-lg tracking-wider hover:text-black focus:text-black transition',
                  ALL_PROJECTS !== activeType && 'text-silver',
                )}
              >
                {ALL_PROJECTS}
              </button>
            </li>
            {filteredProjectTypes.map((type) => (
              <li key={type.id} className="mb-2">
                <button
                  type="button"
                  onClick={() => handleClick(type.typeTitle)}
                  className={clsx(
                    'text-lg tracking-wider hover:text-black focus:text-black transition',
                    type.typeTitle !== activeType && 'text-silver',
                  )}
                >
                  {type.typeTitle}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </SubNavigation>
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
