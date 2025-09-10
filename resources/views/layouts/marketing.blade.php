<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="ltr" class="">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Primary SEO --}}
    <title>@yield('title', 'Auto Rice Mill ERP Software Bangladesh | Rice Mill ERP (BD)')</title>
    <meta name="description" content="@yield('meta_description', 'Auto Rice Mill ERP — purpose-built rice mill software for Bangladesh. Manage sales, purchases, inventory, crushing & production, payroll, and financial reports in one ERP. Try the 30-day free trial.')" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow" />
    <link rel="canonical" href="{{ url()->current() }}" />

    {{-- Hreflang (adjust if you add more locales) --}}
    <link rel="alternate" href="{{ url()->current() }}" hreflang="en-bd" />
    <link rel="alternate" href="{{ url()->current() }}" hreflang="x-default" />

    {{-- Favicons / App Icons --}}
    <link rel="icon" type="image/svg+xml" href="{{ asset('assets/logo/ricemillerp.svg') }}">
    <link rel="apple-touch-icon" href="{{ asset('assets/icons/apple-touch-icon.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('assets/icons/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('assets/icons/favicon-16x16.png') }}">
    <link rel="manifest" href="{{ asset('site.webmanifest') }}">

    {{-- Theming for address bar (supports dark/light) --}}
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff">
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0E0E0F">

    {{-- Social / Open Graph --}}
    <meta property="og:site_name" content="Auto Rice Mill ERP" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_BD" />
    <meta property="og:url" content="{{ url()->current() }}" />
    <meta property="og:title" content="@yield('title', 'Auto Rice Mill ERP Software Bangladesh | Rice Mill ERP (BD)')" />
    <meta property="og:description" content="@yield('meta_description', 'Auto Rice Mill ERP — purpose-built rice mill software for Bangladesh. Manage sales, purchases, inventory, crushing & production, payroll, and financial reports in one ERP. Try the 30-day free trial.')" />
    <meta property="og:image" content="{{ asset('assets/og/ricemill-erp-og.jpg') }}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    {{-- Twitter Card --}}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="@yield('title', 'Auto Rice Mill ERP Software Bangladesh | Rice Mill ERP (BD)')" />
    <meta name="twitter:description" content="@yield('meta_description', 'Auto Rice Mill ERP — purpose-built rice mill software for Bangladesh. Manage sales, purchases, inventory, crushing & production, payroll, and financial reports in one ERP. Try the 30-day free trial.')" />
    <meta name="twitter:image" content="{{ asset('assets/og/ricemill-erp-og.jpg') }}" />

    {{-- Performance: preconnect to CDNs you actually use --}}
    <link rel="preconnect" href="https://cdn.tailwindcss.com" crossorigin>
    <link rel="dns-prefetch" href="//cdn.tailwindcss.com">
    <link rel="preconnect" href="https://unpkg.com" crossorigin>
    <link rel="dns-prefetch" href="//unpkg.com">

    {{-- Early dark-mode to avoid flash --}}
    <script>
        (function() {
            const saved = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const useDark = saved ? saved === 'dark' : prefersDark;
            document.documentElement.classList.toggle('dark', useDark);
        })();
    </script>

    {{-- Tailwind (single include) --}}
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: "#e7f1ef",
                            100: "#cfe4e0",
                            200: "#9fc9c0",
                            300: "#6fad9f",
                            400: "#3f927f",
                            500: "#0F604D",
                            600: "#0c4d3d",
                            700: "#093a2e",
                            800: "#06261e",
                            900: "#03130f"
                        },
                        secondary: {
                            50: "#fef7ed",
                            100: "#fdeedc",
                            200: "#fbddba",
                            300: "#f8cc97",
                            400: "#f6bb75",
                            500: "#F5EEE9",
                            600: "#c4b8b4",
                            700: "#938a87",
                            800: "#625c5a",
                            900: "#312e2d"
                        },
                        success: "#12715B",
                        darkTextSecondary: "#dfe6e0",
                        bgPrimary: "#B71F25",
                    },
                },
            },
        }
    </script>

    {{-- JSON-LD: SoftwareApplication (don’t fabricate ratings) --}}
    <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Auto Rice Mill ERP",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "inLanguage": "en",
    "url": "{{ url('/') }}",
    "image": "{{ asset('assets/og/ricemill-erp-og.jpg') }}",
    "description": "Auto Rice Mill ERP — rice mill management software for Bangladesh: sales, purchases, inventory, crushing & production, payroll, and finance.",
    "keywords": "ERP software Bangladesh, rice mill ERP, ricemill ERP software, rice mill software BD",
    "provider": {
      "@type": "Organization",
      "name": "Auto Rice Mill ERP",
      "url": "{{ url('/') }}"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Bangladesh"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "BDT",
      "lowPrice": "2999",
      "highPrice": "9999",
      "offerCount": "3",
      "url": "{{ url('/pricing') }}"
    }
  }
  </script>

    {{-- Page-specific CSS (optional) --}}
    @stack('styles')
