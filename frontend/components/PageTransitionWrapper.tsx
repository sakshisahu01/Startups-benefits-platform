'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const pageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = { duration: 0.28, ease: 'easeOut' };

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showContent, setShowContent] = useState(false);

  // Only show content after a refresh (first mount)
  useEffect(() => {
    // When the component mounts (refresh), enable content
    setShowContent(true);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showContent ? (
        <motion.div
          key={pathname}
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={pageTransition}
        >
          {children}
        </motion.div>
      ) : (
        // Blank page placeholder
        <motion.div
          key="blank"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ width: '100%', height: '100vh', background: '#fff' }}
        />
      )}
    </AnimatePresence>
  );
}