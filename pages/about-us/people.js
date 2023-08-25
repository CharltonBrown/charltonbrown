/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import AboutUsNav from '@/components/about-us-navigation';
import PeopleGrid from '@/components/people-grid';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerFragment from '@/components/footer/fragment';
import legalNavigationFragment from '@/components/legal-navigation/fragment';
import aboutUsNavigationFragment from '@/lib/fragments/about-us-navigation';
import Container from '@/components/container';
import SubNavigation from '@/components/sub-navigation';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query peoplePageContent {
            allPeople(first: 100) {
              email
              id
              jobTitle
              qualification
              bio
              mobile
              name
              phone
              image {
                responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 600, h: 800 }) {
                  ...responsiveImageFragment
                }
              }
              motif {
                svg {
                  url
                }
              }
            }
            ${aboutUsNavigationFragment}
            ${mainNavigationFragment}
            ${footerFragment}
            ${legalNavigationFragment}
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
      footer,
      legalNavigation,
      aboutUsNavigation,
    },
  } = useQuerySubscription(subscription);

  console.log({ people });

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      legalNavigation={legalNavigation.links}
      footer={footer}
    >
      <main className="bg-white">
        <h1 className="sr-only">People</h1>
        <Container>
          <div className="flex">
            <SubNavigation>
              <AboutUsNav links={aboutUsNavigation.links} />
            </SubNavigation>
            <div className="pt-[200px] md:pl-8 grow">
              <PeopleGrid people={people} />
            </div>
          </div>
        </Container>
      </main>
    </Layout>
  );
}
