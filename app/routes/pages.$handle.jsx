import {defer} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.page.title ?? ''}`}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context, params}) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();
  let pageContent;
  console.log(page);
  if (page.title.toLowerCase() == 'info') {
    pageContent = <InfoPage {...{page}} />;
  } else {
    pageContent = <main dangerouslySetInnerHTML={{__html: page.body}} />;
  }
  return (
    <div className="page p-4 *:list-disc">
      <header></header>
      {pageContent}
    </div>
  );
}
function InfoPage({page}) {
  const [first, ...panels] = page.body.split(/<h1>.*<\/h1>/);
  const panelTitles = [...page.body.matchAll(/<h1>(.*)<\/h1>/g)];
  return (
    <div>
      {panels.map((panel, i) => {
        return (
          <details
            className="transition-all group mb-8"
            key={'info-panel-' + i}
          >
            <summary className="text-2xl list-none hover:cursor-pointer group-open:after:rotate-45 group-open:after:scale-125 after:transition-transform  after:inline-block after:ml-2  after:content-[_'+']   marker:hidden [&::-webkit-details-marker]:hidden">
              {panelTitles[i][1]}
            </summary>
            <div dangerouslySetInnerHTML={{__html: panel}} />
          </details>
        );
      })}
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
