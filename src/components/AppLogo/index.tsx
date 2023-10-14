import Link from "next/link";

const AppLogo = () => {
  return (
    <Link href="/" className="p-2" >
      <p className="font-bold text-lg tracking-tight" >Hy.<span className="text-primary" >Manager</span></p>
    </Link>
  );
};

export default AppLogo;
