import { create } from "zustand";

interface UserMenuStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useUserMenu = create<UserMenuStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useUserMenu;
