export type NavItem = {
  title: string;
  slug: string;
  hidden: boolean;
  children: null | NavItem[];
};

export type LayoutData = null | {
  allPages: null | {
    title: string;
    slug: string;
    hidden: boolean;
    children: null | NavItem[];
  }[];
};

export type AllProjects = {
  name: string;
  url: string;
  media: {
    url: string;
  };
  description: string;
  parts: {
    name: string;
    url: string;
    description: string;
  }[];
}[];
