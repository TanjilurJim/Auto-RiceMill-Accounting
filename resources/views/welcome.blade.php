@extends('layouts.marketing')

@section('title', 'Rice Mill ERP - Auto Rice Mill Software')
@section('meta_description', 'Custom Rice Mill ERP page with full HTML control - no JavaScript interference')

@push('styles')
    {{-- If you had ./style/index.css, move it to public/style/index.css or compile it; then reference: --}}
    <link rel="stylesheet" href="{{ asset('style/index.css') }}" />

    {{-- Custom Font Declarations --}}
    <style>
        @font-face {
            font-family: 'LiAdorNoirritEnglish';
            src: url('{{ asset('assets/fonts/LiAdorNoirritMultiweight/ANSI V2/Li Ador Noirrit A-V2 Regular.ttf') }}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        @font-face {
            font-family: 'LiAdorNoirritBangla';
            src: url('{{ asset('assets/fonts/LiAdorNoirritMultiweight/Unicode/Li Ador Noirrit Regular.ttf') }}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        .font-bangla {
            font-family: 'LiAdorNoirritBangla', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        }

        .bgWhite {
            background-color: white;
        }
    </style>
@endpush

@section('body')
    <div class="bgWhite">
        <div class="bg-[#F5EEE9] ">
            <header class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shadow-sm pt-2">
                <nav class="flex items-center justify-between h-16">
                    <!-- Logo -->
                    <a class="text-none" href="{{ url('/') }}">
                        <img alt="Rice Mill ERP" loading="lazy" width="70" height="20" decoding="async"
                            class="dark:d-none" src="{{ asset('assets/images/common/ricemilllogo.svg') }}" />
                    </a>

                    <!-- Nav links -->
                    <div class="hidden md:flex items-center md:gap-4 lg:gap-8 text-[15px]">
                        <a href="#main_features" class="font-semibold">
                            <span class="lang-en">Features</span>
                            <span class="lang-bn" style="display:none">বৈশিষ্ট্য</span>
                        </a>

                        {{-- <a href="#benefits" class="font-semibold">
                            <span class="lang-en">Benefits</span>
                            <span class="lang-bn" style="display:none">সুবিধা</span>
                        </a> --}}

                        <a href="#pricing" class="font-semibold">
                            <span class="lang-en">Pricing</span>
                            <span class="lang-bn" style="display:none">মূল্য নির্ধারণ</span>
                        </a>

                        <a href="#footer" class="font-semibold">
                            <span class="lang-en">Contact</span>
                            <span class="lang-bn" style="display:none">যোগাযোগ</span>
                        </a>
                        {{-- <a href="{{ route('privacy-policy') }}" class="font-semibold ">
                        <span class="lang-en">Privacy-Policy</span>
                        <span class="lang-bn" style="display:none">গোপনীয়তা নীতি</span>
                    </a> --}}
                    </div>

                    <!-- Action buttons -->
                    <div class="hidden md:flex items-center gap-3">
                        <a class="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-bgPrimary hover:bg-bgPrimary rounded-lg transition-colors duration-200 no-underline"
                            href="{{ route('login') }}">
                            <span class="lang-en">Start free trial</span>
                            <span class="lang-bn" style="display:none">ফ্রি ট্রায়াল শুরু করুন</span>
                        </a>
                        <button id="langToggleBtn"
                            class="ml-2 px-2 py-1 rounded border border-bgPrimary text-bgPrimary bgWhite hover:bg-bgPrimary hover:text-white transition-colors duration-200 text-xs font-semibold">
                            বাংলা
                        </button>
                    </div>

                    <!-- Mobile drawer toggle -->
                    <div class="md:hidden flex items-center gap-2">
                        <button id="langToggleBtn"
                            class="ml-2 px-2 py-1 rounded border border-bgPrimary text-bgPrimary bgWhite hover:bg-bgPrimary hover:text-white transition-colors duration-200 text-xs font-semibold">
                            বাংলা
                        </button>

                        <button id="navToggle"
                            class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-bgPrimary text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600"
                            aria-controls="mobileDrawer" aria-expanded="false" aria-label="Open menu">
                            <!-- hamburger -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </nav>
            </header>
        </div>

        <!-- Mobile Drawer Overlay -->
        <div id="drawerOverlay" class="fixed inset-0 opacity-0 pointer-events-none transition-opacity duration-300 z-[70]">
        </div>

        <!-- Mobile Drawer Panel -->
        <aside id="mobileDrawer"
            class="fixed top-0 right-0 h-full w-80 max-w-[85%] bgWhite  shadow-xl border-l border-gray-200 dark:border-gray-700 translate-x-full transition-transform duration-300 ease-out z-[75] flex flex-col"
            aria-hidden="true">
            <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <img alt="Rice Mill ERP" loading="lazy" width="90" height="24" class="dark:d-none"
                    src="{{ asset('assets/images/common/ricemilllogo.svg') }}" />
                <button id="navClose"
                    class="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Close menu">
                    <!-- X icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Drawer content -->
            <nav class="px-4 py-4 grow">
                <ul class="space-y-2 text-[15px]">
                    <li><a href="#main_features"
                            class="block px-3 py-2 rounded hover:bg-bgPrimary hover:text-white lang-en">Features</a>
                        <a href="#main_features" class="font-semibold  lang-bn" style="display:none">ফিচারসমূহ</a>
                    </li>
                    {{-- <li><a href="#benefits"
                            class="block px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800  lang-en">Benefits</a>
                        <a href="#benefits" class="font-semibold  lang-bn" style="display:none">সুবিধা</a>
                    </li> --}}
                    <li><a href="#pricing"
                            class="block px-3 py-2 rounded hover:bg-bgPrimary hover:text-white lang-en">Pricing</a>
                        <a href="#pricing" class="font-semibold  lang-bn" style="display:none">মূল্য
                            নির্ধারণ</a>
                    </li>
                    <li><a href="#footer"
                            class="block px-3 py-2 rounded hover:bg-bgPrimary hover:text-white lang-en">Contact</a>
                        <a href="#footer" class="font-semibold  lang-bn" style="display:none">যোগাযোগ</a>
                    </li>
                </ul>

                <div class="mt-6">
                    <a href="{{ route('login') }}"
                        class="inline-flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white bg-bgPrimary hover:bg-bgPrimary rounded-lg transition-colors duration-200 no-underline">
                        <span class="lang-en">Start free trial</span>
                        <span class="lang-bn" style="display:none">ফ্রি ট্রায়াল শুরু করুন</span>
                    </a>
                    <!-- Language toggle removed from drawer -->
                </div>
            </nav>

            <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <p class="text-xs text-gray-500 dark:text-gray-400">© {{ date('Y') }} Rice Mill ERP Software</p>
            </div>
        </aside>

        <!-- Hero -->
        <div id="hero_header" class="bg-[#F5EEE9]">
            <div class="pt-1 lg:pt-8">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-12 gap-4 justify-center lg:justify-between items-center pb-3">
                        <div class="col-span-12 lg:col-span-5 xl:col-span-6 lg:py-5">
                            <!-- Banner text area -->
                            <div class="panel gap-2 sm:text-center lg:text-start rtl:lg:text-end py-4">
                                <h1
                                    class="text-2xl md:text-3xl xl:text-5xl font-bold mb-1 xl:mb-2 opacity-0 translate-y-8 transition-all duration-700 banner-animate ">
                                    {{-- <span class="lang-en">Auto Rice Mill ERP -</span>
                                <span class="lang-bn" style="display:none">অটো রাইস মিল ইআরপি -</span> --}}

                                    <span class="text-bgPrimary  lang-en">All In One Auto Rice Mill Software
                                        ERP</span>
                                    <span class="text-bgPrimary  lang-bn" style="display:none">অল ইন ওয়ান অটো
                                        রাইস মিল সফটওয়্যার ইআরপি</span>
                                </h1>
                                <p
                                    class="text-justify md:text-left text-sm lg:text-base text-dark  text-opacity-70 opacity-0 translate-y-8 transition-all duration-700 banner-animate py-4">
                                    <span class="lang-en">Run your rice mill smarter with our intelligent Rice mill ERP Software.
                                        Transform how you operate with our easy-to-use
                                        software connects everything procurement, milling, inventory, sales, and finance on
                                        one
                                        clean dashboard.
                                        No more guesswork. Get real time data and insights that help you increase recovery
                                        rates, cut down waste, and maximize profits. With Rice mill software, you can
                                        streamline
                                        daily operations, save time, and grow a more sustainable business.</span>
                                    <span class="lang-bn" style="display:none">রাইসমিল ইআরপির সাথে আপনার রাইসমিলকে আরও
                                        স্মার্টলি চালান। আমাদের ব্যবহার করা সহজ সফ্টওয়্যার ক্রয়, মিলিং, ইনভেন্টরি, বিক্রয়
                                        এবং
                                        অর্থায়নকে একটি পরিষ্কার ড্যাশবোর্ডে সংযুক্ত করে। আর অনুমান কাজ নেই। বাস্তব সময়ের
                                        ডেটা
                                        এবং অন্তর্দৃষ্টি পান যা আপনাকে রিকভারি রেট বৃদ্ধি করতে, বর্জ্য কমাতে এবং লাভ
                                        সর্বাধিক
                                        করতে সাহায্য করে। রাইসমিল সফ্টওয়্যার দিয়ে, আপনি দৈনিক অপারেশনগুলি সহজতর করতে, সময়
                                        বাঁচাতে এবং আরও টেকসই ব্যবসা বৃদ্ধি করতে পারেন।</span>
                                    {{-- <span class="lang-bn" style="display:none"></span> --}}
                                </p>

                                <form method="" action=""
                                    class="grid grid-cols-1 gap-1 mt-1 sm:mt-2 opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                                    {{-- <div class="">
                                    <input class="p-2 w-full bgWhite border border-gray-300 rounded" type="email"
                                        placeholder="Your email..." />
                                </div> --}}
                                    <div>
                                        <a href="{{ route('login') }}"
                                            class="p-2 rounded bg-bgPrimary text-white w-full font-bold inline-flex items-center justify-center">
                                            <span class="lang-en">Start Free Trial</span>
                                            <span class="lang-bn" style="display:none">ফ্রি ট্রায়াল শুরু করুন</span>
                                        </a>
                                    </div>
                                </form>
                                <p
                                    class="text-gray-600 opacity-0 translate-y-8 transition-all duration-700 banner-animate mt-2 text-sm">
                                    <span class="lang-en">Your data security is our top priority. Learn more about how we
                                        protect you in our</span>
                                    <span class="lang-bn" style="display:none">আমরা আপনার ডেটা সম্পর্কে যত্নশীল
                                        আমাদের</span>

                                    <a class="underline text-bgPrimary hover:text-primary-700 transition-colors duration-200"
                                        href="{{ route('privacy-policy') }}"><span class="lang-en">privacy policy</span>
                                        <span class="lang-bn" style="display:none">গোপনীয়তা নীতি</span>
                                    </a>.
                                </p>
                            </div>
                        </div>

                        <!-- Hero Image -->
                        <div class="col-span-12 md:col-span-12 lg:col-span-7 xl:col-span-6">
                            <div class="expand-container mt-0 lg:mt-4">
                                <img src="{{ asset('assets/images/template/dashboard.webp') }}"
                                    alt="A dashboard for Aponn Company's Rice Mill ERP Software, showing financial metrics, order statuses, and supplier payables, with a left-side menu and top quick action buttons."
                                    class="rounded-lg shadow-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats Section -->
        <div id="facts_numbers" class="py-16 md:py-20 bgWhite">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header -->
                <div class="text-center mb-12 max-w-3xl mx-auto">
                    <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        <span class="lang-en">
                            Seamlessly Connect Procurement, Milling, Inventory, Sales, and Finance
                        </span>
                        <span class="lang-bn" style="display:none">
                            নির্বিঘ্নে ক্রয়, মিলিং, ইনভেন্টরি, বিক্রয় এবং অর্থায়ন সংযুক্ত করুন
                        </span>
                    </h2>
                    <p class="text-lg text-gray-600 leading-relaxed">
                        <span class="lang-en">Our Rice Mill ERP Software brings together all your essential operations –
                            procurement, milling, inventory, sales, and finance – into
                            one powerful central platform.
                            Break down data barriers and get crystal-clear visibility that helps you streamline operations,
                            slash costs, and
                            drive remarkable profitability.</span>
                        <span class="lang-bn" style="display:none">রাইসমিল ইআরপি ক্রয়, মিলিং, ইনভেন্টরি, বিক্রয় এবং
                            অর্থায়নকে একটি কেন্দ্রীয় প্ল্যাটফর্মে একীভূত করে। ডেটা সাইলো দূর করে এবং কার্যক্রমকে সহজতর
                            করতে,
                            খরচ কমাতে এবং লাভজনকতা বৃদ্ধি করতে রিয়েল-টাইম দৃশ্যমানতা অর্জন করে।
                    </p>
                </div>

                <!-- Stats Cards -->
                <div class="bg-[#F5EEE9] rounded-2xl p-8 md:p-12">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <!-- Stat 1 -->
                        <div class="text-center">
                            <div class="text-4xl md:text-5xl lg:text-6xl font-bold text-bgPrimary mb-2">
                                <span class="lang-en">500+</span>
                                <span class="lang-bn" style="display:none">৫০০+</span>
                            </div>
                            <p class="text-gray-900 font-medium text-lg">
                                <span class="lang-en">Happy Rice Mills Trust Our Platform</span>
                                <span class="lang-bn" style="display:none">রাইসমিল আমাদের প্ল্যাটফর্ম ব্যবহার করছে</span>
                            </p>
                        </div>

                        <!-- Stat 2 -->
                        <div class="text-center">
                            <div class="text-4xl md:text-5xl lg:text-6xl font-bold text-bgPrimary mb-2">
                                <span class="lang-en">৳50Cr+</span>
                                <span class="lang-bn" style="display:none">৳৫০কোটি+</span>
                            </div>
                            <p class="text-gray-900 font-medium text-lg">
                                <span class="lang-en">In Secure Transactions Processed</span>
                                <span class="lang-bn" style="display:none">লেনদেন প্রক্রিয়া করা হয়েছে</span>
                            </p>
                        </div>

                        <!-- Stat 3 -->
                        <div class="text-center">
                            <div class="text-4xl md:text-5xl lg:text-6xl font-bold text-bgPrimary mb-2">
                                <span class="lang-en">99.9%</span>
                                <span class="lang-bn" style="display:none">৯৯.৯%</span>
                            </div>
                            <p class="text-gray-900 font-medium text-lg">
                                <span class="lang-en">Guaranteed System Reliability</span>
                                <span class="lang-bn" style="display:none">আপটাইম নির্ভরযোগ্যতা</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="main_features" class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bgWhite">
            <div class="py-4 md:py-6 xl:py-9">
                <div class="">
                    <!-- Section Content -->
                    <div class="text-center opacity-0 translate-y-8 transition-all duration-700 scroll-animate mb-28"
                        data-anime="onview: -200; targets: &gt;*; translateY: [48, 0]; opacity: [0, 1]; easing: easeOutCubic; duration: 500; delay: anime.stagger(100, {start: 200});">
                        <h1 class="text-lg text-[#0C4D3D] font-semibold mb-2">
                            <span class="lang-en">Reduce Operational Costs & Waste</span>
                            <span class="lang-bn" style="display:none">অপারেশন খরচ এবং বর্জ্য হ্রাস করুন</span>
                        </h1>
                        <h2 class="text-4xl font-bold mb-2">
                            <span class="lang-en">Complete Rice Mill Management Solution</span>
                            <span class="lang-bn" style="display:none">সম্পূর্ণ রাইসমিল ব্যবস্থাপনা সমাধান</span>
                        </h2>
                        <p class="fs-6 xl:fs-5 text-dark text-opacity-70">
                            <span class="lang-en">Join hundreds of successful rice mill operators who have completely
                                transformed
                                their business operations and boosted profitability by an impressive 40%
                                using our specialized management system.</span>
                            <span class="lang-bn" style="display:none">শত শত রাইসমিল অপারেটরদের সাথে যোগ দিন যারা
                                তাদের
                                ব্যবসায়িক কার্যক্রম রূপান্তরিত করেছে এবং ৪০% লাভজনকতা বৃদ্ধি করেছে আমাদের বিশেষায়িত
                                ব্যবস্থাপনা সিস্টেমের মাধ্যমে।</span>
                        </p>
                    </div>

                    <!-- Complete Sales Management  -->
                    <div class="rounded-2xl shadow-sm mb-16">
                        <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                            <!-- Content -->
                            <div class="text-center">
                                <div class="space-y-6">
                                    <!-- Icon -->
                                    <div
                                        class="inline-flex items-center justify-center w-12 h-12 bg-bgPrimary text-white rounded-xl">
                                        <i data-lucide="badge-dollar-sign" class="w-6 h-6"></i>
                                    </div>

                                    <!-- Title -->
                                    <h3 class="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 ">
                                        <span class="lang-en">Complete Sales Management</span>
                                        <span class="lang-bn" style="display:none">সম্পূর্ণ বিক্রয় ব্যবস্থাপনা</span>
                                    </h3>

                                    <!-- Description -->
                                    <p class="text-lg leading-relaxed">
                                        <span class="lang-en">Keep your finger on the pulse of your business! Track every
                                            sale as it happens, manage customer orders effortlessly, and never miss a
                                            payment update. Whether it's a small order or a massive bulk purchase, you'll
                                            have complete visibility into your sales pipeline.</span>
                                        <span class="lang-bn" style="display:none">দৈনিক বিক্রয় ট্র্যাক করুন, গ্রাহক
                                            অর্ডার
                                            পরিচালনা করুন এবং
                                            পেমেন্ট স্ট্যাটাস রিয়েল-টাইমে পর্যবেক্ষণ করুন। বাল্ক অর্ডার পরিচালনা করুন
                                            এবং
                                            বিস্তারিত লেনদেনের ইতিহাস বজায় রাখুন।</span>
                                    </p>

                                    <!-- CTA Link -->
                                    <a href="#"
                                        class="inline-flex items-center text-bgPrimary  hover:text-primary-700 font-semibold transition-colors duration-200 group">
                                        <span><span class="lang-en">Let's find out</span><span class="lang-bn"
                                                style="display:none">চলুন খুঁজে বের করি</span></span>
                                        <i data-lucide="arrow-right"
                                            class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"></i>
                                    </a>
                                </div>
                            </div>
                            <!-- Image -->
                            <div class="rounded-xl">
                                <img alt="A sales transaction list on a business dashboard, showing dates, invoice numbers, customer names, statuses, amounts, and action buttons"
                                    loading="lazy" decoding="async"
                                    class="w-full h-auto object-cover rounded-lg shadow-lg"
                                    src="{{ asset('assets/images/Features/sales-management.webp') }}" />
                            </div>
                        </div>
                    </div>

                    <!-- Smart Inventory Control Start -->
                    <div class="rounded-2xl shadow-sm mb-16">
                        <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                            <!-- Content -->
                            <div class="text-center">
                                <div class="space-y-6">
                                    <!-- Icon -->
                                    <div
                                        class="inline-flex items-center justify-center w-12 h-12 bg-bgPrimary text-white rounded-xl">
                                        <i data-lucide="badge-dollar-sign" class="w-6 h-6"></i>
                                    </div>

                                    <!-- Title -->
                                    <h3 class="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 ">
                                        <span class="lang-en">Smart Inventory Control</span>
                                        <span class="lang-bn" style="display:none">স্মার্ট ইনভেন্টরি কন্ট্রোল</span>
                                    </h3>

                                    <!-- Description -->
                                    <p class="text-lg leading-relaxed">
                                        <span class="lang-en">Never run out of stock again! Watch your inventory levels
                                            like a hawk with real-time monitoring of rice stocks and raw materials. Get
                                            instant alerts when supplies run low, and build stronger relationships with your
                                            suppliers through streamlined order management.</span>
                                        <span class="lang-bn" style="display:none">চাল স্টক স্তর, কাঁচামালের ইনভেন্টরি
                                            এবং
                                            স্বয়ংক্রিয় কম-স্টক সতর্কতা পর্যবেক্ষণ করুন।
                                            সরবরাহকারী সম্পর্ক পরিচালনা করুন এবং ক্রয় অর্ডারগুলি দক্ষতার সাথে ট্র্যাক
                                            করুন।</span>
                                    </p>

                                    <!-- CTA Link -->
                                    <a href="#"
                                        class="inline-flex items-center text-bgPrimary  hover:text-primary-700 font-semibold transition-colors duration-200 group">
                                        <span class="lang-en">Let's find out</span>
                                        <span class="lang-bn" style="display:none">চলুন খুঁজে বের করি</span>
                                        <i data-lucide="arrow-right"
                                            class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"></i>
                                    </a>
                                </div>
                            </div>
                            <!-- Image -->
                            <div class="md:order-first">
                                <img alt="The image shows Malik Company's inventory list with item details, stock levels, and actions for viewing, editing, or deleting, along with a navigation menu on the left"
                                    loading="lazy" decoding="async"
                                    class="w-full h-auto object-cover rounded-lg shadow-lg"
                                    src="{{ asset('assets/images/Features/smart-inventory.webp') }}" />
                            </div>
                        </div>
                    </div>

                    <!-- Crushing & Production Tracking Start -->
                    <div class="rounded-2xl shadow-sm mb-16">
                        <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                            <!-- Content -->
                            <div class="text-center">
                                <div class="space-y-6">
                                    <!-- Icon -->
                                    <div
                                        class="inline-flex items-center justify-center w-12 h-12 bg-bgPrimary text-white rounded-xl">
                                        <i data-lucide="badge-dollar-sign" class="w-6 h-6"></i>
                                    </div>

                                    <!-- Title -->
                                    <h3 class="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 ">
                                        <span class="lang-en">Crushing & Production Tracking Start</span>
                                        <span class="lang-bn" style="display:none">ক্রাশিং এবং উৎপাদন ট্র্যাকিং
                                            শুরু</span>
                                    </h3>

                                    <!-- Description -->
                                    <p class="text-lg leading-relaxed">
                                        <span class="lang-en">Take control of your production floor! Schedule crushing
                                            operations with precision, track how efficiently your equipment is performing,
                                            and keep tabs on machinery health. Watch your daily output numbers in real-time
                                            and ensure every grain meets your quality standards.</span>
                                        <span class="lang-bn" style="display:none">ক্রাশিং সময়সূচী পরিচালনা করুন,
                                            উৎপাদন
                                            দক্ষতা ট্র্যাক করুন,
                                            এবং যন্ত্রপাতির অবস্থা পর্যবেক্ষণ করুন। দৈনিক আউটপুট এবং গুণমানের
                                            মেট্রিক্সের
                                            উপর
                                            বাস্তব সময়ের প্রতিবেদন পান।</span>
                                    </p>

                                    <!-- CTA Link -->
                                    <a href="#"
                                        class="inline-flex items-center text-bgPrimary hover:text-primary-700  font-semibold transition-colors duration-200 group">
                                        <span class="lang-en">Let's find out</span>
                                        <span class="lang-bn" style="display:none">চলুন খুঁজে বের করি</span>
                                        <i data-lucide="arrow-right"
                                            class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"></i>
                                    </a>
                                </div>
                            </div>
                            <!-- Image -->
                            <div class="rounded-xl">
                                <img alt="The image shows a section of Malik Company's Rice Mill ERP system for managing crushing output. It displays options for selecting dates, input types, and related details, including production quantities, rates, and costs, with a form for entering relevant data. The system also includes a navigation menu on the left for quick access to other features"
                                    loading="lazy" decoding="async"
                                    class="w-full h-auto object-cover rounded-lg shadow-lg"
                                    src="{{ asset('assets/images/Features/crushing-production.webp') }}" />
                            </div>
                        </div>
                    </div>

                    <!-- Reports Start -->
                    <div class="rounded-2xl shadow-sm mb-16">
                        <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                            <!-- Content -->
                            <div class="text-center">
                                <div class="space-y-6">
                                    <!-- Icon -->
                                    <div
                                        class="inline-flex items-center justify-center w-12 h-12 bg-bgPrimary text-white rounded-xl">
                                        <i data-lucide="badge-dollar-sign" class="w-6 h-6"></i>
                                    </div>

                                    <!-- Title -->
                                    <h3 class="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 ">
                                        <span class="lang-en">Reports</span>
                                        <span class="lang-bn" style="display:none">রিপোর্ট</span>
                                    </h3>

                                    <!-- Description -->
                                    <p class="text-lg  leading-relaxed">
                                        <span class="lang-en">Keep your finances crystal clear! Stay on top of what you owe
                                            suppliers, track every expense down to the last penny, and get powerful
                                            financial reports that tell the real story of your business. Watch your cash
                                            flow like a pro and discover exactly where your profits are coming from.</span>
                                        <span class="lang-bn" style="display:none">সরবরাহকারী পাওনাগুলি পরিচালনা করুন,
                                            ব্যয়
                                            ট্র্যাক করুন এবং
                                            ব্যাপক আর্থিক প্রতিবেদন তৈরি করুন। নগদ প্রবাহ এবং
                                            লাভজনকতা বিস্তারিত বিশ্লেষণের সাথে পর্যবেক্ষণ করুন।</span>
                                    </p>

                                    <!-- CTA Link -->
                                    <a href="#"
                                        class="inline-flex items-center text-bgPrimary hover:text-primary-700  font-semibold transition-colors duration-200 group">
                                        <span class="lang-en">Let's find out</span>
                                        <span class="lang-bn" style="display:none">চলুন খুঁজে বের করি</span>
                                        <i data-lucide="arrow-right"
                                            class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"></i>
                                    </a>
                                </div>
                            </div>
                            <!-- Image -->
                            <div class="md:order-first">
                                <img alt="The image shows a stock report with item quantities and totals, along with options to print, save as PDF, or export to Excel, and a navigation menu on the left"
                                    loading="lazy" decoding="async"
                                    class="w-full h-auto object-cover rounded-lg shadow-lg"
                                    src="{{ asset('assets/images/Features/reports.webp') }}" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {{-- Optimize Your Rice Milling Operation and Unlock Profitable Growth --}}
            <div class="bgWhite">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bgWhite">
                    <div
                        class="text-center opacity-0 translate-y-8 transition-all duration-700 scroll-animate bg-[#F5EEE9] rounded-2xl p-6 md:p-8 lg:p-12 my-10 lg:my-16">
                        <h2
                            class="text-2xl lg:text-4xl font-bold opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                            <span class="lang-en">Optimize Your Rice Milling Operation and Unlock Profitable
                                Growth</span>
                            <span class="lang-bn" style="display:none">আপনার ধান মিলের কার্যক্রম অপ্টিমাইজ করুন এবং
                                লাভজনক
                                বৃদ্ধির
                                উন্মোচন করুন</span>
                        </h2>
                        <p class="my-3 opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                            <span class="lang-en">Ready to transform your business? Start your risk-free 30-day trial
                                today. No setup fees, no lengthy contracts, no hidden costs. Experience the difference
                                within your first week and see why rice mill owners love our solution.</span>
                            <span class="lang-bn" style="display:none">আজই আপনার 30 দিনের ফ্রি ট্রায়াল শুরু করুন। কোন
                                সেটআপ
                                ফি
                                নেই,
                                কোন দীর্ঘমেয়াদী চুক্তি নেই। আপনার প্রথম সপ্তাহে পার্থক্য দেখুন।</span>
                        </p>
                        <div
                            class="flex justify-center flex-col md:flex-row items-center gap-1 lg:gap-2 mt-1 lg:mt-2 opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                            <a class="inline-flex items-center justify-center px-4 py-3 text-base font-medium bgWhite border border-gray-900 dark:border-white border-opacity-20 hover:border-opacity-40 rounded-lg shadow-sm transition-all duration-200 no-underline cursor-pointer"
                                data-uc-toggle="">
                                <i data-lucide="play-circle" class="w-6 h-6 mr-1"></i>
                                <span class="lang-en">View demo</span>
                                <span class="lang-bn" style="display:none">ডেমো দেখুন</span>
                            </a>
                            <a class="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-bgPrimary hover:bg-bgPrimary rounded-lg shadow-sm transition-colors duration-200 no-underline"
                                href="{{ route('login') }}">
                                <span class="lang-en">Start free trial</span>
                                <span class="lang-bn" style="display:none">ফ্রি ট্রায়াল শুরু করুন</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Interlock -->
        <div id="clients_feedbacks"
            class="py-16 md:py-20 bgWhite translate-y-8 transition-all duration-700 scroll-animate">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Testimonial Card -->
                <div class="bg-[#F5EEE9] rounded-2xl overflow-hidden shadow-sm">
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        <!-- Left side: Content Section -->
                        <div class="lg:col-span-8 p-8 md:p-12 flex flex-col justify-between">
                            <!-- Quote -->
                            <blockquote class="mb-8">
                                <p
                                    class="text-xl md:text-2xl lg:text-3xl font-medium text-gray-900  leading-relaxed opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                                    <span class="lang-en">"Rice Mill ERP Software has completely transformed how we manage
                                        our business. From tracking daily crushing operations to
                                        managing supplier payments, everything is now organized
                                        and efficient. Our productivity has increased by 35%."</span>
                                    <span class="lang-bn" style="display:none">"রাইস মিল ইআরপি সম্পূর্ণরূপে আমাদের
                                        ব্যবসা
                                        পরিচালনার পদ্ধতি পরিবর্তন করেছে। দৈনিক ক্রাশিং অপারেশন ট্র্যাক করা থেকে শুরু
                                        করে
                                        সরবরাহকারী পেমেন্ট পরিচালনা করা, সবকিছু এখন সংগঠিত
                                        এবং কার্যকর। আমাদের উৎপাদনশীলতা ৩৫% বৃদ্ধি পেয়েছে।"</span>
                                </p>
                            </blockquote>

                            <!-- Author -->
                            <div class="mt-auto opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                                <div class="flex flex-col">
                                    <cite class="text-lg font-semibold text-gray-900  not-italic">
                                        <span class="lang-en">Sabbir Hossain</span>
                                        <span class="lang-bn" style="display:none">সাব্বির হোসেন</span>
                                    </cite>
                                    <span class="text-gray-600 dark:text-gray-400 mt-1">
                                        <span class="lang-en">Raypur Auto Rice Mill</span>
                                        <span class="lang-bn" style="display:none">রায়পুর অটো রাইস মিল</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Video Section -->
                        <div
                            class="lg:col-span-4 relative h-64 lg:h-full min-h-[400px] opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                            <img alt="Customer testimonial video" loading="lazy" width="1500" height="1000"
                                decoding="async" class="absolute inset-0 w-full h-full object-cover"
                                style="color: transparent" src="{{ asset('assets/images/common/interlock.webp') }}" />
                            <!-- Play Button -->
                            <button class="absolute inset-0 flex items-center justify-center group">
                                <div
                                    class="w-16 h-16 lg:w-20 lg:h-20 bgWhite bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:bg-opacity-100 transition-all duration-200">
                                    <i data-lucide="play" class="w-8 h-8 lg:w-10 lg:h-10 text-bgPrimary ml-1"></i>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- See All Feedbacks Link -->
                <div class="text-center mt-12">
                    <a href="#"
                        class="inline-flex items-center gap-2 text-bgPrimary hover:text-primary-700  font-semibold transition-colors duration-200">
                        <span class="lang-en">See all feedbacks</span>
                        <span class="lang-bn" style="display:none">সমস্ত প্রতিক্রিয়া দেখুন</span>
                        <i data-lucide="arrow-right" class="w-5 h-5"></i>
                    </a>
                </div>
            </div>
        </div>

        {{-- Pricing Section --}}
        <div id="pricing" class="py-16 md:py-20 bg-bgPrimary text-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header -->
                <div class="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                    <p class="text-gray-200 text-sm font-medium uppercase tracking-wide mb-4">
                        <span class="lang-en">Pricing Plans</span>
                        <span class="lang-bn" style="display:none">মূল্য নির্ধারণ</span>
                    </p>
                    <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                        <span class="lang-en">Simple, Transparent Pricing</span>
                        <span class="lang-bn" style="display:none">সহজ, স্বচ্ছ মূল্য নির্ধারণ</span>
                    </h2>
                    <p class="text-xl text-gray-200 max-w-3xl mx-auto">
                        <span class="lang-en">Find the perfect plan tailored to your mill's unique needs. Complete
                            transparency with no hidden fees, ever.</span>
                        <span class="lang-bn" style="display:none">আপনার মিলের আকারের জন্য উপযুক্ত পরিকল্পনা নির্বাচন
                            করুন।
                            কোন গোপন ফি নেই।</span>
                    </p>
                </div>

                <!-- Pricing Cards -->
                <div
                    class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                    <!-- Small Mill Plan -->
                    <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <!-- Header -->
                        <div class="p-8 text-center">
                            <div
                                class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-bgPrimary rounded-full mb-4">
                                <i data-lucide="layers" class="w-8 h-8"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-2">
                                <span class="lang-en">Small Mill</span>
                                <span class="lang-bn" style="display:none">ছোট মিল</span>
                            </h3>
                            <div class="flex items-end justify-center mb-4">
                                <span class="text-4xl font-bold text-gray-900">
                                    <span class="lang-en">৳2,999</span>
                                    <span class="lang-bn" style="display:none">৳2,999</span>
                                </span>
                                <span class="text-gray-500 ml-2">
                                    <span class="lang-en">/ mo</span>
                                    <span class="lang-bn" style="display:none">/ মাস</span>
                                </span>
                            </div>
                            <p class="text-gray-600">
                                <span class="lang-en">Ideal for growing rice mills ready to streamline their
                                    operations.</span>
                                <span class="lang-bn" style="display:none">ছোট অপারেশনের জন্য উপযুক্ত।</span>
                            </p>
                        </div>

                        <!-- Features -->
                        <div class="px-8 pb-8">
                            <ul class="space-y-4">
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">Up to 5 users</span>
                                        <span class="lang-bn" style="display:none">৫ জন ব্যবহারকারীর জন্য</span>
                                    </span>
                                </li>
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">Sales & Purchase Management</span>
                                        <span class="lang-bn" style="display:none">বিক্রয় ও ক্রয় ব্যবস্থাপনা</span>
                                    </span>
                                </li>
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">Basic Inventory Tracking</span>
                                        <span class="lang-bn" style="display:none">মৌলিক ইনভেন্টরি ট্র্যাকিং</span>
                                    </span>
                                </li>
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">Monthly Reports</span>
                                        <span class="lang-bn" style="display:none">মাসিক প্রতিবেদন</span>
                                    </span>
                                </li>
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">Email Support</span>
                                        <span class="lang-bn" style="display:none">ইমেল সহায়তা</span>
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <!-- CTA -->
                        <div class="px-8 pb-8">
                            <a href="sign-up.html"
                                class="block w-full text-center px-6 py-3 bg-bgPrimary hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200">
                                <span class="lang-en">Get started</span>
                                <span class="lang-bn" style="display:none">শুরু করুন</span>
                            </a>
                        </div>
                    </div>

                    <!-- Medium Mill Plan (Popular) -->
                    <div class="bg-white rounded-2xl shadow-xl overflow-hidden relative border-2 border-2-bgPrimary">
                        <!-- Popular Badge -->
                        <div
                            class="absolute top-0 right-0 bg-bgPrimary text-white px-4 py-2 text-sm font-medium rounded-bl-lg">
                            <span class="lang-en">Popular</span>
                            <span class="lang-bn" style="display:none">জনপ্রিয়</span>
                        </div>

                        <!-- Header -->
                        <div class="p-8 text-center">
                            <div
                                class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-bgPrimary rounded-full mb-4">
                                <i data-lucide="book" class="w-8 h-8"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-2">
                                <span class="lang-en">Medium Mill</span>
                                <span class="lang-bn" style="display:none">মাঝারি মিল</span>
                            </h3>
                            <div class="flex items-end justify-center mb-4">
                                <span class="text-4xl font-bold text-gray-900">
                                    <span class="lang-en">৳4,999</span>
                                    <span class="lang-bn" style="display:none">৳4,999</span>
                                </span>
                                <span class="text-gray-500 ml-2">
                                    <span class="lang-en">/ mo</span>
                                    <span class="lang-bn" style="display:none">/ মাস</span>
                                </span>
                            </div>
                            <p class="text-gray-600">
                                <span class="lang-en">The sweet spot for most rice mills – our customers' favorite
                                    choice.</span>
                                <span class="lang-bn" style="display:none">জনপ্রিয় পছন্দ।</span>
                            </p>
                        </div>

                        <!-- Features -->
                        <div class="px-8 pb-8">
                            <ul class="space-y-4">
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">All</span>
                                        <span class="lang-bn" style="display:none">সব</span>
                                        <strong class="lang-en">Small Mill</strong> features
                                    </span>
                                </li>
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">Up to 15 users</span>
                                        <span class="lang-bn" style="display:none">১৫ জন ব্যবহারকারী পর্যন্ত</span>
                                    </span>
                                </li>
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">Advanced Crushing Management</span>
                                        <span class="lang-bn" style="display:none">উন্নত পেষণ ব্যবস্থাপনা</span>
                                    </span>
                                </li>
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">Financial Reports & Analytics</span>
                                        <span class="lang-bn" style="display:none">আর্থিক প্রতিবেদন ও বিশ্লেষণ</span>
                                    </span>
                                </li>
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">Phone & Email Support</span>
                                        <span class="lang-bn" style="display:none">ফোন ও ইমেল সহায়তা</span>
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <!-- CTA -->
                        <div class="px-8 pb-8">
                            <a href="{{ route('login') }}"
                                class="block w-full text-center px-6 py-3 bg-bgPrimary hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200">
                                <span class="lang-en">Get started</span>
                                <span class="lang-bn" style="display:none">শুরু করুন</span>
                            </a>
                        </div>
                    </div>

                    <!-- Large Mill Plan -->
                    <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <!-- Header -->
                        <div class="p-8 text-center">
                            <div
                                class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-bgPrimary rounded-full mb-4">
                                <i data-lucide="clipboard-list" class="w-8 h-8"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-2">
                                <span class="lang-en">Large Mill</span>
                                <span class="lang-bn" style="display:none">বড় মিল</span>
                            </h3>
                            <div class="flex items-end justify-center mb-4">
                                <span class="text-4xl font-bold text-gray-900">
                                    <span class="lang-en">৳9,999</span>
                                    <span class="lang-bn" style="display:none">৳৯,৯৯৯</span>
                                </span>
                                <span class="text-gray-500 ml-2">
                                    <span class="lang-en">/ mo</span>
                                    <span class="lang-bn" style="display:none">/ মাস</span>
                                </span>
                            </div>
                            <p class="text-gray-600">
                                <span class="lang-en">Built for enterprise-scale rice mills with complex operations.</span>
                                <span class="lang-bn" style="display:none">বড় অপারেশনের জন্য।</span>
                            </p>
                        </div>

                        <!-- Features -->
                        <div class="px-8 pb-8">
                            <ul class="space-y-4">
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">All</span>
                                        <span class="lang-bn" style="display:none">সব</span>
                                        <strong>
                                            <span class="lang-en">Medium Mill</span>
                                            <span class="lang-bn" style="display:none">মাঝারি মিল</span>
                                        </strong>
                                        <span class="lang-en">features</span>
                                        <span class="lang-bn" style="display:none">ফিচার</span>
                                    </span>
                                </li>
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">Unlimited users</span>
                                        <span class="lang-bn" style="display:none">অসীম ব্যবহারকারী</span>
                                    </span>
                                </li>
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">Multi-location management</span>
                                        <span class="lang-bn" style="display:none">মাল্টি-লোকেশন ব্যবস্থাপনা</span>
                                    </span>
                                </li>
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">Custom integrations & API access</span>
                                        <span class="lang-bn" style="display:none">কাস্টম ইন্টিগ্রেশন এবং এপিআই
                                            অ্যাক্সেস</span>
                                    </span>
                                </li>
                                <li class="flex items-start">
                                    <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                    <span class="text-gray-700">
                                        <span class="lang-en">24/7 Priority Support</span>
                                        <span class="lang-bn" style="display:none">২৪/৭ প্রাধিকার সহায়তা</span>
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <!-- CTA -->
                        <div class="px-8 pb-8">
                            <a href="sign-up.html"
                                class="block w-full text-center px-6 py-3 bg-bgPrimary hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200">
                                <span class="lang-en">Book a demo</span>
                                <span class="lang-bn" style="display:none">ডেমো বুক করুন</span>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Footer Text -->
                <div class="text-center">
                    <p class="text-gray-200 text-sm">
                        <span class="lang-en">All prices shown are before applicable taxes. Start with our risk-free trial
                            today.</span>
                        <span class="lang-bn" style="display:none">মূল্য যে কোনো প্রযোজ্য কর বাদে।</span>
                    </p>
                </div>
            </div>
        </div>

        <!-- FAQ -->
        <div class="bgWhite">
            <div class="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-5">
                    <div class="inline-flex items-center justify-center mb-4">
                        <h2 class="text-3xl md:text-4xl font-bold bg-clip-text ">
                            <span class="lang-en">Frequently Asked Questions</span>
                            <span class="lang-bn" style="display:none">সাধারণ জিজ্ঞাসা</span>
                        </h2>
                    </div>
                    <p class="text-lg max-w-2xl mx-auto leading-relaxed">
                        <span class="lang-en">Got questions? We've got answers! Find everything you need to know about our
                            Rice Mill ERP Software – from powerful modules and smooth workflows to easy setup and
                            customization.</span>
                        <span class="lang-bn" style="display:none">রাইস মিল ইআরপি সফটওয়্যার ব্যবহার সম্পর্কে আপনার যা
                            কিছু
                            জানা
                            দরকার
                            ইআরপি—মডিউল, ওয়ার্কফ্লো এবং সেটিংস।</span>
                    </p>
                </div>

                <div id="faq-accordion" class="">
                    <!-- Item 3 -->
                    <div class="border border-gray-200 rounded-3xl group mb-2">
                        <button type="button"
                            class="flex justify-between items-center w-full sm:p-7 p-4 text-left transition-all duration-500 ease-out hover:bg-gray-500/100 group-hover:shadow-sm hover:rounded-3xl"
                            data-accordion-btn aria-expanded="false" aria-controls="faq-panel-2" id="faq-btn-2">
                            <div class="flex items-start space-x-4">
                                <h3
                                    class="sm:text-lg md:text-xl font-semibold text-gray-800  group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                                    <span class="lang-en">How do I record stock entries, godown details, and item
                                        categories under Inventory Info?</span>
                                    <span class="lang-bn" style="display:none">আমি কীভাবে ইনভেন্টরি তথ্যের অধীনে স্টক
                                        এন্ট্রি,
                                        গডাউন বিবরণ এবং আইটেম বিভাগ রেকর্ড করব?</span>
                                </h3>
                            </div>
                            <svg class="w-12 h-12 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500 ease-out"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                                </path>
                            </svg>
                        </button>
                        <div id="faq-panel-2" role="region" aria-labelledby="faq-btn-2"
                            class="sm:px-7 px-3 overflow-hidden rounded-3xl transition-all duration-300 ease-out max-h-0 opacity-0 py-0"
                            hidden>
                            <div class="from-blue-50/40 to-indigo-50/40 sm:p-6 p-3 border border-blue-100/60 shadow-sm">
                                <p class="text-gray-700 leading-relaxed text-base md:text-lg">
                                    <span class="lang-en">Start by setting up your storage locations (Godowns), defining
                                        units and categories to keep everything organized, and registering your dryers if
                                        you have them. Once that's done, create your inventory items and use our Stock Add
                                        feature to input your current stock levels. This way, your physical inventory and
                                        system records will always match perfectly across all your locations!</span>
                                    <span class="lang-bn" style="display:none">সংরক্ষণের জন্য গডাউনগুলি সংজ্ঞায়িত
                                        করতে,
                                        আইটেমগুলি মানক করতে ইউনিট এবং বিভাগ যোগ করতে, এবং প্রযোজ্য হলে ড্রায়ারগুলি
                                        নিবন্ধন
                                        করতে
                                        ইনভেন্টরি তথ্যে যান। আইটেম তৈরি করুন এবং তারপর স্টক অ্যাড ব্যবহার করে ওপেনিং
                                        ব্যালেন্স
                                        বা
                                        সমন্বয় প্রবেশ করান। এটি বিভিন্ন অবস্থানে শারীরিক স্টক এবং সিস্টেম স্টককে
                                        সঙ্গতিপূর্ণ
                                        রাখে।</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Item 4 -->
                    <div class="border border-gray-200 rounded-3xl group mb-2">
                        <button type="button"
                            class="flex justify-between items-center w-full sm:p-7 p-4 text-left transition-all duration-500 ease-out hover:bg-gray-50/60 hover:dark:bg-gray-800 group-hover:shadow-sm hover:rounded-3xl"
                            data-accordion-btn aria-expanded="false" aria-controls="faq-panel-3" id="faq-btn-3">
                            <div class="flex items-start space-x-4">
                                <h3
                                    class="sm:text-lg md:text-xl font-semibold text-gray-800  group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                                    <span class="lang-en">What is the workflow for managing purchase and sales
                                        transactions, including returns and dues?</span>
                                    <span class="lang-bn" style="display:none">কেনাকাটা এবং বিক্রয় লেনদেন, ফেরত এবং
                                        বকেয়া
                                        সহ পরিচালনার জন্য কাজের প্রবাহ কী?</span>
                                </h3>
                            </div>
                            <svg class="w-12 h-12 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500 ease-out"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                                </path>
                            </svg>
                        </button>
                        <div id="faq-panel-3" role="region" aria-labelledby="faq-btn-3"
                            class="sm:px-7 px-3 overflow-hidden rounded-3xl transition-all duration-300 ease-out max-h-0 opacity-0 py-0"
                            hidden>
                            <div class="from-blue-50/40 to-indigo-50/40 sm:p-6 p-3 border border-blue-100/60 shadow-sm">
                                <p class="text-gray-700 leading-relaxed text-base md:text-lg">
                                    <span class="lang-en">Managing transactions is a breeze! Create purchase and sales
                                        invoices in the Transaction module with just a few clicks. When goods need to come
                                        back, handle returns easily through our dedicated return features. Keep track of who
                                        owes you money and who you need to pay through Outstanding Dues, then mark payments
                                        as complete using our simple Received Add or Payment Add options. The best part?
                                        Every transaction automatically updates your ledgers, stock levels, and reports - no
                                        manual work required!</span>
                                    <span class="lang-bn" style="display:none">লেনদেন মডিউল ব্যবহার করে ক্রয় এবং
                                        বিক্রয়
                                        চালান তৈরি করুন। পণ্য ফেরত গেলে ক্রয় রিটার্ন এবং বিক্রয় রিটার্ন পরিচালনা করুন।
                                        পাওনাদার
                                        এবং
                                        দেনাদারদের অনুসরণ করতে এবং রিসিভড অ্যাড বা পেমেন্ট অ্যাডের মাধ্যমে নিষ্পত্তি
                                        চিহ্নিত
                                        করতে
                                        আউটস্ট্যান্ডিং ডিউস ট্র্যাক করুন। প্রতিটি ধাপ স্বয়ংক্রিয়ভাবে লেজার, স্টক এবং
                                        প্রতিবেদন
                                        আপডেট করে।</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Item 5 -->
                    <div class="border border-gray-200 rounded-3xl group mb-2">
                        <button type="button"
                            class="flex justify-between items-center w-full sm:p-7 p-4 text-left transition-all duration-500 ease-out hover:bg-gray-50/60 hover:dark:bg-gray-800 group-hover:shadow-sm hover:rounded-3xl"
                            data-accordion-btn aria-expanded="false" aria-controls="faq-panel-4" id="faq-btn-4">
                            <div class="flex items-start space-x-4">
                                <h3
                                    class="sm:text-lg md:text-xl font-semibold text-gray-800  group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                                    <span class="lang-en">How can I monitor work orders, production progress, and
                                        finished products?</span>
                                    <span class="lang-bn" style="display:none">কিভাবে আমি কাজের অর্ডার, উৎপাদন অগ্রগতি
                                        এবং
                                        সম্পন্ন পণ্যগুলি পর্যবেক্ষণ করতে পারি?</span>
                                </h3>
                            </div>
                            <svg class="w-12 h-12 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500 ease-out"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                                </path>
                            </svg>
                        </button>
                        <div id="faq-panel-4" role="region" aria-labelledby="faq-btn-4"
                            class="sm:px-7 px-3 overflow-hidden rounded-3xl transition-all duration-300 ease-out max-h-0 opacity-0 py-0"
                            hidden>
                            <div class="from-blue-50/40 to-indigo-50/40 sm:p-6 p-3 border border-blue-100/60 shadow-sm">
                                <p class="text-gray-700 leading-relaxed text-base md:text-lg">
                                    <span class="lang-en">Open the Production module to track Working Orders for
                                        ongoing
                                        jobs and move completed jobs to Finished Products. The
                                        dashboard’s “Work Orders Done” tile shows progress at a
                                        glance, helping you manage capacity and spot delays early.</span>
                                    <span class="lang-bn" style="display:none">চলমান কাজের জন্য ওয়ার্কিং অর্ডার
                                        ট্র্যাক
                                        করতে
                                        এবং
                                        সম্পন্ন কাজগুলি ফিনিশড প্রোডাক্টসে স্থানান্তর করতে প্রোডাকশন মডিউল খুলুন।
                                        ড্যাশবোর্ডের
                                        "ওয়ার্ক
                                        অর্ডার ডান" টাইল এক নজরে অগ্রগতি দেখায়, যা আপনাকে ক্ষমতা পরিচালনা করতে এবং দেরি
                                        শীঘ্রই
                                        চিহ্নিত করতে
                                        সাহায্য করে। </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Item 6 -->
                    <div class="border border-gray-200 rounded-3xl group mb-2">
                        <button type="button"
                            class="flex justify-between items-center w-full sm:p-7 p-4 text-left transition-all duration-500 ease-out hover:bg-gray-50/60 hover:dark:bg-gray-800 group-hover:shadow-sm hover:rounded-3xl"
                            data-accordion-btn aria-expanded="false" aria-controls="faq-panel-5" id="faq-btn-5">
                            <div class="flex items-start space-x-4">
                                <h3
                                    class="sm:text-lg md:text-xl font-semibold text-gray-800  group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                                    <span class="lang-en">How do I manage employee payroll, salary slips, and
                                        attendance
                                        shifts?</span>
                                    <span class="lang-bn" style="display:none">কিভাবে আমি কর্মচারী বেতন, বেতন স্লিপ
                                        এবং
                                        উপস্থিতি শিফট পরিচালনা করব?</span>
                                </h3>
                            </div>
                            <svg class="w-12 h-12 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500 ease-out"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                                </path>
                            </svg>
                        </button>
                        <div id="faq-panel-5" role="region" aria-labelledby="faq-btn-5"
                            class="sm:px-7 px-3 overflow-hidden rounded-3xl transition-all duration-300 ease-out max-h-0 opacity-0 py-0"
                            hidden>
                            <div class="from-blue-50/40 to-indigo-50/40 sm:p-6 p-3 border border-blue-100/60 shadow-sm">
                                <p class="text-gray-700 leading-relaxed text-base md:text-lg">
                                    <span class="lang-en">Managing payroll has never been easier! Start by setting up your
                                        Departments, Designations, and work Shifts in the Payroll module, then add your team
                                        members with all their salary details. Generate professional Salary Slips instantly,
                                        keep track of outstanding Salary Owed amounts, and record payments seamlessly. Want
                                        complete transparency? Use the Employee Ledger and comprehensive Employee Reports to
                                        maintain perfect audit trails and keep everyone in the loop about payroll
                                        matters.</span>
                                    <span class="lang-bn" style="display:none">পেরোল মডিউলে, বিভাগ, পদবী এবং শিফট সেট
                                        আপ
                                        করুন,
                                        তারপর বেতন বিবরণ সহ কর্মচারীদের যোগ করুন। বেতন স্লিপ তৈরি করুন, বকেয়া বেতন
                                        মনিটর
                                        করুন,
                                        এবং বেতন পেমেন্ট রেকর্ড করুন। স্বচ্ছ পেরোল এবং অডিট ট্রেলের জন্য এমপ্লয়ি লেজার
                                        এবং
                                        এমপ্লয়ি রিপোর্ট ব্যবহার করুন।</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Item 7 -->
                    <div class="border border-gray-200 rounded-3xl group mb-2">
                        <button type="button"
                            class="flex justify-between items-center w-full sm:p-7 p-4 text-left transition-all duration-500 ease-out hover:bg-gray-50/60 hover:dark:bg-gray-800 group-hover:shadow-sm hover:rounded-3xl"
                            data-accordion-btn aria-expanded="false" aria-controls="faq-panel-6" id="faq-btn-6">
                            <div class="flex items-start space-x-4">
                                <h3
                                    class="sm:text-lg md:text-xl font-semibold text-gray-800  group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                                    <span class="lang-en">What types of financial reports can I generate, and how do I
                                        access them?</span>
                                    <span class="lang-bn" style="display:none">আমি কী ধরনের আর্থিক প্রতিবেদন তৈরি করতে
                                        পারি
                                        এবং
                                        আমি কীভাবে সেগুলিতে অ্যাক্সেস করব?</span>
                                </h3>
                            </div>
                            <svg class="w-12 h-12 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500 ease-out"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                                </path>
                            </svg>
                        </button>
                        <div id="faq-panel-6" role="region" aria-labelledby="faq-btn-6"
                            class="sm:px-7 px-3 overflow-hidden rounded-3xl transition-all duration-300 ease-out max-h-0 opacity-0 py-0"
                            hidden>
                            <div class="from-blue-50/40 to-indigo-50/40 sm:p-6 p-3 border border-blue-100/60 shadow-sm">
                                <p class="text-gray-700 leading-relaxed text-base md:text-lg">
                                    <span class="lang-en">Get powerful insights at your fingertips! Our comprehensive
                                        Reports module gives you everything you need - from detailed Stock Reports and daily
                                        Day Books to complete Account Books and Ledger Group Summaries. Want to analyze your
                                        sales and purchases? Check out the dedicated Purchase and Sale Reports. Need to know
                                        who owes you money? The Receivable & Payable reports have you covered. And for the
                                        big picture, generate professional Profit & Loss statements and Balance Sheets
                                        instantly. Simply open any report, set your filters (dates, specific ledgers,
                                        whatever you need), and watch as valuable business insights appear before your
                                        eyes!</span>
                                    <span class="lang-bn" style="display:none">রিপোর্ট মডিউলে স্টক রিপোর্ট, ডে বুক,
                                        অ্যাকাউন্ট
                                        বুক, লেজার গ্রুপ সারাংশ, ক্রয় এবং বিক্রয় রিপোর্ট, পাওনাদার এবং দেনাদার, লাভ
                                        এবং
                                        ক্ষতি,
                                        এবং
                                        ব্যালেন্স শীট অন্তর্ভুক্ত। একটি রিপোর্ট খুলুন, তারিখ বা লেজারের মতো আপনার
                                        ফিল্টারগুলি
                                        নির্বাচন করুন, এবং সিদ্ধান্ত গ্রহণের জন্য তাত্ক্ষণিক অন্তর্দৃষ্টি তৈরি
                                        করুন।</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Item 8 -->
                    <div class="border border-gray-200 rounded-3xl group mb-2">
                        <button type="button"
                            class="flex justify-between items-center w-full sm:p-7 p-4 text-left transition-all duration-500 ease-out hover:bg-gray-50/60 hover:dark:bg-gray-800 group-hover:shadow-sm hover:rounded-3xl"
                            data-accordion-btn aria-expanded="false" aria-controls="faq-panel-7" id="faq-btn-7">
                            <div class="flex items-start space-x-4">
                                <h3
                                    class="sm:text-lg md:text-xl font-semibold text-gray-800  group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                                    <span class="lang-en">How can I track outstanding dues, cleared payments, and
                                        supplier payables?</span>
                                    <span class="lang-bn" style="display:none">আমি কীভাবে বাকি পাওনা, পরিশোধিত অর্থ,
                                        এবং
                                        সরবরাহকারী দেনা ট্র্যাক করতে পারি?</span>
                                </h3>
                            </div>
                            <svg class="w-12 h-12 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500 ease-out"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                                </path>
                            </svg>
                        </button>
                        <div id="faq-panel-7" role="region" aria-labelledby="faq-btn-7"
                            class="sm:px-7 px-3 overflow-hidden rounded-3xl transition-all duration-300 ease-out max-h-0 opacity-0 py-0"
                            hidden>
                            <div class="from-blue-50/40 to-indigo-50/40 sm:p-6 p-3 border border-blue-100/60 shadow-sm">
                                <p class="text-gray-700 leading-relaxed text-base md:text-lg">
                                    <span class="lang-en">Keep track of your money matters effortlessly! Your dashboard
                                        gives you instant visibility with the Outstanding Dues and Dues Cleared tiles - no
                                        more guessing about your financial position. As payments come in and go out, simply
                                        update them in the Transaction module and watch your records stay perfectly
                                        accurate. The Top Supplier Payables widget is your financial early warning system -
                                        it shows exactly who you owe money to and how much, so you can plan your cash flow
                                        like a pro and never miss an important payment deadline.</span>
                                    <span class="lang-bn" style="display:none">আউটস্ট্যান্ডিং ডিউস এবং ডিউস
                                        ক্লিয়ারডের
                                        জন্য
                                        ড্যাশবোর্ড টাইলগুলি পরীক্ষা করুন। লেনদেন মডিউলের ভিতরে, সংগৃহীত এবং পেমেন্টগুলি
                                        আপডেট
                                        করুন
                                        যেমন তারা ঘটে। শীর্ষ সরবরাহকারী দেনা উইজেটটি আপনি কার কাছে দেন এবং কতটুকু দেন তা
                                        হাইলাইট
                                        করে,
                                        যা আপনাকে নগদ প্রবাহ পরিকল্পনা করতে এবং মিস করা বাধ্যবাধকতা এড়াতে সাহায্য
                                        করে।</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Item 9 -->
                    <div class="border border-gray-200 rounded-3xl group mb-2">
                        <button type="button"
                            class="flex justify-between items-center w-full sm:p-7 p-4 text-left transition-all duration-500 ease-out hover:bg-gray-50/60 hover:dark:bg-gray-800 group-hover:shadow-sm hover:rounded-3xl"
                            data-accordion-btn aria-expanded="false" aria-controls="faq-panel-8" id="faq-btn-8">
                            <div class="flex items-start space-x-4">
                                <h3
                                    class="sm:text-lg md:text-xl font-semibold text-gray-800  group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                                    <span class="lang-en">What features are available for Crushing/Rent management and
                                        how do I use them?</span>
                                    <span class="lang-bn" style="display:none">ক্রাশিং/ভাড়া ব্যবস্থাপনার জন্য কোন
                                        বৈশিষ্ট্যগুলি
                                        উপলব্ধ এবং আমি কীভাবে সেগুলি ব্যবহার করতে পারি?</span>
                                </h3>
                            </div>
                            <svg class="w-12 h-12 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500 ease-out"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                                </path>
                            </svg>
                        </button>
                        <div id="faq-panel-8" role="region" aria-labelledby="faq-btn-8"
                            class="sm:px-7 px-3 overflow-hidden rounded-3xl transition-all duration-300 ease-out max-h-0 opacity-0 py-0"
                            hidden>
                            <div class="from-blue-50/40 to-indigo-50/40 sm:p-6 p-3 border border-blue-100/60 shadow-sm">
                                <p class="text-gray-700 leading-relaxed text-base md:text-lg">
                                    <span class="lang-en">Expand your service offerings with confidence! The Crushing/Rent
                                        module is perfect for mills that provide processing services or equipment rental.
                                        Easily record customer deposits, track when goods come in and go out, and manage
                                        detailed transport or crushing lists. The best part? Built-in registers and
                                        comprehensive reports help you reconcile every grain and prepare accurate
                                        settlements for each customer - no more disputes or confusion!</span>
                                    <span class="lang-bn" style="display:none">ক্রাশিং/ভাড়া মডিউল মিলগুলিকে
                                        প্রক্রিয়াকরণ
                                        বা
                                        ভাড়া পরিষেবা অফার করতে সাহায্য করে। পার্টি আমানত, পণ্য ইস্যু এবং রসিদ, এবং
                                        পরিবহন
                                        বা
                                        ক্রাশিং তালিকা রেকর্ড করুন। বিল্ট-ইন রেজিস্টার এবং রিপোর্টগুলি ব্যবহার করে
                                        পরিমাণ
                                        মিলিয়ে
                                        নিন এবং প্রতিটি গ্রাহক বা পার্টির জন্য সঠিকভাবে নিষ্পত্তি প্রস্তুত করুন।</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Item 10 -->
                    <div class="border border-gray-200 rounded-3xl group">
                        <button type="button"
                            class="flex justify-between items-center w-full sm:p-7 p-4 text-left transition-all duration-500 ease-out hover:bg-gray-50/60 hover:dark:bg-gray-800 group-hover:shadow-sm hover:rounded-3xl"
                            data-accordion-btn aria-expanded="false" aria-controls="faq-panel-9" id="faq-btn-9">
                            <div class="flex items-start space-x-4">
                                <h3
                                    class="sm:text-lg md:text-xl font-semibold text-gray-800  group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                                    <span class="lang-en">How do I configure company settings, the financial year, and
                                        production cost settings?</span>
                                    <span class="lang-bn" style="display:none">আমি কীভাবে কোম্পানির সেটিংস, আর্থিক বছর
                                        এবং
                                        উৎপাদন খরচের সেটিংস কনফিগার করব?</span>
                                </h3>
                            </div>
                            <svg class="w-12 h-12 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500 ease-out"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                                </path>
                            </svg>
                        </button>
                        <div id="faq-panel-9" role="region" aria-labelledby="faq-btn-9"
                            class="sm:px-7 px-3 overflow-hidden rounded-3xl transition-all duration-300 ease-out max-h-0 opacity-0 py-0"
                            hidden>
                            <div class="from-blue-50/40 to-indigo-50/40 sm:p-6 p-3 border border-blue-100/60 shadow-sm">
                                <p class="text-gray-700 leading-relaxed text-base md:text-lg">
                                    <span class="lang-en">
                                        Make the system truly yours! Head to Settings where you can define your Financial
                                        Year to ensure all reports align with your business cycle, update your Company
                                        Settings with your business name, contact details, and branding elements, and
                                        fine-tune your Production Cost Settings to capture every processing expense
                                        accurately. Getting these configurations right from the start means you'll have
                                        rock-solid costing data and financial statements you can trust completely throughout
                                        your system.
                                    </span>
                                    <span class="lang-bn" style="display:none">
                                        সঠিক রিপোর্টিংয়ের জন্য আপনার আর্থিক বছর সংজ্ঞায়িত করতে, নাম, যোগাযোগ
                                        বিবরণ এবং ব্র্যান্ডিং-এর মতো কোম্পানির সেটিংস আপডেট করতে, এবং সমস্ত
                                        প্রক্রিয়াকরণ
                                        ব্যয় ক্যাপচার করার জন্য উৎপাদন খরচের সেটিংস কনফিগার করতে সেটিংস খুলুন। সঠিক
                                        কনফিগারেশন
                                        সিস্টেম জুড়ে সঠিক খরচ এবং নির্ভরযোগ্য আর্থিক বিবৃতি নিশ্চিত করে।
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Divider -->
                <hr class="border-gray-200 mt-16" />
            </div>
        </div>

        <!-- Footer Section -->
        <div id="footer" class="relative bgWhite text-gray-900 overflow-hidden border-t border-gray-200">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-5">
                <div class="absolute inset-0"
                    style="background-image: radial-gradient(circle at 25% 25%, #B71F25 2px, transparent 2px), radial-gradient(circle at 75% 75%, #B71F25 2px, transparent 2px); background-size: 50px 50px;">
                </div>
            </div>

            <footer class="relative pt-20 pb-10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <!-- Top grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                        <!-- About US -->
                        <div class="space-y-6">
                            <div>
                                <h4
                                    class="text-sm font-bold uppercase mb-6 tracking-wider text-gray-900 flex items-center gap-2">
                                    <div class="w-1 h-6 bg-gradient-to-b from-[#B71F25] to-red-600 rounded-full"></div>
                                    <span class="lang-en">About US</span>
                                    <span class="lang-bn" style="display: none;">আমাদের সম্পর্কে</span>
                                </h4>
                                <div
                                    class="bg-gradient-to-br from-gray-50/80 to-gray-100/50 p-6 rounded-xl backdrop-blur-sm border border-gray-200/80 shadow-lg">
                                    <p class="text-gray-700 leading-relaxed text-sm">
                                        <span class="lang-en">
                                            Ricemill ERP is the all-in-one platform for global rice industry leaders. It
                                            seamlessly connects procurement, milling, inventory, sales, and finance on one
                                            dashboard.
                                        </span>
                                        <span class="lang-bn" style="display: none;">
                                            রাইসমিল ইআরপি হল বিশ্বব্যাপী চাল শিল্প নেতাদের জন্য অল-ইন-ওয়ান প্ল্যাটফর্ম। এটি
                                            নির্বিঘ্নে সংযোগ করে ক্রয়, মিলিং, ইনভেন্টরি, বিক্রয় এবং অর্থ।
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Contact US -->
                        <div class="space-y-6">
                            {{-- title --}}
                            <h4
                                class="text-sm font-bold uppercase mb-6 tracking-wider text-gray-900 flex items-center gap-2">
                                <div class="w-1 h-6 bg-gradient-to-b from-[#B71F25] to-red-600 rounded-full"></div>
                                <span class="lang-en">Contact US</span>
                                <span class="lang-bn" style="display: none;">যোগাযোগ</span>
                            </h4>

                            <div class="space-y-4">
                                {{-- Phone number --}}
                                <div
                                    class="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50/80 border border-gray-200/80 hover:bg-gray-100/80 transition-all duration-300 shadow-sm group w-full overflow-hidden">
                                    {{-- Icon and Phone Number --}}
                                    <div class="flex items-center gap-3 flex-1 ">
                                        {{-- Icon --}}
                                        <div
                                            class="p-2 bg-gradient-to-br from-[#B71F25] to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <i data-lucide="phone" class="w-5 h-5 text-white"></i>
                                        </div>

                                        {{-- Phone Number --}}
                                        <div>
                                            <span class="font-medium text-gray-800 lang-en truncate"
                                                title="01750014052">01750014052</span>
                                            <span class="font-medium text-gray-800 lang-bn truncate"
                                                style="display: none;" title="০১৭৫০০১৪০৫২">০১৭৫০০১৪০৫২</span>
                                        </div>
                                    </div>

                                    {{-- Copy button --}}
                                    <button onclick="copyToClipboard('+880 1750-014052', this)"
                                        class="opacity-0 group-hover:opacity-100 p-2 bg-gray-200/80 hover:bg-[#B71F25] hover:text-white text-gray-600 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0"
                                        title="Copy phone number">
                                        <i data-lucide="copy" class="w-4 h-4"></i>
                                    </button>
                                </div>

                                {{-- Email --}}
                                <div
                                    class="flex justify-between items-center gap-3 p-3 rounded-lg bg-gray-50/80 border border-gray-200/80 hover:bg-gray-100/80 transition-all duration-300 shadow-sm group w-full overflow-hidden">
                                    {{-- Icon and Email --}}
                                    <div class="flex items-center gap-3 flex-1 min-w-0">
                                        {{-- Icon --}}
                                        <div
                                            class="p-2 bg-gradient-to-br from-[#B71F25] to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <i data-lucide="mail" class="w-5 h-5 text-white"></i>
                                        </div>
                                        <span class="font-medium text-gray-800 truncate"
                                            title="info@ricemillerp.com">info@ricemillerp.com</span>
                                    </div>
                                    {{-- Copy button --}}
                                    <button onclick="copyToClipboard('info@ricemillerp.com', this)"
                                        class="opacity-0 group-hover:opacity-100 p-2 bg-gray-200/80 hover:bg-[#B71F25] hover:text-white text-gray-600 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0"
                                        title="Copy email">
                                        <i data-lucide="copy" class="w-4 h-4"></i>
                                    </button>
                                </div>

                                {{-- Address --}}
                                <div
                                    class="flex items-center gap-3 p-3 rounded-lg bg-gray-50/80 border border-gray-200/80 hover:bg-gray-100/80 transition-all duration-300 shadow-sm">
                                    <div
                                        class="p-2 bg-gradient-to-br from-[#B71F25] to-red-600 rounded-lg flex items-center justify-center">
                                        <i data-lucide="map-pin" class="w-5 h-5 text-white"></i>
                                    </div>
                                    <span class="font-medium text-gray-800 lang-en"> 400, Road - 06, Avenue - 01, Mirpur
                                        DOHS, Level - 1, Dhaka</span>
                                    <span class="font-medium text-gray-800 lang-bn" style="display: none;"> ৪০০, রোড - ০৬,
                                        অ্যাভিনিউ - ০১, মিরপুর ডিওএইচএস, লেভেল - ১, ঢাকা</span>
                                </div>
                            </div>
                        </div>

                        <!-- Menu -->
                        <div class="space-y-6">
                            <h4
                                class="text-sm font-bold uppercase mb-6 tracking-wider text-gray-900 flex items-center gap-2">
                                <div class="w-1 h-6 bg-gradient-to-b from-[#B71F25] to-red-600 rounded-full"></div>
                                <span class="lang-en">Quick Links</span>
                                <span class="lang-bn hidden">দ্রুত লিংক</span>
                            </h4>
                            <ul class="space-y-3">
                                <li><a href="#main_features"
                                        class="text-gray-700 hover:text-[#B71F25] hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group">
                                        <i data-lucide="chevron-right"
                                            class="w-4 h-4 text-[#B71F25] group-hover:text-red-600"></i>
                                        <span class="lang-en">Features</span><span class="lang-bn"
                                            style="display: none;">বৈশিষ্ট্য</span>
                                    </a></li>
                                <li><a href="#benefits"
                                        class="text-gray-700 hover:text-[#B71F25] hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group">
                                        <i data-lucide="chevron-right"
                                            class="w-4 h-4 text-[#B71F25] group-hover:text-red-600"></i>
                                        <span class="lang-en">Benefits</span><span class="lang-bn"
                                            style="display: none;">সুবিধা</span>
                                    </a></li>
                                <li><a href="#pricing"
                                        class="text-gray-700 hover:text-[#B71F25] hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group">
                                        <i data-lucide="chevron-right"
                                            class="w-4 h-4 text-[#B71F25] group-hover:text-red-600"></i>
                                        <span class="lang-en">Pricing</span><span class="lang-bn"
                                            style="display: none;">মূল্য নির্ধারণ</span>
                                    </a></li>
                                {{-- <li><a href="#footer"
                                    class="text-gray-700 hover:text-[#B71F25] hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group">
                                    <i data-lucide="chevron-right"
                                        class="w-4 h-4 text-[#B71F25] group-hover:text-red-600"></i>
                                    <span class="lang-en">Contact</span><span class="lang-bn"
                                        style="display: none;">যোগাযোগ</span>
                                </a></li> --}}
                            </ul>
                        </div>

                        <!-- Location -->
                        <div class="space-y-6">
                            <h4
                                class="text-sm font-bold uppercase mb-6 tracking-wider text-gray-900 flex items-center gap-2">
                                <div class="w-1 h-6 bg-gradient-to-b from-[#B71F25] to-red-600 rounded-full"></div>
                                <span class="lang-en">Our Location</span>
                                <span class="lang-bn" style="display: none;">আমাদের অবস্থান</span>
                            </h4>
                            <div
                                class="rounded-xl overflow-hidden shadow-lg border border-gray-200/80 bg-gradient-to-br from-gray-50/80 to-gray-100/50 backdrop-blur-sm">
                                <iframe class="w-full h-48" frameborder="0" style="border:0" allowfullscreen
                                    loading="lazy"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902019857726!2d90.3915633154316!3d23.75090339460159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b8b8b8b8b8%3A0x123456789abcdef!2sDhaka!5e0!3m2!1sen!2sbd!4v1630000000000!5m2!1sen!2sbd"></iframe>
                            </div>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div
                        class="border-t border-gray-300/50 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent h-px mb-10">
                    </div>

                    <!-- Bottom -->
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-0 mb-8">
                        {{-- Rice Mill ERP © 2025, All rights reserved. --}}
                        <div class="text-center md:text-left text-sm text-gray-600">
                            <span class="lang-en">Rice Mill ERP Software © 2025, All rights reserved.</span>
                            <span class="lang-bn" style="display: none;">রাইসমিল ইআরপি © ২০২৫, সকল অধিকার সংরক্ষিত।</span>
                        </div>

                        {{-- Privacy Policy --}}
                        <div class="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-center md:text-left">
                            <a href="{{ route('privacy-policy') }}"
                                class="text-gray-700 hover:text-[#B71F25] transition-colors duration-300">
                                <span class="lang-en">Privacy Policy</span>
                                <span class="lang-bn" style="display: none;">গোপনীয়তা নীতি</span>
                            </a>
                            <a href="#" class="text-gray-700 hover:text-[#B71F25] transition-colors duration-300">
                                <span class="lang-en">Terms of Service</span>
                                <span class="lang-bn" style="display: none;">সেবার শর্তাবলী</span>
                            </a>
                            <a href="#" class="text-gray-700 hover:text-[#B71F25] transition-colors duration-300">
                                <span class="lang-en">Cookie Settings</span>
                                <span class="lang-bn" style="display: none;">কুকি সেটিংস</span>
                            </a>
                        </div>

                        <!-- Socials & Language -->
                        <div class="flex justify-center md:justify-start gap-4">
                            <a href="#" aria-label="LinkedIn"
                                class="w-10 h-10 bg-gray-100/80 hover:bg-gradient-to-br hover:from-[#B71F25] hover:to-red-600 text-gray-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm">
                                <i data-lucide="linkedin" class="w-5 h-5"></i>
                            </a>
                            <a href="#" aria-label="Facebook"
                                class="w-10 h-10 bg-gray-100/80 hover:bg-gradient-to-br hover:from-[#B71F25] hover:to-red-600 text-gray-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm">
                                <i data-lucide="facebook" class="w-5 h-5"></i>
                            </a>
                            <a href="#" aria-label="Twitter"
                                class="w-10 h-10 bg-gray-100/80 hover:bg-gradient-to-br hover:from-[#B71F25] hover:to-red-600 text-gray-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm">
                                <i data-lucide="twitter" class="w-5 h-5"></i>
                            </a>
                            <a href="#" aria-label="Instagram"
                                class="w-10 h-10 bg-gray-100/80 hover:bg-gradient-to-br hover:from-[#B71F25] hover:to-red-600 text-gray-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm">
                                <i data-lucide="instagram" class="w-5 h-5"></i>
                            </a>
                            <a href="#" aria-label="YouTube"
                                class="w-10 h-10 bg-gray-100/80 hover:bg-gradient-to-br hover:from-[#B71F25] hover:to-red-600 text-gray-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm">
                                <i data-lucide="youtube" class="w-5 h-5"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>

        <!-- Scroll to Top Button -->
        <button id="scrollToTopBtn"
            class="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#B71F25] text-white flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 translate-y-8 pointer-events-none hover:bg-[#B71F25]"
            aria-label="Scroll to top">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
        </button>
    </div>

