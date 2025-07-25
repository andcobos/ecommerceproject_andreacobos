import { getLatestProducts } from '@/lib/actions/product.actions';
import ProductList from '@/components/shared/product/product-list';

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  return  (
    <>
      <ProductList data={latestProducts} 
      title='Newest Products'
      limit={4} />
    </> 
  );   
}
 
export default Homepage;