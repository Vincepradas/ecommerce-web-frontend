import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import config from "../config";

const ProductContext = createContext();

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState({});
  const [allProducts, setAllProducts] = useState(null);
  const [loading, setLoading] = useState({});
  const [allProductsLoading, setAllProductsLoading] = useState(false);
  const [cache, setCache] = useState(new Map());
  const fetchingRef = useRef(new Set());

  const CACHE_DURATION = 5 * 60 * 1000;

  const isCacheValid = useCallback(
    (cacheEntry) => {
      return cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_DURATION;
    },
    [CACHE_DURATION]
  );

  const fetchAllProducts = useCallback(async () => {
    const cacheKey = "all_products";
    const cachedData = cache.get(cacheKey);

    if (isCacheValid(cachedData)) {
      setAllProducts(cachedData.data);
      return cachedData.data;
    }

    if (allProductsLoading) {
      return null;
    }

    try {
      setAllProductsLoading(true);
      const response = await fetch(`${config.REACT_APP_API_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      setCache(
        (prev) =>
          new Map(
            prev.set(cacheKey, {
              data,
              timestamp: Date.now(),
            })
          )
      );

      setAllProducts(data);
      return data;
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    } finally {
      setAllProductsLoading(false);
    }
  }, [allProductsLoading, cache, isCacheValid]);

  const fetchProductById = useCallback(
    async (id) => {
      const cacheKey = `product_${id}`;
      const cachedData = cache.get(cacheKey);

      if (isCacheValid(cachedData)) {
        setProducts((prev) => ({ ...prev, [id]: cachedData.data }));
        return cachedData.data;
      }

      if (fetchingRef.current.has(id)) {
        while (fetchingRef.current.has(id)) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        const finalCachedData = cache.get(cacheKey);
        if (isCacheValid(finalCachedData)) {
          setProducts((prev) => ({ ...prev, [id]: finalCachedData.data }));
          return finalCachedData.data;
        }
        return null;
      }

      fetchingRef.current.add(id);

      try {
        setLoading((prev) => ({ ...prev, [id]: true }));

        const response = await fetch(
          `${config.REACT_APP_API_URL}/products?id=${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        setCache(
          (prev) =>
            new Map(
              prev.set(cacheKey, {
                data,
                timestamp: Date.now(),
              })
            )
        );

        setProducts((prev) => ({ ...prev, [id]: data }));
        return data;
      } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
      } finally {
        fetchingRef.current.delete(id);
        setLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [cache, isCacheValid]
  );

  const getProduct = (id) => {
    return products[id] || null;
  };

  const isProductLoading = (id) => {
    return loading[id] || false;
  };

  const clearCache = () => {
    setCache(new Map());
  };

  const value = {
    products,
    allProducts,
    allProductsLoading,
    fetchAllProducts,
    fetchProductById,
    getProduct,
    isProductLoading,
    clearCache,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductContext;
