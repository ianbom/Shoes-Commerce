import { Link } from '@inertiajs/react';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';

type NavbarProps = {
    cartCount?: number;
    collections?: unknown[];
    currentUrl?: string;
    isAuthenticated?: boolean;
};

const navItems = [
    { label: 'New Arrivals', href: '/list?type=new_arrival' },
    { label: 'Best Sellers', href: '/list?type=best_seller' },
    { label: 'Sneakers', href: '/list?search=sneakers' },
    { label: 'Streetwear', href: '/list?search=streetwear' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'About', href: '/about' },
];

function Wordmark() {
    return <span className="text-[28px] leading-none font-black tracking-[-0.05em] text-ink uppercase">NEXSTEP</span>;
}

export default function Navbar({ cartCount = 0, currentUrl = '/' }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const cartBadge = cartCount > 99 ? '99+' : String(cartCount);
    const isActive = (href: string) => currentUrl === href;

    return (
        <header className="sticky top-0 z-50 border-b border-hairline bg-white">
            <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-8">
                <Link href="/" aria-label="NEXSTEP home" className="shrink-0 hover:opacity-80">
                    <Wordmark />
                </Link>

                <nav className="hidden items-center gap-9 text-[14px] leading-none font-medium text-ink lg:flex">
                    {navItems.map((item) => (
                        <Link key={item.label} href={item.href} className={`py-6 hover:text-primary ${isActive(item.href) ? 'text-primary' : ''}`}>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-1 text-ink sm:gap-2">
                    <button type="button" aria-label="Search" className="hidden h-10 w-10 items-center justify-center hover:text-primary sm:inline-flex">
                        <Search className="h-5 w-5" />
                    </button>
                    <Link href="/wishlist" aria-label="Open wishlist" className="hidden h-10 w-10 items-center justify-center hover:text-primary sm:inline-flex">
                        <Heart className="h-5 w-5" />
                    </Link>
                    <Link href="/my-cart" aria-label="Open cart" className="relative inline-flex h-10 w-10 items-center justify-center hover:text-primary">
                        <ShoppingBag className="h-5 w-5" />
                        {cartCount > 0 ? <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">{cartBadge}</span> : null}
                    </Link>
                    <Link href="/list" className="ml-2 hidden h-11 items-center rounded bg-primary px-5 text-[13px] font-extrabold text-white hover:bg-[#E64800] md:inline-flex">
                        Shop Now
                    </Link>
                    <button type="button" aria-label="Open menu" onClick={() => setIsOpen(true)} className="inline-flex h-10 w-10 items-center justify-center hover:text-primary lg:hidden">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <button type="button" aria-label="Close menu overlay" onClick={() => setIsOpen(false)} className={`fixed inset-0 z-[70] bg-black/45 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
            <aside className={`fixed top-0 right-0 bottom-0 z-[80] w-[min(86vw,360px)] border-l border-hairline bg-white p-5 transition-transform lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="mb-6 flex items-center justify-between border-b border-hairline pb-5">
                    <Wordmark />
                    <button type="button" aria-label="Close menu" onClick={() => setIsOpen(false)} className="inline-flex h-10 w-10 items-center justify-center border border-hairline hover:border-ink hover:text-primary">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="grid divide-y divide-hairline text-[15px] font-bold text-ink">
                    {navItems.map((item) => (
                        <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)} className="py-4 hover:text-primary">
                            {item.label}
                        </Link>
                    ))}
                    <Link href="/list" onClick={() => setIsOpen(false)} className="mt-5 inline-flex h-11 items-center justify-center rounded bg-primary px-5 text-[13px] font-extrabold text-white hover:bg-[#E64800]">
                        Shop Now
                    </Link>
                </nav>
            </aside>
        </header>
    );
}
