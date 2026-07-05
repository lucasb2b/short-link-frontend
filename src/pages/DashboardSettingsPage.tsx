import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SettingsPanel from '../components/SettingsPanel';

export default function DashboardSettingsPage() {
  const { currentUser, handleUpdateProfile, handleDeleteAccount } = useAuth();

  if (!currentUser) return null;

  return (
    <SettingsPanel
      currentUser={currentUser}
      onUpdateProfile={handleUpdateProfile}
      onDeleteAccount={handleDeleteAccount}
    />
  );
}
