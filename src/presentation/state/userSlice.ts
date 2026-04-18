import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously,
  signOut,
  User 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from "firebase/firestore";
import { UserProfile } from "@/src/domain/entities/User";
import { RootState } from "./index";
import { auth, db } from "../../data/services/firebaseConfig";

interface UserState {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// ── Thunks ────────────────────────────────────────────────────────

export const signUpAction = createAsyncThunk(
  "user/signUp",
  async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const profile: UserProfile = {
        id: user.uid,
        name,
        email,
        savedAddresses: [],
        savedCards: [],
      };

      // Create profile in Firestore
      await setDoc(doc(db, "users", user.uid), profile);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInAction = createAsyncThunk(
  "user/signIn",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Profile will be synced via the onAuthStateChanged listener in _layout.tsx
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOutAction = createAsyncThunk(
  "user/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInAnonymouslyAction = createAsyncThunk(
  "user/signInAnonymously",
  async (_, { rejectWithValue }) => {
    try {
      await signInAnonymously(auth);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (uid: string, { rejectWithValue }) => {
    try {
      const docSnap = await getDoc(doc(db, "users", uid));
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ── Slice ──────────────────────────────────────────────────────────

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.profile = null;
      }
    },
    setProfile(state, action: PayloadAction<UserProfile | null>) {
      state.profile = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUpAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpAction.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(signUpAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sign In
      .addCase(signInAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sign Out
      .addCase(signOutAction.fulfilled, (state) => {
        state.profile = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // Sign In Anonymously
      .addCase(signInAnonymouslyAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInAnonymouslyAction.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(signInAnonymouslyAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isAuthenticated = !!action.payload;
        state.loading = false;
      });
  },
});

export const { 
  setLoading, 
  setAuthenticated, 
  setProfile, 
  setError, 
  clearError 
} = userSlice.actions;

export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectAuthStatus = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
  loading: state.user.loading,
  error: state.user.error,
  profile: state.user.profile
});

export default userSlice.reducer;
