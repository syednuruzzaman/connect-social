"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminUserActionsProps {
  userId: string;
  username: string;
}

const AdminUserActions = ({ userId, username }: AdminUserActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Prevent actions on admin user
  if (userId === "user_30nQKqyDO8oYwyqyrAAf23AE1CR") {
    return (
      <div className="text-xs text-gray-500">
        Admin Account
      </div>
    );
  }

  const handleDeleteUser = async () => {
    if (!confirm(`Are you sure you want to delete user @${username}? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('User deleted successfully');
        router.refresh();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspendUser = async () => {
    if (!confirm(`Are you sure you want to suspend user @${username}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('User suspended successfully');
        router.refresh();
      } else {
        alert('Failed to suspend user');
      }
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('Error suspending user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => window.open(`/profile/${username}`, '_blank')}
        className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        View Profile
      </button>
      <button
        onClick={handleSuspendUser}
        disabled={isLoading}
        className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Suspend'}
      </button>
      <button
        onClick={handleDeleteUser}
        disabled={isLoading}
        className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Delete'}
      </button>
    </div>
  );
};

export default AdminUserActions;
