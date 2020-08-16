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

async function fetchAPI(
  query: string,
  opts?: { variables?: Record<string, any>; preview?: boolean }
): Promise<Record<string, any>> {
  const variables = opts?.variables ?? {};
  const preview = opts?.preview ?? false;

  const key = JSON.stringify([query, variables, preview]);
  let output = cache.get(key);

  if (!output) {
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
  return data?.post;
}

export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    {
      allPosts {
        slug
      }
    }
  `);
  return data?.allPosts;
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
  return data?.allPosts;
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
        ogImage: coverImage{
          url(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 })
        }
        coverImage {
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
        menu {
          items {
            name
            href
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
          platform
          url
          media {
            url(imgixParams: { crop: top, ar: "1:2", fit: crop, auto: format })
          }
        }
      }
    `
  );
  return data?.allProjects;
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
  return data;
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
  console.log(data);
  return data?.allPages;
}
