import { usePage } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';

interface ShopLayoutProps {
    children: ReactNode;
}

const navbarLogo = '/logo-shay/gods-hitam.webp';
const footerLogo = '/logo-shay/gods-putih.webp';

type SharedShopProps = {
    auth: {
        user: unknown | null;
    };
    shop?: {
        cart_count?: number;
        whatsapp_number?: string | null;
    };
};

export default function ShopLayout({ children }: ShopLayoutProps) {
    const { url, props } = usePage<SharedShopProps>();
    const cartCount = props.shop?.cart_count ?? 0;
    const isAuthenticated = Boolean(props.auth.user);
    const whatsappNumber =
        props.shop?.whatsapp_number?.replace(/\D/g, '') ?? '';

    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-sans text-ink selection:bg-primary selection:text-white">
            <Navbar
                cartCount={cartCount}
                currentUrl={url}
                isAuthenticated={isAuthenticated}
                logoSrc={navbarLogo}
            />
            <main className="w-full flex-grow bg-white">{children}</main>
            <Toaster />
            {whatsappNumber ? (
                <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Contact us on WhatsApp"
                    className="fixed right-5 bottom-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                >
                    <MessageCircle className="h-7 w-7" />
                </a>
            ) : null}
            <Footer logoSrc={footerLogo} />
        </div>
    );
}
