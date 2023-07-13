import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';

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
      <div className="pl-8">
        {chunks.map((chunk) => (
          <div
            className={clsx(
              chunk.projects.length > 1 && 'items-center',
              'md:flex flex-nowrap gap-16',
            )}
            key={chunk.id}
          >
            {chunk.projects.map((project) => (
              <article
                key={project.id}
                className="odd:w-[calc(50%+1.5rem)] even:w-[calc(50%-1.5rem)] mb-12"
              >
                <Link href={`/projects/${project.slug}`}>
                  <Image
                    className="object-cover mb-4"
                    width={project.mainImage.responsiveImage.width}
                    height={project.mainImage.responsiveImage.height}
                    src={project.mainImage.responsiveImage.src}
                    alt={project.mainImage.responsiveImage.alt}
                  />
                  <div className="flex flex-col">
                    <h3 className="mb-1 text-gray">
                      {project.projectType?.typeTitle}
                    </h3>
                    <h2 className="text-3xl">{project.title}</h2>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
