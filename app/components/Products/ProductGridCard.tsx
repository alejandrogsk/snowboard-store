import { Link } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
import { ProductItemFragment } from 'storefrontapi.generated';
import { useVariantUrl } from '~/utils';

const ProductGridCard = ({
    product,
    loading,
  }: {
    product: ProductItemFragment;
    loading?: 'eager' | 'lazy';
  }) => {
    const variant = product.variants.nodes[0];
    const variantUrl = variant?  useVariantUrl(product.handle, variant.selectedOptions) : `/products/${product.handle}`;
    return (
      <Link
        className="product-item lg:hover:scale-[1.05] duration-200 ease-in-out
        flex flex-col items-center
        "
        key={product.id}
        prefetch="intent"
        to={variantUrl}
      >
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="1/1"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        )}
        
                    
                    <h4 className='text-center'>{product.title}</h4>
                    <small className='font-bold'>
                      <Money data={product.priceRange.minVariantPrice}  />
                    </small>
                    <button className='bg-orange-500 hover:bg-black rounded p-2 font-air text-sm mt-2 text-white duration-200 ease-in-out '>{variant.selectedOptions.length > 1 ? 'Chose an option' : 'View'}</button>
                  
      </Link>
    );
}

export default ProductGridCard