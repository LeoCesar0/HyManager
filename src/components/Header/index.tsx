import { useGlobalAuth } from "../../contexts/GlobalAuth";
import { firebaseAuth } from "../../services/firebase";

const Header = () => {
  // const { data: session } = useSession();
  const { currentUser, handleSignOut, handleSignIn } = useGlobalAuth();

  console.log("header currentUser -->", currentUser);
  console.log("header firebaseAuth.currentUser -->", firebaseAuth.currentUser);

  return (
    <header className="">
      <div className="max-w-7xl mx-auto flex gap-2 py-2 px-4">
        <div className="bg-primary h-16 w-16 rounded-full"></div>
        <div className="flex-1 flex items-center">
          {currentUser && <h1>Hello {currentUser.name}!</h1>}
        </div>
        <div className="flex-center">
          <button
            onClick={() => {
              handleSignOut();
            }}
          >
            FORCED Sign out
          </button>
          {currentUser ? (
            <button
              onClick={() => {
                handleSignOut();
              }}
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => {
                handleSignIn();
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
