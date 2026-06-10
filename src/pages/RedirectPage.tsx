import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import RedirectScreen from '../components/RedirectScreen';

/**
 * RedirectPage — shows the animated countdown and then "redirects" the user.
 * The `redirectingLink` state lives in AppContext.
 * After cancellation, we go back to home via React Router.
 */
export default function RedirectPage() {
  const { redirectingLink } = useApp();
  const navigate = useNavigate();

  if (!redirectingLink) {
    // Guard: if someone navigates here directly without a link, send them home
    navigate('/', { replace: true });
    return null;
  }

  return (
    <motion.div
      key="redirecting-screen"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <RedirectScreen
        link={redirectingLink}
        onCancel={() => navigate('/')}
      />
    </motion.div>
  );
}
