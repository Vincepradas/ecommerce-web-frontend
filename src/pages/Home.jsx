import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductCard from "../components/ProductCard";
import { useProductContext } from "../context/ProductContext";

const CategoryFilterDropdown = ({ categories, filter, setFilter, setCurrentPage, sortOrder, setSortOrder }) => {
  const [showFilters, setShowFilters] = useState(false);
  console.log(process.env.REACT_APP_API_URL);
  return (
    <div className="mt-4 font-[400] rounded-md p-2 max-w-sm mx-auto text-left border-b">
      <div className="flex justify-between items-center bg-white py-2 rounded-md">
        <h1 className="font-medium font-poppins text-md text-[#FF6F00]">BROWSE OUR COLLECTIONS!</h1>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 bg-[#FF6F00] text-white text-sm p-2 rounded-full"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-funnel-x-icon lucide-funnel-x"><path d="M12.531 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l.427-.473" /><path d="m16.5 3.5 5 5" /><path d="m21.5 3.5-5 5" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-funnel-plus-icon lucide-funnel-plus"><path d="M13.354 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l1.218-1.348" /><path d="M16 6h6" /><path d="M19 3v6" /></svg>
            )}
          </button>
          <button
            className="flex items-center gap-1 bg-[#FF6F00] text-white text-sm p-2 rounded-full"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 16l4 4 4-4M7 20V4" /></svg>
                <span className="hidden sm:inline">Price: Low to High</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 8l-4-4-4 4M17 4v16" /></svg>
                <span className="hidden sm:inline">Price: High to Low</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="pb-4 rounded-md">
          <p className="text-sm text-gray-500 mb-2">Categories</p>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-1.5 rounded-md text-xs font-semibold border transition duration-200 ${!filter ? "bg-[#FF6F00] text-white border-[#FF6F00]" : "bg-white text-[#FF6F00] border-[#FF6F00] hover:bg-[#FF6F00]/10"}`}
              onClick={() => setFilter(null)}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold border transition duration-200 ${filter === category ? "bg-[#FF6F00] text-white border-[#FF6F00]" : "bg-white text-[#FF6F00] border-[#FF6F00] hover:bg-[#FF6F00]/10"}`}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const { allProducts, allProductsLoading, fetchAllProducts } = useProductContext();
  const [filter, setFilter] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!allProducts) {
      fetchAllProducts().catch((error) => {
        console.error('Error fetching all products:', error);
      });
    }
  }, []); 

  const products = allProducts;
  const loading = allProductsLoading;

  const categories = [...new Set(products?.map((product) => product.category))];

  let filteredProducts = products?.filter((product) =>
    filter ? product.category === filter : true
  );

  if (sortOrder === 'asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts?.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="home bg-white">
      <div className="container mx-auto mt-1 px-4 md:px-8">
        <h2 className="font-serif font-semibold text-5xl md:text-4xl text-[#1F2232] text-center my-4">
          EXPLORE <span className="text-[#FF6F00]"> SANDRA'S</span>
        </h2>


        <CategoryFilterDropdown
          categories={categories}
          filter={filter}
          setFilter={setFilter}
          setCurrentPage={setCurrentPage}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <div>
          <div className="flex justify-between items-center px-8 my-4">
            <div className="flex items-center gap-2">
              <span className="text-black/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg></span>
              <span className="text-xs sm:text-sm text-black/50 font-poppins">Gcash Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-black/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote-icon lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg></span>
              <span className="text-xs sm:text-sm text-black/50 font-poppins">Cash on delivery</span>
            </div>
          </div>

        </div>
        <div className="flex items-center justify-center px-2 pb-4 mb-4 border-b">
          <h1 className="text-xs text-black/50 font-poppins text-center">Click on any product to view more details. Free delivery for orders within Madrid!</h1>
        </div>


        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array(4).fill().map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-lg border border-neutral-300">
                <Skeleton height={150} />
                <Skeleton height={20} className="mt-4" />
                <Skeleton height={15} width="80%" />
              </div>
            ))
            : currentProducts?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>

        {!loading && currentProducts?.length === 0 && (
          <p className="text-center text-gray-500 mt-8 text-lg">
            No products found in this category.
          </p>
        )}

        <div className="flex justify-center gap-4 mt-8">
          {filteredProducts?.length > itemsPerPage && (
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, index) => index + 1).map((number) => (
                <button
                  key={number}
                  className={`px-4 py-2 rounded-md ${number === currentPage ? "bg-[#FF6F00] text-white" : "bg-gray-300 text-black"}`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;