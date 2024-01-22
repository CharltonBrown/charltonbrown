import { useQuerySubscription } from 'react-datocms';

export default function useLayoutQuery(subscription) {
  const {
    data: {
      aboutUsNavigation: { links: aboutUsLinks },
      allProjectTypes: projectTypes,
      footer,
      legalNavigation: { links: legalNavLinks },
      mainNavigation: { links: mainNavLinks },
    },
  } = useQuerySubscription(subscription);

  const { preview } = subscription;

  const projectTypesNav = projectTypes.map((type) => {
    return {
      id: type.id,
      href: `projects/type/${type.id}/${type.slug}`,
      text: type.typeTitle,
    };
  });

  const navigation = {
    aboutUsNavigation: aboutUsLinks,
    footer,
    legalNavigation: legalNavLinks,
    mainNavigation: mainNavLinks,
    projectTypesNav,
  };

  return { navigation, preview };
}
