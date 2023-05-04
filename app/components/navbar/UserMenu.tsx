"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback, useState } from "react";
import { signOut } from "next-auth/react";

import MenuItem from "./MenuItem";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRentModal from "@/app/hooks/useRentModal";
import { SafeUser } from "@/app/types";
import useUserMenu from "@/app/hooks/useUserMenu";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const userMenu = useUserMenu();

  const toggleOpen = useCallback(() => {
    if (userMenu.isOpen) {
      userMenu.onClose();
    } else if (!userMenu.isOpen) {
      userMenu.onOpen();
    }
    setIsOpen(userMenu.isOpen);
  }, [userMenu]);

  document.body.onclick = (e) => {
    if (
      // @ts-ignore
      e?.target?.className ==
      "px-4 py-3 hover:bg-neutral-100 transition font-semibold custom-cursor-on-hover"
    ) {
      return;
    } else {
      if (!isMouseOver && isOpen) {
        closeMenu();
      }
    }
  };

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    rentModal.onOpen();
  }, [currentUser, loginModal, rentModal]);

  const closeMenu = useCallback(() => {
    userMenu.onClose();
    setIsOpen(false);
  }, [userMenu]);

  const openLoginModal = () => {
    loginModal.onOpen();
    closeMenu();
  };
  const openRegisterModal = () => {
    registerModal.onOpen();
    closeMenu();
  };

  const openRentModal = () => {
    rentModal.onOpen();
    closeMenu();
  };

  const openMenuItem = (link: string) => {
    router.push(`/${link}`);
    closeMenu();
  };

  const signOutUser = () => {
    toast.loading("Logging Out...");
    signOut();
  };

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          Airbnb your home
        </div>
        <div
          onMouseEnter={() => setIsMouseOver(true)}
          onMouseLeave={() => setIsMouseOver(false)}
          onClick={toggleOpen}
          className="
            p-4
            md:py-1
            md:px-2
            border-[1px]
            border-neutral-200
            flex
            flex-row
            items-center
            gap-3
            rounded-full
            cursor-pointer
            hover:shadow-md
            transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm ">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => openMenuItem("trips")}
                  label="My Trips"
                />
                <MenuItem
                  onClick={() => openMenuItem("favorites")}
                  label="My Favorites"
                />
                <MenuItem
                  onClick={() => openMenuItem("reservations")}
                  label="My Reservations"
                />
                <MenuItem
                  onClick={() => openMenuItem("properties")}
                  label="My Properties"
                />
                <MenuItem onClick={openRentModal} label="Airbnb my Home" />
                <hr />
                <MenuItem onClick={() => signOutUser()} label="Log Out" />
              </>
            ) : (
              <>
                <MenuItem onClick={openLoginModal} label="Login" />
                <MenuItem onClick={openRegisterModal} label="Sign Up" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
