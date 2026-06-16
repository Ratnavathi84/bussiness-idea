import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp,
  orderBy,
  FieldValue
} from 'firebase/firestore';
import { auth, db, signInWithGoogle, logOut, handleFirestoreError, OperationType } from '../firebase';
import { Trip } from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  createdAt: any;
}

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  trips: Trip[];
  chatMessages: ChatMessage[];
  addTrip: (tripData: Omit<Trip, 'id'>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  login: () => Promise<User>;
  logout: () => Promise<void>;
  sendMessage: (content: string, responseContent: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Monitor Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (!currentUser) {
        setTrips([]);
        setChatMessages([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Synchronize dynamic Trips from Firestore
  useEffect(() => {
    if (!user) return;

    const tripsPath = 'trips';
    const tripsQuery = query(
      collection(db, tripsPath),
      where('ownerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      tripsQuery,
      (snapshot) => {
        const loadedTrips: Trip[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedTrips.push({
            id: docSnap.id,
            title: data.title,
            location: data.location,
            coordinates: data.coordinates || { lat: 0, lng: 0 },
            startDate: data.startDate,
            endDate: data.endDate,
            coverImage: data.coverImage,
            isPublic: data.isPublic ?? false
          });
        });
        
        // Sort trips locally by created time or date (since compound query might require indexing)
        setTrips(loadedTrips);
      },
      (error) => {
        // Enforce the special FirestoreErrorInfo schema standard
        handleFirestoreError(error, OperationType.LIST, tripsPath);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Synchronize AI Assistant messages from private chats subcollection
  useEffect(() => {
    if (!user) return;

    const chatsPath = `users/${user.uid}/chats`;
    const chatsQuery = query(
      collection(db, chatsPath),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      (snapshot) => {
        const loadedMessages: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedMessages.push({
            id: docSnap.id,
            role: data.role,
            content: data.content,
            createdAt: data.createdAt
          });
        });
        setChatMessages(loadedMessages);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, chatsPath);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Authenticate user
  const handleLogin = async () => {
    return await signInWithGoogle();
  };

  // Terminate session
  const handleLogout = async () => {
    await logOut();
  };

  // Add a new trip journal volume
  const addTrip = async (tripData: Omit<Trip, 'id'>) => {
    if (!user) throw new Error("Must be authenticated to record a journey.");

    const tripsPath = 'trips';
    const newTripRef = doc(collection(db, tripsPath));
    const tripId = newTripRef.id;

    const payload = {
      id: tripId,
      title: tripData.title,
      location: tripData.location,
      coordinates: tripData.coordinates,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      coverImage: tripData.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop',
      isPublic: tripData.isPublic ?? false,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(newTripRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${tripsPath}/${tripId}`);
    }
  };

  // Erase a journal volume
  const deleteTrip = async (id: string) => {
    if (!user) throw new Error("Must be authenticated to delete a journey.");

    const tripPath = `trips/${id}`;
    try {
      await deleteDoc(doc(db, 'trips', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, tripPath);
    }
  };

  // Record a conversation round (user message + AI companion message) in Firestore atomic subcollections
  const sendMessage = async (content: string, responseContent: string) => {
    if (!user) return;

    const chatsPath = `users/${user.uid}/chats`;
    
    // Save User message
    const userMsgRef = doc(collection(db, chatsPath));
    const userPayload = {
      id: userMsgRef.id,
      ownerId: user.uid,
      role: 'user',
      content: content,
      createdAt: serverTimestamp()
    };

    // Save AI response message
    const aiMsgRef = doc(collection(db, chatsPath));
    const aiPayload = {
      id: aiMsgRef.id,
      ownerId: user.uid,
      role: 'ai',
      content: responseContent,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(userMsgRef, userPayload);
      await setDoc(aiMsgRef, aiPayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, chatsPath);
    }
  };

  return (
    <FirebaseContext.Provider value={{
      user,
      loading,
      trips,
      chatMessages,
      addTrip,
      deleteTrip,
      login: handleLogin,
      logout: handleLogout,
      sendMessage
    }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
