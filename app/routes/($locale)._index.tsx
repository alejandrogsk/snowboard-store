import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  CollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import heroImage from '../../public/images/home-image.webp'
export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <HeroSection />
      <RecommendedProducts products={data.recommendedProducts} />
      <FeaturedCollection collection={data.featuredCollection} />
    </div>
  );
}
function HeroSection(){
  return(
    <div className='h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden'>
        <div className='flex flex-col justify-center'>
        <h1 className='font-oswald text-6xl md:text-7xl lg:text-9xl uppercase '>Winter is here</h1>
          <div>
            <span className='font-air'>Find the best snowboards</span>
            <p className='font-lato w-[60%] font-regular'>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
            <Link to={`/collections/featured-collection`} className='text-xl font-semibold flex  flex-col w-[6.25rem] hover:no-underline	group mr-auto'>
              View More
              <span className='w-[20px] h-[2px] bg-black group-hover:w-full transition-all'></span>
            </Link>
          </div>
          
        </div>
        <div className='flex items-center justify-center hidden lg:block'><img src={heroImage} sizes="100vw"/></div>
      </div>
  )
}

function FeaturedCollection({
  collection,
}: {
  collection: CollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection text-white overflow-x-hidden  hover:underline"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw"/>
        </div>
      )}
      <h2 className='font-oswald text-6xl uppercase translate-y-[-100px] translate-x-[50px]'>{collection.title}</h2>
    </Link>
  );
}

function RecommendedProducts({
  products
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products py-10 lg:py-20">
      <h2 >Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => {
          return (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 lg:gap-6">
              {products.nodes.map((product) => {
                return(
                  <Link
                    key={product.id}
                    className="recommended-product lg:hover:scale-[1.05] duration-200 ease-in-out 
                    flex flex-col items-center"
                    to={`/products/${product.handle}`}
                  >
                    <Image
                      data={product.images.nodes[0]}
                      aspectRatio="1/1"
                      sizes="(min-width: 45em) 20vw, 50vw"
                    />
                    
                    <h4  className='text-center'>{product.title}</h4>
                    <small className='font-bold'>
                      <Money data={product.priceRange.minVariantPrice}  />
                    </small>
                    <button className='bg-orange-500 hover:bg-black rounded p-2 font-air text-sm mt-auto lg:mt-2 text-white duration-200 ease-in-out '>{product.variants.edges.length > 1 ? 'Chose an option' : 'View'}</button>
                  </Link>
                )
              }
          )}
            </div>
          )}}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}
const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    variants(first: 3) {
      edges {
        node {
          id
        }
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
