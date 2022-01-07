import dedent from "dedent";

const API_URL = "https://graphql.datocms.com";
const API_TOKEN = process.env.DATOCMS_API_TOKEN;

// See: https://www.datocms.com/blog/offer-responsive-progressive-lqip-images-in-2020
const responsiveImageFragment = `
  fragment responsiveImageFragment on ResponsiveImage {
    srcSet
    webpSrcSet
    sizes
    src
    width
    height
    aspectRatio
    alt
    title
    bgColor
    base64
  }
`;

const cache = new Map();

const DEBUG = false;

async function fetchAPI(
  query: string,
  opts?: { variables?: Record<string, any>; preview?: boolean }
): Promise<Record<string, any>> {
  const variables = opts?.variables ?? {};
  const preview = opts?.preview ?? false;

  const key = JSON.stringify([query, variables, preview]);
  let output = cache.get(key);

  if (!output) {
    if (DEBUG) {
      console.debug("QUERY:");
      console.debug(dedent(query));
      console.debug("VARIABLES:");
      console.debug(JSON.stringify(variables, null, 2));
    }
    const res = await fetch(`${API_URL}${preview ? "/preview" : ""}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    output = await res.json();
    cache.set(key, output);

    if (DEBUG) {
      console.debug("OUTPUT:");
      console.debug(JSON.stringify(output, null, 2));
    }
  }

  if (output.errors) {
    console.error(output.errors);
    throw new Error("Failed to fetch API");
  }

  return output.data;
}

export async function getPreviewPostBySlug(slug: string) {
  const data = await fetchAPI(
    `
    query PostBySlug($slug: String) {
      post(filter: {slug: {eq: $slug}}) {
        slug
      }
    }`,
    {
      preview: true,
      variables: {
        slug,
      },
    }
  );
  return data?.post ?? null;
}

export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    {
      allPosts {
        slug
      }
    }
  `);
  return data?.allPosts ?? null;
}

export async function getAllPostsForHome(preview: boolean) {
  const data = await fetchAPI(
    `
    {
      allPosts(orderBy: date_DESC, first: 20) {
        title
        slug
        excerpt
        date
        coverImage {
          url
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
            ...responsiveImageFragment
          }
        }
        author {
          name
          picture {
            url(imgixParams: {fm: jpg, fit: crop, w: 100, h: 100, sat: -100})
          }
        }
      }
    }

    ${responsiveImageFragment}
  `,
    { preview }
  );
  return data?.allPosts ?? null;
}

export async function getPostAndMorePosts(slug: string, preview: boolean) {
  const data = await fetchAPI(
    `
    query PostBySlug($slug: String) {
      post(filter: {slug: {eq: $slug}}) {
        title
        slug
        content
        date
        ogImage: coverImage {
          url
        }
        coverImage {
          url
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
            ...responsiveImageFragment
          }
        }
        author {
          name
          picture {
            url(imgixParams: {fm: jpg, fit: crop, w: 100, h: 100, sat: -100})
          }
        }
      }

      morePosts: allPosts(orderBy: date_DESC, first: 2, filter: {slug: {neq: $slug}}) {
        title
        slug
        excerpt
        date
        coverImage {
          url
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
            ...responsiveImageFragment
          }
        }
        author {
          name
          picture {
            url(imgixParams: {fm: jpg, fit: crop, w: 100, h: 100, sat: -100})
          }
        }
      }
    }

    ${responsiveImageFragment}
    `,
    {
      preview,
      variables: {
        slug,
      },
    }
  );
  return data;
}

export async function getLayoutData() {
  return await fetchAPI(
    `
      {
        allPages (filter: { parent: { exists: false } }) {
          title
          slug
          children {
            title
            slug
            children {
              title
              slug
            }
          }
        }
      }
    `
  );
}

export async function getAllProjects() {
  const data = await fetchAPI(
    `
      {
        allProjects {
          name
          url
          media {
            url(imgixParams: { crop: top, ar: "1:2", fit: crop, auto: format })
          }
          description
          parts {
            name
            url
            description
          }
        }
      }
    `
  );
  return data?.allProjects ?? null;
}

export async function getPage(slug: string, preview = false) {
  const data = await fetchAPI(
    `
      query PageBySlug($slug: String) {
        page(filter: { slug: { eq: $slug } }) {
          title
          slug
          content
        }
      }
    `,
    {
      preview,
      variables: {
        slug,
      },
    }
  );
  return data?.page ?? null;
}

export async function getAllPagesWithSlug() {
  const data = await fetchAPI(`
    {
      allPages(filter: {slug: {neq: ""}}) {
        title
        slug
        content
      }
    }
  `);
  return data?.allPages ?? null;
}
