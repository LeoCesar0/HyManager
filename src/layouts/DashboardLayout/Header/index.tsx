"use client";
import Link from "next/link";
import { APP_PAGES } from "src/static/appPages";
import { useGlobalAuth } from "../../../contexts/GlobalAuth";
import { cx } from "../../../utils/misc";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import AppLogo from "@/components/AppLogo";
import { HiUser } from "react-icons/hi";

const Header = () => {
  const {
    currentUser,
    handleSignOut,
    handleSignIn,
    loading: loadingUser,
  } = useGlobalAuth();
  const router = useRouter();

  const pathname = router.pathname;

  return (
    <header className="border-b">
      <div className="flex gap-2 py-4">
        {/* <div>
          <AppLogo />
        </div> */}
        <div className="flex-1 flex items-center px-4"></div>
        
        <div className="flex-center gap-4">
          <span>Hey {currentUser?.name}</span>
          <Button variant="outline" size="icon" className="rounded-full" >
            <HiUser className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
