'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_PAGES } from "src/static/appPages";
import { useGlobalAuth } from "../../../contexts/GlobalAuth";
import { cx } from "../../../utils/misc";
import Button from "../../../components/Button";

const Header = () => {
  const {
    currentUser,
    handleSignOut,
    handleSignIn,
    loading: loadingUser,
  } = useGlobalAuth();
  const pathname = usePathname();

  return (
    <header className="">
      <div className="max-w-7xl mx-auto flex gap-2 py-2 px-4">
        <div className="bg-primary h-16 w-16 rounded-full"></div>
        <div className="flex-1 flex items-center px-4">
          {currentUser && <h1>Hello {currentUser.name}!</h1>}
        </div>
        <nav className="flex gap-4 items-center justify-between px-4">
          {APP_PAGES.map((item) => {
            let isSelected = pathname.includes(item.link);
            if (item.link === "/") isSelected = pathname === "/";
            return (
              <Link key={item.label} href={item.link}>
                <span
                  className={cx([
                    "transition-colors",
                    ["text-primary", isSelected],
                    "hover:text-primary-hover",
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
