import Link from "next/link";

const Home = () => {
  return (
    <>
      <div className="container">
        <h1>HOME PAGE</h1>
        <Link href={"/test"}>Test page</Link>
      </div>
    </>
  );
};

export default Home;
