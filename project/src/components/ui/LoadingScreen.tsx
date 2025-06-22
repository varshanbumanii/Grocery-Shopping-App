import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

function LoadingScreen() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <ShoppingBag className="h-16 w-16 text-primary-500" />
      </motion.div>
      <motion.p 
        className="mt-4 text-xl font-medium text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Loading Fresh Market...
      </motion.p>
    </div>
  );
}

export default LoadingScreen;