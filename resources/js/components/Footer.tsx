import { Link } from '@inertiajs/react';
import { ArrowRight, Facebook, Instagram, Youtube } from 'lucide-react';

const columns = [
    {
        title: 'Shop',
        links: [
            ['New Arrivals', '/list?type=new_arrival'],
            ['Best Sellers', '/list?type=best_seller'],
            ['Sneakers', '/list?search=sneakers'],
            ['Streetwear', '/list?search=streetwear'],
            ['Sale', '/list?type=discount'],
        ],
    },
    {
        title: 'Support',
        links: [
            ['Help Center', '/about'],
            ['Shipping & Returns', '/shipping-policy'],
            ['Size Guide', '/size-guide.webp'],
            ['Track Your Order', '/my-order'],
            ['FAQ', '/about'],
        ],
    },
    {
        title: 'Company',
        links: [
            ['Reviews', '/#reviews'],
            ['About Us', '/about'],
            ['Blog', '/about'],
            ['Careers', '/about'],
            ['Contact Us', '/about'],
        ],
    },
];

const payments = ['VISA', 'MC', 'AMEX', 'Pay', 'Klarna', 'afterpay'];

export default function Footer({
    logoSrc = '/logo-shay/gods-putih.webp',
}: {
    logoSrc?: string;
}) {
    return (
        <footer className="bg-[#111111] text-white">
            <section>
                <div className="mx-auto grid max-w-[1440px] gap-9 px-5 py-8 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr_1fr] lg:px-20">
                    <section>
                        <Link href="/" aria-label="GODKILLER GOODS home">
                            <img
                                src={logoSrc}
                                alt="GODKILLER GOODS"
                                className="h-auto w-[220px] max-w-full object-contain"
                            />
                        </Link>
                        <p className="mt-4 max-w-[270px] text-[13px] leading-5 font-medium text-white/68">
                            Premium sneakers, limited drops, and streetwear for
                            the culture.
                        </p>
                        <div className="mt-5 flex gap-3">
                            {[Instagram, Facebook, Youtube].map(
                                (Icon, index) => (
                                    <Link
                                        key={index}
                                        href="/"
                                        aria-label={`Social link ${index + 1}`}
                                        className="inline-flex h-8 w-8 items-center justify-center text-white/76 hover:text-primary"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Link>
                                ),
                            )}
                        </div>
                    </section>

                    {columns.map((column) => (
                        <section key={column.title}>
                            <h3 className="text-[13px] font-extrabold text-white">
                                {column.title}
                            </h3>
                            <ul className="mt-4 grid gap-2">
                                {column.links.map(([label, href]) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="text-[13px] font-medium text-white/68 hover:text-primary"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}

                    <section>
                        <h3 className="text-[13px] font-extrabold text-white">
                            We Accept
                        </h3>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {payments.map((payment) => (
                                <span
                                    key={payment}
                                    className="rounded-[3px] bg-white px-2 py-1 text-[11px] font-black text-ink"
                                >
                                    {payment}
                                </span>
                            ))}
                        </div>
                        <Link
                            href="/list"
                            className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-white hover:text-primary"
                        >
                            Start Shopping <ArrowRight className="h-4 w-4" />
                        </Link>
                    </section>
                </div>
            </section>

            <section className="border-t border-white/10">
                <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-4 text-[12px] font-medium text-white/58 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-20">
                    <p>2026 Nexstep. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link
                            href="/terms-conditions"
                            className="hover:text-primary"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/privacy-policy"
                            className="hover:text-primary"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </section>
        </footer>
    );
}
