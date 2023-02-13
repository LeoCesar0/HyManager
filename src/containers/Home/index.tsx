import { signIn, useSession } from "next-auth/react";
import Header from "../../components/Header";
import { debugLog } from "../../utils/misc";

const Home = () => {
  const { data: session } = useSession();

  return (
    <>
      <div className="container max-w-7xl">
      </div>
    </>
  );
};

export default Home;
