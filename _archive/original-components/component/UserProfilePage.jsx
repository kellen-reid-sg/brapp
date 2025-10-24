"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getUserProfile, saveUserProfile } from '../utils/userStorage';

const UserProfilePage = () => {
  // Profile state
  const [displayName, setDisplayName] = useState('Coach');
  const [email, setEmail] = useState('coach@example.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [teams, setTeams] = useState([]);
  
  // Load user profile on component mount
  useEffect(() => {
    const userProfile = getUserProfile();
    if (userProfile) {
      setDisplayName(userProfile.displayName);
      setEmail(userProfile.email);
      setProfileImage(userProfile.profileImage);
      setTeams(userProfile.teams);
    }
  }, []);
  const [newTeam, setNewTeam] = useState('');
  
  // Refs
  const fileInputRef = useRef(null);
  
  // Form validation
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle adding a new team
  const handleAddTeam = () => {
    if (newTeam.trim()) {
      setTeams([...teams, { id: Date.now().toString(), name: newTeam.trim() }]);
      setNewTeam('');
    }
  };
  
  // Handle removing a team
  const handleRemoveTeam = (id) => {
    setTeams(teams.filter(team => team.id !== id));
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (password) {
      if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSaving(true);
      
      // Save profile data to localStorage
      try {
        const updatedProfile = saveUserProfile({
          displayName,
          email,
          profileImage,
          teams
        });
        
        console.log('Profile saved:', updatedProfile);
        
        // Trigger a storage event so other components (like Navbar) know to update
        window.dispatchEvent(new Event('storage'));
        
        setIsSaving(false);
        setSaveSuccess(true);
        setPassword('');
        setConfirmPassword('');
        
        // Reset success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        console.error('Error saving profile:', error);
        setIsSaving(false);
        alert('There was an error saving your profile. Please try again.');
      }
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center mb-6">
        <Link href="/" className="text-green-600 mr-4 hover:text-green-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-green-700">My Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">Profile Information</h2>
          
          <div className="md:flex items-start mb-6">
            <div className="md:w-1/3 flex flex-col items-center mb-4 md:mb-0">
              <div className="relative">
                <div 
                  className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-2 border-green-500 flex items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center justify-center p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-center mt-1">Click to upload</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 shadow-md hover:bg-green-600 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">Click to change profile photo</p>
            </div>
            
            <div className="md:w-2/3">
              <div className="mb-4">
                <label htmlFor="displayName" className="block mb-2 font-medium">Display Name</label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.displayName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.displayName && <p className="mt-1 text-sm text-red-500">{errors.displayName}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">Account Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div className="md:flex md:space-x-4">
              <div className="md:w-1/2 mb-4 md:mb-0">
                <label htmlFor="password" className="block mb-2 font-medium">New Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
              
              <div className="md:w-1/2">
                <label htmlFor="confirmPassword" className="block mb-2 font-medium">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Teams Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">Teams Coached</h2>
          
          <div className="space-y-4">
            {/* Team List */}
            <div className="space-y-2">
              {teams.map(team => (
                <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <span>{team.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeam(team.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              
              {teams.length === 0 && (
                <div className="p-4 text-center text-gray-500 bg-gray-50 rounded">
                  No teams added yet
                </div>
              )}
            </div>
            
            {/* Add Team Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTeam}
                onChange={(e) => setNewTeam(e.target.value)}
                placeholder="Add a new team..."
                className="flex-grow p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddTeam}
                disabled={!newTeam.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end">
          {saveSuccess && (
            <div className="mr-4 flex items-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Profile updated successfully!
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfilePage;