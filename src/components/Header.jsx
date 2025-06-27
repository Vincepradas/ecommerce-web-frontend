  import React, { useState, useEffect } from "react";
  import { Link, useNavigate } from "react-router-dom";

  const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const navigate = useNavigate();

    const checkIfLoggedIn = () => localStorage.getItem("authToken") !== null;
    const [isLoggedIn, setIsLoggedIn] = useState(checkIfLoggedIn);

    useEffect(() => {
      const checkLoggedIn = () => localStorage.getItem("authToken") !== null;
      setIsLoggedIn(checkLoggedIn());
    }, [localStorage.getItem("authToken")]);

    const handleLoginClick = () => {
      if (isLoggedIn) {
        navigate("/profile");
      } else {
        navigate("/login");
      }
    };

    const handleLogout = () => {
      localStorage.removeItem("authToken");
      setIsLoggedIn(false);
      navigate("/");
    };

    const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery) {
        navigate(`/search?query=${searchQuery}`);
        setSearchQuery("");
        setIsSearchVisible(false);
      }
    };

    // Scroll event listener
    useEffect(() => {
      let lastScrollY = window.scrollY;

      const handleScroll = () => {
        if (window.scrollY > lastScrollY) {
          // Scrolling down
          setIsHeaderVisible(false);
        } else {
          // Scrolling up
          setIsHeaderVisible(true);
        }
        lastScrollY = window.scrollY;
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return (
      <header
        className={`bg-white font-poppins sticky top-0 z-50 transition-transform duration-300 ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold">
            <Link
              to="/"
              className="text-[#FF6F00] font-fuzzy hover:text-black transition duration-300"
            >
              Sandra's
            </Link>
          </div>

          <ul className="hidden md:flex space-x-6 font-normal items-center font-poppins">
            <li className="flex items-center">
              <Link
                to="/cart"
                className="text-black hover:text-[#FF6F00] transition duration-300"
              >
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/fluency-systems-regular/50/shopping-bag--v1.png"
                  alt="shopping-bag--v1"
                />
              </Link>
            </li>
            <li className="flex items-center">
              <button
                onClick={handleLoginClick}
                className="text-black hover:text-[#FF6F00] transition duration-300"
              >
                <img
                  width="25"
                  height="25"
                  src="https://img.icons8.com/windows/32/gender-neutral-user.png"
                  alt="gender-neutral-user"
                />
              </button>
            </li>
            <li className="flex items-center">
              <button
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className="text-black hover:text-[#FF6F00] transition duration-300"
              >
                <img
                  width="25"
                  height="25"
                  src="https://img.icons8.com/fluency-systems-regular/50/search--v1.png"
                  alt="search--v v1"
                />
              </button>
              {isSearchVisible && (
                <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-full md:w-64 z-10">
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    />
                    <button
                      type="submit"
                      className="bg-[#FF6F00] text-white rounded-md p-2 hover:bg-[#451F55] transition duration-300"
                    >
                      Go
                    </button>
                  </form>
                  <button
                    onClick={() => setIsSearchVisible(false)}
                    className="mt-2 text-red-500 hover:text-red-700"
                  >
                    Close
                  </button>
                </div>
              )}
            </li>
            {isLoggedIn && (
              <li className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="text-black hover:text-[#FF6F00] transition duration-300"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>

          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="text-black hover:text-[#FF6F00] transition duration-300"
            >
              <img
                width="22"
                height="22"
                src="https://img.icons8.com/fluency-systems-regular/50/search--v1.png"
                alt="search--v1"
              />
            </button>
            <Link
              to="/cart"
              className="text-black hover:text-[#FF6F00] transition duration-300"
            >
              <img
                width="22"
                height="22"
                src="https://img.icons8.com/fluency-systems-regular/50/shopping-bag--v1.png"
                alt="shopping-bag--v1"
              />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black hover:text-black focus:outline-none"
              aria-label="Toggle menu"
            >
              <img
                width="22"
                height="22"
                src="https://img.icons8.com/fluency-systems-regular/50/menu--v1.png"
                alt="menu--v1"
              />
            </button>
          </div>
        </nav>

        {isSearchVisible && (
          <div className="absolute top-12 right-0 bg-white border border-gray-300 shadow-lg p-4 w-full z-10">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <button
                type="submit"
                className="ml-2 bg-[#FF6F00] text-white rounded-md p-2 hover:bg-[#451F55] transition duration-300"
              >
                Go
              </button>
            </form>
          </div>
        )}

        <div
          className={`fixed inset-0 z-[1000] flex transition-opacity duration-300 h-screen ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-20"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Sidebar */}
          <div
            className={`relative w-64 bg-white h-screen shadow-lg p-6 space-y-6 z-[1000] transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              ✕
            </button>

            <nav className="mt-12 font-normal space-y-4">
              <h1 className="font-medium text-lg font-poppins">Menu</h1>
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block text-black hover:text-[#FF6F00] transition duration-300"
              >
                Home
              </Link>
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block text-black hover:text-[#FF6F00] transition duration-300 "
              >
                Products
              </Link>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="block text-black hover:text-[#FF6F00] transition duration-300"
                  >
                    Account
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="block text-black hover:text-[#FF6F00] transition duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="border-t-[1px]">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLoginClick();
                  }}
                  className="block text-white transition duration-300 w-full bg-[#FF6F00] rounded-md p-2 mt-8"
                >
                  Login
                </button>
                </div>
              )}

            </nav>
          </div>
        </div>

      </header>
    );
  };

  export default Header;
