import Link from "next/link";
import { ReactNode } from "react";

export default function Sidebar({ children }: { children: ReactNode }) {
//   const router = useRouter();

  return (
    <div className="flex">
      <div>
        <ul>
          <li>
            <Link href="#intro">Introduction</Link>
          </li>
          <li>
            <Link href="#tier">Select Tier</Link>
          </li>
          <li>
            <Link href="#location">Select Location</Link>
          </li>
          <li>
            <Link href="#housing">Select Housing</Link>
          </li>
          <li>
            <Link href="#summary">Summary</Link>
          </li>
        </ul>
      </div>
      {children}
    </div>
  );
}
