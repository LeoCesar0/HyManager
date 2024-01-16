"use client";
import Link from "next/link";
import { APP_PAGES } from "@/static/appPages";
import { useGlobalAuth } from "../../../contexts/GlobalAuth";
import { cx } from "../../../utils/misc";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import AppLogo from "@/components/AppLogo";

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
    <header className="container px-4">
      <div className="border-b flex items-center gap-2 py-2  ">
        <div>
          <AppLogo />
        </div>
        <div className="flex-1 items-center px-4 flex">
          <div className="hidden md:flex">
            {currentUser && <p>Hello {currentUser.name}!</p>}
          </div>
        </div>
        <nav className="gap-4 items-center justify-between px-4 hidden md:flex">
          {APP_PAGES.map((item) => {
            let isSelected = pathname.includes(item.link);
            if (item.link === "/") isSelected = pathname === "/";

            if (item.private && !currentUser) return null;

            return (
              <Link key={item.label} href={item.link}>
                <span
                  className={cx([
                    "transition-colors text-muted-foreground",
                    ["text-primary-foreground border-b shadow-md", isSelected],
                    "hover:text-primary",
                  ])}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="flex-center">
          <Button
            onClick={() => {
              if (currentUser) {
                handleSignOut();
              } else {
                handleSignIn();
              }
            }}
            disabled={loadingUser}
          >
            {currentUser ? "Sign Out" : "Sign In"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