</head>


<body class="bg-white dark:bg-[#0E0E0F] text-gray-900">
    @yield('body')

    {{-- Icons --}}
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        lucide.createIcons();
    </script>

    {{-- Put your static JS files in /public/js and reference via asset() --}}
    @stack('scripts-before')
    <script>
        (function() {
            const btn = document.getElementById('themeToggle');
            if (!btn) return;

            const apply = (mode) => {
                localStorage.setItem('theme', mode);
                document.documentElement.classList.toggle('dark', mode === 'dark');
                // Re-run Lucide so the sun/moon swap is reflected:
                if (window.lucide?.createIcons) lucide.createIcons();
            };

            btn.addEventListener('click', () => {
                const isDark = document.documentElement.classList.contains('dark');
                apply(isDark ? 'light' : 'dark');
            });
        })();
    </script>

    <script src="{{ asset('js/animation.js') }}"></script>
    <script src="{{ asset('js/faq.js') }}"></script>

    {{-- Tiny helper for the mobile drawer + scroll-to-top if you don’t have them already --}}
    <script>
        (function() {
            const drawer = document.getElementById('mobileDrawer');
            const overlay = document.getElementById('drawerOverlay');
            const openBtn = document.getElementById('navToggle');
            const closeBtn = document.getElementById('navClose');
            const toggle = (on) => {
                if (!drawer || !overlay) return;
                drawer.style.transform = on ? 'translateX(0)' : 'translateX(100%)';
                overlay.style.opacity = on ? '1' : '0';
                overlay.style.pointerEvents = on ? 'auto' : 'none';
            };
            openBtn?.addEventListener('click', () => toggle(true));
            closeBtn?.addEventListener('click', () => toggle(false));
            overlay?.addEventListener('click', () => toggle(false));

            const btn = document.getElementById('scrollToTopBtn');
            const onScroll = () => {
                if (!btn) return;
                const show = window.scrollY > 300;
                btn.style.opacity = show ? '1' : '0';
                btn.style.pointerEvents = show ? 'auto' : 'none';
                btn.style.transform = show ? 'translateY(0)' : 'translateY(32px)';
            };
            window.addEventListener('scroll', onScroll, {
                passive: true
            });
            onScroll();
            btn?.addEventListener('click', () => window.scrollTo({
                top: 0,
                behavior: 'smooth'
            }));
        })();
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class', // ⬅️ add this line
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: "#e7f1ef",
                            100: "#cfe4e0",
                            200: "#9fc9c0",
                            300: "#6fad9f",
                            400: "#3f927f",
                            500: "#0F604D",
                            600: "#0c4d3d",
                            700: "#093a2e",
                            800: "#06261e",
                            900: "#03130f"
                        },
                        secondary: {
                            50: "#fef7ed",
                            100: "#fdeedc",
                            200: "#fbddba",
                            300: "#f8cc97",
                            400: "#f6bb75",
                            500: "#F5EEE9",
                            600: "#c4b8b4",
                            700: "#938a87",
                            800: "#625c5a",
                            900: "#312e2d"
                        },
                        success: "#12715B",
                        darkTextSecondary: "#dfe6e0",
                        bgPrimary: "#B71F25",
                    },
                },
            },
        }
    </script>

    @stack('scripts')
</body>

</html>
