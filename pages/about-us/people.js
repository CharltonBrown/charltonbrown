/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import AboutUsNav from '@/components/aboutUsNav';
import PeopleGrid from '@/components/peopleGrid';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerNavigationFragment from '@/components/footerNavigation/fragment';
import aboutUsNavigationFragment from '@/lib/fragments/about-us-navigation';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query peoplePageContent {
            allPeople {
              email
              id
              jobTitle
              qualification
              bio
              mobile
              name
              phone
              image {
                responsiveImage(imgixParams: {fm: jpg, w: 500 }) {
                  ...responsiveImageFragment
                }
              }
            }
            ${aboutUsNavigationFragment}
            ${mainNavigationFragment}
            ${footerNavigationFragment}
          }
          ${responsiveImageFragment}
        `,
    preview,
  };

  return {
    props: {
      subscription: preview
        ? {
            ...graphqlRequest,
            initialData: await request(graphqlRequest),
            token: process.env.CMS_DATOCMS_API_TOKEN,
          }
        : {
            enabled: false,
            initialData: await request(graphqlRequest),
          },
    },
  };
}

export default function People({ subscription }) {
  const {
    data: {
      allPeople: people,
      mainNavigation,
      footerNavigation,
      aboutUsNavigation,
    },
  } = useQuerySubscription(subscription);

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      footerNavigation={footerNavigation.links}
    >
      <h1 className="sr-only">People</h1>
      <div className="p-8">
        <div className="flex">
          <aside className="w-[220px] hidden md:flex h-screen sticky top-0 flex-col justify-center">
            <AboutUsNav links={aboutUsNavigation.links} />
          </aside>
          <div className="pt-[200px] md:pl-8 grow">
            <PeopleGrid people={people} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