@endsection

@push('scripts')
    <script>
        function toggleLanguage(lang) {
            const enEls = document.querySelectorAll('.lang-en');
            const bnEls = document.querySelectorAll('.lang-bn');
            enEls.forEach(el => el.style.display = lang === 'en' ? '' : 'none');
            bnEls.forEach(el => el.style.display = lang === 'bn' ? '' : 'none');
            // Update all toggle buttons text
            document.querySelectorAll('[id^="langToggleBtn"]').forEach(btn => {
                btn.textContent = lang === 'en' ? 'বাংলা' : 'English';
            });

            // Apply font class based on language
            const body = document.body;
            if (lang === 'bn') {
                body.classList.remove('font-english');
                body.classList.add('font-bangla');
            } else {
                body.classList.remove('font-bangla');
                body.classList.add('font-english');
            }
        }

        // Copy to clipboard function
        function copyToClipboard(text, button) {
            navigator.clipboard.writeText(text).then(function() {
                // Show success feedback
                const originalIcon = button.innerHTML;
                button.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
                button.classList.add('bg-green-500', 'text-white');
                button.classList.remove('bg-gray-200/80', 'hover:bg-[#B71F25]');

                // Reset after 2 seconds
                setTimeout(function() {
                    button.innerHTML = originalIcon;
                    button.classList.remove('bg-green-500', 'text-white');
                    button.classList.add('bg-gray-200/80', 'hover:bg-[#B71F25]');
                    // Re-initialize Lucide icons
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }, 2000);

                // Re-initialize Lucide icons for the check icon
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }).catch(function(err) {
                console.error('Could not copy text: ', err);
                // Show error feedback
                button.classList.add('bg-red-500', 'text-white');
                setTimeout(function() {
                    button.classList.remove('bg-red-500', 'text-white');
                    button.classList.add('bg-gray-200/80', 'hover:bg-[#B71F25]');
                }, 2000);
            });
        }

        // Get initial language from localStorage or default to 'en'
        function getInitialLanguage() {
            try {
                const savedLanguage = localStorage.getItem('language');
                return savedLanguage && (savedLanguage === 'en' || savedLanguage === 'bn') ? savedLanguage : 'en';
            } catch (error) {
                console.warn('LocalStorage not available:', error);
                return 'en';
            }
        }

        // Save language to localStorage
        function saveLanguage(lang) {
            try {
                localStorage.setItem('language', lang);
            } catch (error) {
                console.warn('Could not save language to localStorage:', error);
            }
        }

        // Attach event listeners to all toggle buttons
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize language from localStorage
            let currentLang = getInitialLanguage();

            // Set initial language and font
            toggleLanguage(currentLang);

            document.querySelectorAll('[id^="langToggleBtn"]').forEach(btn => {
                btn.addEventListener('click', function() {
                    currentLang = currentLang === 'en' ? 'bn' : 'en';
                    toggleLanguage(currentLang);
                    saveLanguage(currentLang);
                });
            });
        });
    </script>
@endpush
