import Link from "next/link";
import { useRouter } from "next/router";
import { useGlobalAuth } from "../../contexts/GlobalAuth";
import { firebaseAuth } from "../../services/firebase";
import { cx } from "../../utils/misc";
import Button from "../Button/Button";

const links = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Dashboard",
    link: "/dashboard",
  },
];

const Header = () => {
  // const { data: session } = useSession();
  const {
    currentUser,
    handleSignOut,
    handleSignIn,
    loading: loadingUser,
  } = useGlobalAuth();
  const router = useRouter();


  return (
    <header className="">
      <div className="max-w-7xl mx-auto flex gap-2 py-2 px-4">
        <div className="bg-primary h-16 w-16 rounded-full"></div>
        <div className="flex-1 flex items-center">
          {currentUser && <h1>Hello {currentUser.name}!</h1>}
        </div>
        <nav className="flex gap-4 items-center justify-between px-4">
          {links.map((item) => {
            const isSelected = router.pathname == item.link;
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
          >
            {currentUser ? "Sign Out" : "Sign In"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
