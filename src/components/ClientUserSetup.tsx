"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ClientUserSetup = () => {
  const { user, isLoaded } = useUser();
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
    description: "",
    city: "",
    school: "",
    work: "",
    website: "",
  });
  const router = useRouter();

  // Check if user exists in database
  useEffect(() => {
    const checkUserExists = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        setUserExists(data.exists);
        
        if (!data.exists) {
          setShowForm(true);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };

    if (isLoaded && user) {
      checkUserExists();
    }
  }, [user, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setUserExists(true);
        setShowForm(false);
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create user profile');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="animate-pulse bg-gray-100 h-20 rounded-lg"></div>;
  }

  if (!user) {
    return null;
  }

  if (userExists && !showForm) {
    return null; // User exists and setup is complete
  }

  if (!showForm) {
    return (
      <div className="animate-pulse bg-gray-100 h-20 rounded-lg"></div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={user.imageUrl || "/noAvatar.png"}
          alt=""
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">Complete Your Profile</h2>
          <p className="text-gray-600">Set up your social media profile to get started</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Choose a unique username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School
            </label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your school"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work
            </label>
            <input
              type="text"
              value={formData.work}
              onChange={(e) => setFormData({ ...formData, work: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your work"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Tell us about yourself"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://your-website.com"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
          >
            {loading ? "Creating Profile..." : "Complete Setup"}
          </button>
          
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
          >
            Skip for Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientUserSetup;
