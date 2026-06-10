import React from 'react';
import { useApp } from '../context/AppContext';
import SettingsPanel from '../components/SettingsPanel';

export default function DashboardSettingsPage() {
  const { currentUser, handleUpdateProfile, handleDeleteAccount, registeredUsers } = useApp();

  if (!currentUser) return null;

  return (
    <SettingsPanel
      currentUser={currentUser}
      onUpdateProfile={handleUpdateProfile}
      onDeleteAccount={handleDeleteAccount}
      registeredUsers={registeredUsers}
    />
  );
}
