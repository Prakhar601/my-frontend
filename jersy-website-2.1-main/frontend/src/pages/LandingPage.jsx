import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import ProductGrid from '../components/ProductGrid';

export default function LandingPage() {
  const api = useApi();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        console.log('Fetching products...');
        const data = await api.get('/products');
        console.log('Products received:', data);
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : (data?.items ?? []));
          setLoading(false);
        }
      } catch (e) {
        console.error('Error loading products:', e);
        if (isMounted) {
          setError(e?.message || 'Failed to load products');
          setLoading(false);
        }
      }
    })();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCustomize(productId) {
    navigate(`/customize/${productId}`);
  }

  if (loading) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading products...</div>;
  if (error) return <div className="container"><div className="error">{error}</div></div>;

  return (
    <div className="container">
      <h1 className="page-title">Explore Jerseys</h1>
      <ProductGrid products={products} onCustomize={handleCustomize} />
    </div>
  );
}


