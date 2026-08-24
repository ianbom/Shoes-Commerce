import { Head } from '@inertiajs/react';

type StructuredData = Record<string, unknown> | Array<Record<string, unknown>>;

type SeoHeadProps = {
    title: string;
    description: string;
    canonical: string;
    image?: string | null;
    type?: 'website' | 'product' | 'article';
    robots?: string;
    keywords?: string;
    structuredData?: StructuredData;
    siteName?: string;
    locale?: string;
    twitterHandle?: string | null;
};

export default function SeoHead({
    title,
    description,
    canonical,
    image,
    type = 'website',
    robots = 'index,follow',
    keywords,
    structuredData,
    siteName = 'GodKillerGoods',
    locale = 'id_ID',
    twitterHandle,
}: SeoHeadProps) {
    return (
        <Head>
            <title>{title}</title>
            <meta head-key="description" name="description" content={description} />
            <meta head-key="robots" name="robots" content={robots} />
            {keywords ? <meta name="keywords" content={keywords} /> : null}
            <link head-key="canonical" rel="canonical" href={canonical} />
            <meta head-key="og:title" property="og:title" content={title} />
            <meta head-key="og:description" property="og:description" content={description} />
            <meta head-key="og:url" property="og:url" content={canonical} />
            <meta head-key="og:type" property="og:type" content={type} />
            <meta head-key="og:site_name" property="og:site_name" content={siteName} />
            <meta head-key="og:locale" property="og:locale" content={locale} />
            {image ? <meta head-key="og:image" property="og:image" content={image} /> : null}
            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            <meta head-key="twitter:title" name="twitter:title" content={title} />
            <meta head-key="twitter:description" name="twitter:description" content={description} />
            {image ? <meta head-key="twitter:image" name="twitter:image" content={image} /> : null}
            {twitterHandle ? <meta name="twitter:site" content={twitterHandle} /> : null}
            {structuredData ? (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData).replace(/</g, '\\u003c')}
                </script>
            ) : null}
        </Head>
    );
}
