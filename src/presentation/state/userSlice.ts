import { createSlice } from "@reduxjs/toolkit";
import { UserProfile } from "@/src/domain/entities/User";
import { RootState } from "./index";

interface UserState {
  profile: UserProfile;
}

const initialState: UserState = {
  profile: {
    id: "user-1",
    name: "Eslam",
    email: "eslam@example.com",
    savedAddresses: [
      {
        id: "addr-1",
        label: "Home",
        governorate: "Cairo",
        city: "Maadi",
        street: "12 El-Nasr Street",
        building: "Nile View Tower",
        floor: "5",
        apartment: "502",
      },
      {
        id: "addr-2",
        label: "Work",
        governorate: "Giza",
        city: "Sheikh Zayed",
        street: "Smart Village",
        building: "B4 Financial District",
        floor: "2",
        apartment: "Office 204",
      },
    ],
    savedCards: [
      {
        id: "card-1",
        type: "visa",
        lastFour: "4242",
        expiry: "12/26",
        cardholder: "ESLAM M.",
      },
      {
        id: "card-2",
        type: "mastercard",
        lastFour: "5555",
        expiry: "08/25",
        cardholder: "ESLAM M.",
      },
    ],
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // We can add reducers for adding/removing saved items later if needed
  },
});

export const selectUserProfile = (state: RootState) => state.user.profile;

export default userSlice.reducer;
