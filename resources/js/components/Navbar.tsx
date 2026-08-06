import { Link, router } from '@inertiajs/react';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { list, login, myProfile } from '@/routes';

type NavbarProps = {
    cartCount?: number;
    collections?: unknown[];
    currentUrl?: string;
    isAuthenticated?: boolean;
    logoSrc?: string;
};

const navItems = [
    { label: 'New Arrivals', href: '/list?type=new_arrival' },
    { label: 'Best Sellers', href: '/list?type=best_seller' },
    { label: 'Sneakers', href: '/list?search=sneakers' },
    { label: 'Streetwear', href: '/list?search=streetwear' },
    { label: 'Why Us', href: '/about' },
];

export default function Navbar({
    cartCount = 0,
    currentUrl = '/',
    isAuthenticated = false,
    logoSrc = '/logo-shay/gods-hitam.webp',
}: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const cartBadge = cartCount > 99 ? '99+' : String(cartCount);
    const ctaHref = isAuthenticated ? list() : login();
    const ctaLabel = isAuthenticated ? 'Shop Now' : 'Login';
    const isActive = (href: string) => currentUrl === href;
    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const search = searchQuery.trim();

        setIsOpen(false);
        router.get(list.url(), search ? { search } : {});
    };

    return (
        <header className="sticky top-0 z-50 border-b border-hairline bg-white">
            <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-8">
                <Link
                    href="/"
                    aria-label="NEXSTEP home"
                    className="shrink-0 hover:opacity-80"
                >
                    <img
                        src={logoSrc}
                        alt="GODKILLER GOODS"
                        className="h-auto w-[150px] object-contain"
                    />
                </Link>

                <nav className="hidden items-center gap-9 text-[14px] leading-none font-medium text-ink lg:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`py-6 hover:text-primary ${isActive(item.href) ? 'text-primary' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-1 text-ink sm:gap-2">
                    <form
                        onSubmit={submitSearch}
                        className="hidden h-10 w-52 items-center border border-hairline bg-white px-3 lg:flex"
                        role="search"
                    >
                        <Search className="mr-2 h-4 w-4 shrink-0" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                            placeholder="Search products"
                            aria-label="Search products"
                            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                    </form>
                    <Link
                        href="/wishlist"
                        aria-label="Open wishlist"
                        className="hidden h-10 w-10 items-center justify-center hover:text-primary sm:inline-flex"
                    >
                        <Heart className="h-5 w-5" />
                    </Link>
                    <Link
                        href="/my-cart"
                        aria-label="Open cart"
                        className="relative inline-flex h-10 w-10 items-center justify-center hover:text-primary"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        {cartCount > 0 ? (
                            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                                {cartBadge}
                            </span>
                        ) : null}
                    </Link>
                    {isAuthenticated ? (
                        <Link
                            href={myProfile()}
                            aria-label="Open profile"
                            className="ml-2 hidden h-11 w-11 items-center justify-center rounded bg-primary text-white hover:bg-primary-hover md:inline-flex"
                        >
                            <User className="h-5 w-5" />
                        </Link>
                    ) : (
                        <Link
                            href={ctaHref}
                            className="ml-2 hidden h-11 items-center rounded bg-primary px-5 text-[13px] font-extrabold text-white hover:bg-primary-hover md:inline-flex"
                        >
                            {ctaLabel}
                        </Link>
                    )}
                    <button
                        type="button"
                        aria-label="Open menu"
                        onClick={() => setIsOpen(true)}
                        className="inline-flex h-10 w-10 items-center justify-center hover:text-primary lg:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <button
                type="button"
                aria-label="Close menu overlay"
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 z-[70] bg-black/45 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            />
            <aside
                className={`fixed top-0 right-0 bottom-0 z-[80] w-[min(86vw,360px)] border-l border-hairline bg-white p-5 transition-transform lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="mb-6 flex items-center justify-between border-b border-hairline pb-5">
                    <img
                        src={logoSrc}
                        alt="GODKILLER GOODS"
                        className="h-auto w-[150px] object-contain"
                    />
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex h-10 w-10 items-center justify-center border border-hairline hover:border-ink hover:text-primary"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form
                    onSubmit={submitSearch}
                    className="mb-5 flex h-11 items-center border border-hairline px-3"
                    role="search"
                >
                    <Search className="mr-2 h-4 w-4 shrink-0" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search products"
                        aria-label="Search products"
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <button
                        type="submit"
                        className="ml-2 text-xs font-extrabold uppercase hover:text-primary"
                    >
                        Search
                    </button>
                </form>
                <nav className="grid divide-y divide-hairline text-[15px] font-bold text-ink">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="py-4 hover:text-primary"
                        >
                            {item.label}
                        </Link>
                    ))}
                    {isAuthenticated ? (
                        <Link
                            href={myProfile()}
                            onClick={() => setIsOpen(false)}
                            aria-label="Open profile"
                            className="mt-5 inline-flex h-11 items-center justify-center rounded bg-primary px-5 text-white hover:bg-primary-hover"
                        >
                            <User className="h-5 w-5" />
                        </Link>
                    ) : (
                        <Link
                            href={ctaHref}
                            onClick={() => setIsOpen(false)}
                            className="mt-5 inline-flex h-11 items-center justify-center rounded bg-primary px-5 text-[13px] font-extrabold text-white hover:bg-primary-hover"
                        >
                            {ctaLabel}
                        </Link>
                    )}
                </nav>
            </aside>
        </header>
    );
}
