import { useEffect, useState } from 'react';

const MobileOnlyLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check screen width on mount and resize
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Tailwind's 'md' breakpoint
    };

    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize); // Listen for resize

    return () => window.removeEventListener('resize', checkScreenSize); // Cleanup
  }, [isMobile]);

  return (
    <div>
      {/* Mobile Content */}
      {isMobile && children}

      {/* Desktop Block Screen */}
      {!isMobile && (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Mobile Only Website</h1>
            <p className="text-gray-600 mb-6">
              This website is designed specifically for mobile devices. 
              Please open it on your smartphone or tablet.
            </p>
            <div className="text-5xl">📱</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileOnlyLayout;