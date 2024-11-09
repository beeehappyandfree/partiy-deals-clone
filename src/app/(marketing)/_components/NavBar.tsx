import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function NavBar() {
    return (
        <div className="flex py-6 shadow-xl top-0 w-full z-10 bg-background/95">
            <nav className="flex items-center gap-10 container font-semibold">
                <Link href="/" className="mr-auto">
                    <BrandLogo />
                </Link>
                <Link href="#" className="text-lg">
                    Features
                </Link>
                <Link href="/#pricing" className="text-lg">
                    Pricing
                </Link>
                <Link href="#" className="text-lg">
                    About
                </Link>
            </nav>
        </div>
    )
}