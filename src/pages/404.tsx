import Link from "next/link";

export default function FourOhFour() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div>
        <h1>404 - Page Not Found</h1>
        <Link href="/">Go back home</Link>
      </div>
    </div>
  );
}
