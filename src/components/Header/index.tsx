import { signIn, signOut, useSession } from "next-auth/react";
import { debugLog } from "../../utils/misc";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="">
      <div className="max-w-7xl mx-auto flex gap-2 py-2 px-4">
        <div className="bg-primary h-16 w-16 rounded-full"></div>
        <div className="flex-1 flex items-center">
          {session && <h1>Hello {session.user?.name}!</h1>}
        </div>
        <div className="flex-center">
          {session ? (
            <button onClick={() => signOut()}>Sign out</button>
          ) : (
            <button onClick={() => signIn()}>Sign In</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
