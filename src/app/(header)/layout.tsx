import Navbar from "@/components/Navbar";
import Providers from "../Providers";

export default function HeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Providers>
        {/*  <Navbar /> */}
        {children}
      </Providers>
    </div>
  );
}
