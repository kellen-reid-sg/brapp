/**
 * Get user profile from localStorage
 * @returns {Object|null} User profile object or null if not found
 */
export const getUserProfile = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const profileData = localStorage.getItem('soccer_coach_user_profile');
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Save user profile to localStorage
 * @param {Object} profileData - User profile data
 * @returns {Object} The saved profile data
 */
export const saveUserProfile = (profileData) => {
  if (typeof window === 'undefined') return profileData;
  
  try {
    localStorage.setItem('soccer_coach_user_profile', JSON.stringify(profileData));
    return profileData;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};