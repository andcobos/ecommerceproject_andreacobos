import { getLatestProducts } from '@/lib/actions/product.actions';
import ProductList from '@/components/shared/product/product-list';

const Homepage = async () => {
  try {
    const latestProducts = await getLatestProducts();
    return  (
      <>
        <ProductList data={latestProducts} 
        title='Newest Products'
        limit={4} />
      </> 
    );   
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Welcome to Prostore</h2>
        <p>Loading products...</p>
      </div>
    );
  }
}

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
 
export default Homepage;