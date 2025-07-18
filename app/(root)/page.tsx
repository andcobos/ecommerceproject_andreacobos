import { getLatestProducts } from '@/lib/actions/product.actions';
import ProductList from '@/components/shared/product/product-list';
import { Product } from '@/types';  // Asegúrate que el tipo Product tenga price:string y rating:string

const Homepage = async () => {
  const rawProducts = await getLatestProducts();

  const latestProducts: Product[] = rawProducts.map((product) => ({
    ...product,
    price: product.price.toString(),
    rating: product.rating.toString(),
  }));

  return (
    <>
      <ProductList
        data={latestProducts}
        title='Newest Products'
        limit={4}
      />
    </>
  );
}

export default Homepage;
