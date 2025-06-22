import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ShoppingBag } from 'lucide-react';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  
  const password = watch('password');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }, { merge: true });
      
      navigate('/');
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: data.name
      });
      
      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: data.email,
        displayName: data.name,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      
      navigate('/');
    } catch (err: any) {
      const errorCode = err.code;
      switch (errorCode) {
        case 'auth/email-already-in-use':
          setError('This email is already in use. Please try another email or sign in.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please choose a stronger password.');
          break;
        default:
          setError('An error occurred during registration. Please try again.');
          console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <div className="text-center mb-8">
            <ShoppingBag className="h-12 w-12 text-primary-500 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
            <p className="text-gray-600 mt-2">Join Fresh Market for fresh groceries</p>
          </div>
          
          {error && (
            <motion.div 
              className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}
          
          <Button 
            onClick={handleGoogleSignIn}
            fullWidth
            variant="outline"
            className="mb-6"
            isLoading={isLoading}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </Button>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="name"
              label="Full Name"
              placeholder="Enter your full name"
              {...register('name', { 
                required: 'Full name is required' 
              })}
              error={errors.name?.message}
            />
            
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message}
            />
            
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.password?.message}
            />
            
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message}
            />
            
            <Button 
              type="submit" 
              fullWidth 
              isLoading={isLoading}
            >
              Sign Up
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;