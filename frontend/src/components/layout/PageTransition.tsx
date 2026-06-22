import { AnimatePresence, motion } from 'motion/react';
import { Outlet, useLocation } from 'react-router-dom';
import { pageVariants } from '@/lib/motion-presets';

export function PageTransition() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-[calc(100vh-200px)]"
      >
        <Outlet />
      </motion.main>
    </AnimatePresence>
  );
}
