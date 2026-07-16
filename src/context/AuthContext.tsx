import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { auth, isMockConfig } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getUserProfileFromFirestore, saveUserProfileToFirestore } from '../lib/firestoreService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  register: (name: string, email: string, pass: string, phone: string, whatsApp: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  isAdmin: boolean;
  unlockAdminWithPin: (pin: string) => boolean;
  lockAdmin: () => void;
  isAdminPinUnlocked: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default simulation profiles
const SIMULATED_USERS: UserProfile[] = [
  {
    uid: 'admin-rashed-700',
    email: 'rashedislamvk11@gmail.com',
    displayName: 'Rashed Islam (Admin)',
    phone: '01700000700',
    whatsApp: '01700000700',
    role: 'admin',
    createdAt: '2026-07-15T00:00:00Z'
  },
  {
    uid: 'admin-uid-123',
    email: 'admin@hatbazar.com',
    displayName: 'আলমগীর কবীর (অ্যাডমিন)',
    phone: '01711112233',
    whatsApp: '01711112233',
    role: 'admin',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    uid: 'user-uid-456',
    email: 'user@hatbazar.com',
    displayName: 'সাকিব হাসান (গ্রাহক)',
    phone: '01712345678',
    whatsApp: '01712345678',
    role: 'user',
    createdAt: '2026-03-15T12:30:00Z'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdminPinUnlocked, setIsAdminPinUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('hb-admin-pin-unlocked') === 'true';
  });

  const unlockAdminWithPin = (pin: string): boolean => {
    if (pin === '112200') {
      setIsAdminPinUnlocked(true);
      localStorage.setItem('hb-admin-pin-unlocked', 'true');
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    setIsAdminPinUnlocked(false);
    localStorage.removeItem('hb-admin-pin-unlocked');
  };

  useEffect(() => {
    if (!isMockConfig && auth) {
      // Real Firebase Authentication setup
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const profile = await getUserProfileFromFirestore(firebaseUser.uid);
            if (profile) {
              setUser(profile);
            } else {
              // Create default profile if not found
              const email = firebaseUser.email || '';
              const role = email === 'rashedislamvk11@gmail.com' ? 'admin' : 'user';
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: email,
                displayName: firebaseUser.displayName || email.split('@')[0],
                role: role,
                createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
              };
              await saveUserProfileToFirestore(newProfile);
              setUser(newProfile);
            }
          } catch (error) {
            console.error("Error retrieving user profile:", error);
            const email = firebaseUser.email || '';
            const role = email === 'rashedislamvk11@gmail.com' ? 'admin' : 'user';
            setUser({
              uid: firebaseUser.uid,
              email: email,
              displayName: firebaseUser.displayName || email.split('@')[0],
              role: role,
              createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Offline/Sandbox LocalStorage simulation setup
      const savedUser = localStorage.getItem('hb-current-user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        // Log in the client-side customer by default so they can interact right away
        const defaultUser = SIMULATED_USERS[2]; // সাকিব হাসান (গ্রাহক)
        setUser(defaultUser);
        localStorage.setItem('hb-current-user', JSON.stringify(defaultUser));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      if (!isMockConfig && auth) {
        let userCred;
        try {
          userCred = await signInWithEmailAndPassword(auth, email, pass);
        } catch (err: any) {
          // If user doesn't exist, and is our special default administrator, auto-create it!
          if (email === 'rashedislamvk11@gmail.com' && pass === 'Rashed@700') {
            try {
              userCred = await createUserWithEmailAndPassword(auth, email, pass);
              await updateProfile(userCred.user, { displayName: 'Rashed Islam (Admin)' });
            } catch (createErr) {
              console.error("Error creating default admin on login failure:", createErr);
              throw err; // throw original sign-in error if creation fails too
            }
          } else {
            throw err;
          }
        }
        const fbUser = userCred.user;
        let profile = await getUserProfileFromFirestore(fbUser.uid);
        if (!profile) {
          const role = email === 'rashedislamvk11@gmail.com' ? 'admin' : 'user';
          profile = {
            uid: fbUser.uid,
            email: fbUser.email || email,
            displayName: fbUser.displayName || email.split('@')[0],
            role: role,
            createdAt: fbUser.metadata.creationTime || new Date().toISOString()
          };
          await saveUserProfileToFirestore(profile);
        }
        setUser(profile);
        return profile;
      } else {
        // Sandbox Authentication Flow
        // Check pre-loaded user profiles
        let matched = SIMULATED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!matched) {
          // If not in standard pre-loaded, check if it was registered locally
          const customUsersRaw = localStorage.getItem('hb-simulated-registered-users');
          if (customUsersRaw) {
            const customUsersList: UserProfile[] = JSON.parse(customUsersRaw);
            matched = customUsersList.find(u => u.email.toLowerCase() === email.toLowerCase());
          }
        }

        if (!matched) {
          // Auto-create dynamically for seamless experience!
          const role = email.includes('admin') ? 'admin' : 'user';
          matched = {
            uid: 'sim-uid-' + Math.random().toString(36).substr(2, 9),
            email: email,
            displayName: email.split('@')[0],
            phone: '01700000000',
            whatsApp: '01700000000',
            role: role,
            createdAt: new Date().toISOString()
          };
          // Save to registered list
          const customUsersRaw = localStorage.getItem('hb-simulated-registered-users');
          const customList = customUsersRaw ? JSON.parse(customUsersRaw) : [];
          customList.push(matched);
          localStorage.setItem('hb-simulated-registered-users', JSON.stringify(customList));
        }

        setUser(matched);
        localStorage.setItem('hb-current-user', JSON.stringify(matched));
        return matched;
      }
    } catch (err) {
      console.error("Authentication Error: ", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    pass: string, 
    phone: string, 
    whatsApp: string
  ): Promise<UserProfile> => {
    setLoading(true);
    try {
      if (!isMockConfig && auth) {
        const userCred = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCred.user, { displayName: name });
        const fbUser = userCred.user;
        const role = email === 'rashedislamvk11@gmail.com' ? 'admin' : 'user';
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || email,
          displayName: name,
          phone: phone,
          whatsApp: whatsApp,
          role: role,
          createdAt: fbUser.metadata.creationTime || new Date().toISOString()
        };
        await saveUserProfileToFirestore(profile);
        setUser(profile);
        return profile;
      } else {
        // Sandbox Register Flow
        const role = email.includes('admin') ? 'admin' : 'user';
        const newProfile: UserProfile = {
          uid: 'sim-uid-' + Math.random().toString(36).substr(2, 9),
          email: email,
          displayName: name,
          phone: phone,
          whatsApp: whatsApp,
          role: role,
          createdAt: new Date().toISOString()
        };

        // Save to dynamic local users list
        const customUsersRaw = localStorage.getItem('hb-simulated-registered-users');
        const customList = customUsersRaw ? JSON.parse(customUsersRaw) : [];
        customList.push(newProfile);
        localStorage.setItem('hb-simulated-registered-users', JSON.stringify(customList));

        setUser(newProfile);
        localStorage.setItem('hb-current-user', JSON.stringify(newProfile));
        return newProfile;
      }
    } catch (err) {
      console.error("Registration Error: ", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (!isMockConfig && auth) {
        await fbSignOut(auth);
      }
      setUser(null);
      localStorage.removeItem('hb-current-user');
      lockAdmin(); // Lock admin on logout for safety
    } catch (err) {
      console.error("Sign Out Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setLoading(true);
    try {
      if (!isMockConfig && auth) {
        await sendPasswordResetEmail(auth, email);
      } else {
        console.log(`Password reset link dispatched in sandbox mode to: ${email}`);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>): Promise<void> => {
    if (!user) return;
    const updatedProfile: UserProfile = {
      ...user,
      ...data,
    };
    
    setLoading(true);
    try {
      await saveUserProfileToFirestore(updatedProfile);
      setUser(updatedProfile);
    } catch (err) {
      console.error("Profile Update Error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = (user?.role === 'admin' && user?.email?.toLowerCase() === 'rashedislamvk11@gmail.com') || isAdminPinUnlocked;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      resetPassword, 
      updateProfileData, 
      isAdmin,
      unlockAdminWithPin,
      lockAdmin,
      isAdminPinUnlocked
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
export { SIMULATED_USERS };
