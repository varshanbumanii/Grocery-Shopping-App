import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { useUser } from '../contexts/UserContext';
import { useForm } from 'react-hook-form';
import { User, Address } from '../types';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AddressForm from '../components/checkout/AddressForm';
import { motion } from 'framer-motion';

interface ProfileFormData {
  displayName: string;
  email: string;
  phone?: string;
}

function Profile() {
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'address'>('profile');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProfileFormData>();

  useEffect(() => {
    if (user) {
      setValue('displayName', user.displayName);
      setValue('email', user.email);
      setValue('phone', user.phone || '');
    }
  }, [user, setValue]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          if (userData.address) {
            setAddress(userData.address);
          }
          
          if (userData.phone && !user.phone) {
            setUser({
              ...user,
              phone: userData.phone
            });
            setValue('phone', userData.phone);
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    
    fetchUserData();
  }, [user, setUser, setValue]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!user || !auth.currentUser) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      // Update display name in Auth
      await updateProfile(auth.currentUser, {
        displayName: data.displayName
      });
      
      // Update user data in Firestore
      await setDoc(
        doc(db, 'users', user.uid), 
        { 
          displayName: data.displayName,
          phone: data.phone || null
        }, 
        { merge: true }
      );
      
      // Update local state
      setUser({
        ...user,
        displayName: data.displayName,
        phone: data.phone
      });
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ text: 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (data: Address) => {
    if (!user) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      await setDoc(
        doc(db, 'users', user.uid), 
        { address: data }, 
        { merge: true }
      );
      
      setAddress(data);
      setMessage({ text: 'Address updated successfully!', type: 'success' });
    } catch (err) {
      console.error('Error updating address:', err);
      setMessage({ text: 'Failed to update address. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">My Profile</h1>
      
      {message && (
        <motion.div 
          className={`mb-6 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {message.text}
        </motion.div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'profile'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Personal Information
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'address'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('address')}
          >
            Address
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSubmit(onProfileSubmit)}>
              <Input
                id="displayName"
                label="Full Name"
                placeholder="Enter your full name"
                {...register('displayName', { required: 'Full name is required' })}
                error={errors.displayName?.message}
              />
              
              <Input
                id="email"
                type="email"
                label="Email"
                disabled
                {...register('email')}
              />
              
              <Input
                id="phone"
                label="Phone Number"
                placeholder="Enter your phone number"
                {...register('phone')}
                error={errors.phone?.message}
              />
              
              <div className="mt-6">
                <Button 
                  type="submit" 
                  isLoading={loading}
                >
                  Update Profile
                </Button>
              </div>
            </form>
          ) : (
            <AddressForm 
              defaultAddress={address || undefined} 
              onSubmit={handleAddressSubmit}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;