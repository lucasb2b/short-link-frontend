import React from 'react';
import { Coffee, Train } from 'lucide-react';
import { motion } from 'motion/react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ message = 'Carregando o trem, sô...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-primary',
    md: 'w-12 h-12 text-primary',
    lg: 'w-20 h-20 text-primary',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative">
        {/* Ambient pulse background */}
        <motion.div
          className="absolute inset-0 rounded-full bg-surface-container"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
        
        <motion.div
          className="relative z-10 flex items-center justify-center p-4 bg-surface-container-high rounded-full border border-outline-variant"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
        >
          {size === 'lg' ? (
            <Train className={sizeClasses[size]} />
          ) : (
            <Coffee className={sizeClasses[size]} />
          )}
        </motion.div>
      </div>

      <motion.p
        className="text-subtle font-serif italic text-primary"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        {message}
      </motion.p>
    </div>
  );
}
