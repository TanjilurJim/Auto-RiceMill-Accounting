@extends('layouts.marketing')

@section('title', 'Rice Mill ERP')
@section('meta_description', 'Custom Rice Mill ERP page with full HTML control - no JavaScript interference')

@push('styles')
    {{-- If you had ./style/index.css, move it to public/style/index.css or compile it; then reference: --}}
    <link rel="stylesheet" href="{{ asset('style/index.css') }}" />
@endpush

@section('body')
    {{-- ===== Your HTML body starts here. I only changed image/script paths to use asset() and a few route()s. ===== --}}


    <div class="bg-[#F5EEE9] dark:bg-[#1C1C1E]">
        <header class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shadow-sm pt-2">
            <nav class="flex items-center justify-between h-16">
                <!-- Logo -->
                <a class="text-none" href="{{ url('/') }}">
                    <img alt="Rice Mill ERP" loading="lazy" width="70" height="20" decoding="async" class="dark:d-none"
                        src="{{ asset('assets/images/common/ricemilllogo.svg') }}" />
                </a>

                <!-- Nav links -->
                <div class="hidden md:flex items-center md:gap-4 lg:gap-8 text-[15px]">
                    <a href="#main_features" class="font-semibold dark:text-white">Features</a>
                    <a href="#benefits" class="font-semibold dark:text-white">Benefits</a>
                    <a href="#pricing" class="font-semibold dark:text-white">Pricing</a>
                    <a href="#footer" class="font-semibold dark:text-white">Contact</a>
                </div>

                <!-- Action buttons -->
                <div class="hidden md:flex items-center gap-3">
                    <a class="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-bgPrimary hover:bg-bgPrimary rounded-lg transition-colors duration-200 no-underline"
                        href="{{ route('login') }}">
                        Start free trial
                    </a>
                </div>

                <!-- Mobile drawer toggle -->
                <button id="navToggle"
                    class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-bgPrimary text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600"
                    aria-controls="mobileDrawer" aria-expanded="false" aria-label="Open menu">
                    <!-- hamburger -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </nav>
        </header>
    </div>

    <!-- Mobile Drawer Overlay -->
    <div id="drawerOverlay"
        class="fixed inset-0 bg-black/40 opacity-0 pointer-events-none transition-opacity duration-300 z-[70]"></div>

    <!-- Mobile Drawer Panel -->
    <aside id="mobileDrawer"
        class="fixed top-0 right-0 h-full w-80 max-w-[85%] bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-700 translate-x-full transition-transform duration-300 ease-out z-[75] flex flex-col"
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
                        class="block px-3 py-2 rounded hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800">Features</a>
                </li>
                <li><a href="#benefits"
                        class="block px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white">Benefits</a>
                </li>
                <li><a href="#pricing"
                        class="block px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white">Pricing</a>
                </li>
                <li><a href="#footer"
                        class="block px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white">Contact</a>
                </li>
            </ul>

            <div class="mt-6">
                <a href="{{ route('login') }}"
                    class="inline-flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white bg-bgPrimary hover:bg-bgPrimary rounded-lg transition-colors duration-200 no-underline">
                    Start free trial
                </a>
            </div>
        </nav>

        <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400">© {{ date('Y') }} Rice Mill ERP</p>
        </div>
    </aside>

    {{-- ===== paste the rest of your sections exactly as-is ===== --}}
    {{-- Replace every src/href that points to /assets/... or /js/... with asset('...') --}}
    {{-- Example below for a few images; keep doing this throughout your page: --}}

    <!-- Hero -->
    <!-- Hero -->
    <div id="hero_header" class="bg-[#F5EEE9] dark:bg-[#1C1C1E]">
        <div class="pt-1 lg:pt-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-12 gap-4 justify-center lg:justify-between items-center pb-3">
                    <div class="col-span-12 lg:col-span-5 xl:col-span-6 lg:py-5">
                        <!-- Banner text area -->
                        <div class="panel gap-2 sm:text-center lg:text-start rtl:lg:text-end py-4">
                            <h1
                                class="text-2xl md:text-3xl xl:text-5xl font-bold mb-1 xl:mb-2 opacity-0 translate-y-8 transition-all duration-700 banner-animate dark:text-white">
                                Streamline Your Rice Mill Operations with
                                <span class="text-bgPrimary dark:text-white">Rice Mill ERP Software</span>
                            </h1>
                            <p
                                class="text-sm lg:text-base text-dark dark:text-white text-opacity-70 opacity-0 translate-y-8 transition-all duration-700 banner-animate py-4">
                                Complete business management solution designed
                                specifically for rice mill owners. Track sales, manage
                                inventory, handle payroll, and monitor crushing operations
                                - all in one powerful platform.
                            </p>
                            <form method="" action=""
                                class="grid grid-cols-1 lg:grid-cols-2 gap-1 mt-1 sm:mt-2 opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                                <div class="">
                                    <input class="p-2 w-full bg-white border border-gray-300 rounded" type="email"
                                        placeholder="Your email..." />
                                </div>
                                <div>
                                    <a href="{{ route('login') }}"
                                        class="p-2 rounded bg-bgPrimary text-white w-full font-bold inline-flex items-center justify-center">
                                        Start Free Trial
                                    </a>
                                </div>
                            </form>
                            <p
                                class="text-gray-600 dark:text-gray-300 opacity-0 translate-y-8 transition-all duration-700 banner-animate mt-2 text-sm">
                                We care about your data in our
                                <a class="underline text-bgPrimary dark:text-white hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                                    href="page-privacy.html">privacy policy</a>.
                            </p>
                        </div>
                    </div>

                    <!-- Hero Image -->
                    <div class="col-span-12 md:col-span-12 lg:col-span-7 xl:col-span-6">
                        <div class="expand-container mt-0 lg:mt-4">
                            <img src="{{ asset('assets/images/template/dashboard.png') }}" alt="Hero Image"
                                class="rounded-lg shadow-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Stats Section -->
    <div id="facts_numbers" class="py-16 md:py-20 dark:bg-[#0E0E0F]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12 max-w-3xl mx-auto">
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                    Streamline Your Rice Mill Operations with Rice Mill ERP 
                </h2>
                <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    Complete business management solution designed specifically for
                    rice mill owners. Track sales, manage inventory, handle payroll,
                    and monitor crushing operations - all in one powerful platform.
                </p>
            </div>

            <!-- Stats Cards -->
            <div class="bg-[#F5EEE9] dark:bg-[#1C1C1E] rounded-2xl p-8 md:p-12">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Stat 1 -->
                    <div class="text-center">
                        <div class="text-4xl md:text-5xl lg:text-6xl font-bold text-bgPrimary dark:text-white mb-2">
                            500+
                        </div>
                        <p class="text-gray-900 dark:text-white font-medium text-lg">
                            Rice Mills Using Our Platform
                        </p>
                    </div>

                    <!-- Stat 2 -->
                    <div class="text-center">
                        <div class="text-4xl md:text-5xl lg:text-6xl font-bold text-bgPrimary dark:text-white mb-2">
                            ৳50Cr+
                        </div>
                        <p class="text-gray-900 dark:text-white font-medium text-lg">
                            Transactions Processed
                        </p>
                    </div>

                    <!-- Stat 3 -->
                    <div class="text-center">
                        <div class="text-4xl md:text-5xl lg:text-6xl font-bold text-bgPrimary dark:text-white mb-2">
                            99.9%
                        </div>
                        <p class="text-gray-900 dark:text-white font-medium text-lg">
                            Uptime Reliability
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main features -->
    <div id="main_features" class="px-4 sm:px-6 lg:px-8 dark:bg-[#0E0E0F] max-w-7xl mx-auto">
        <div class="py-4 md:py-6 xl:py-9">
            <div class="">
                <!-- Section Content -->
                <div class="text-center opacity-0 translate-y-8 transition-all duration-700 scroll-animate mb-28 dark:text-white"
                    data-anime="onview: -200; targets: &gt;*; translateY: [48, 0]; opacity: [0, 1]; easing: easeOutCubic; duration: 500; delay: anime.stagger(100, {start: 200});">
                    <h1 class="text-lg text-[#0C4D3D] dark:text-white font-semibold mb-2">
                        Why Rice Mill Owners Choose Rice Mill ERP Software
                    </h1>
                    <h2 class="text-4xl font-bold mb-2">
                        Complete Rice Mill Management Solution
                    </h2>
                    <p class="fs-6 xl:fs-5 text-dark text-opacity-70">
                        Join hundreds of rice mill operators who have transformed
                        their business operations and increased profitability by 40%
                        with our specialized management system.
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
                                <h3 class="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white">
                                    Complete Sales Management
                                </h3>

                                <!-- Description -->
                                <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Track daily sales, manage customer orders, and monitor
                                    payment status in real-time. Handle bulk orders and
                                    maintain detailed transaction history.
                                </p>

                                <!-- CTA Link -->
                                <a href="#"
                                    class="inline-flex items-center text-bgPrimary dark:text-white hover:dark:text-white hover:text-primary-700 font-semibold transition-colors duration-200 group">
                                    <span>Let's find out</span>
                                    <i data-lucide="arrow-right"
                                        class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"></i>
                                </a>
                            </div>
                        </div>
                        <!-- Image -->
                        <div class="rounded-xl">
                            <img alt="Complete Sales Management" loading="lazy" decoding="async"
                                class="w-full h-auto object-cover rounded-lg shadow-lg"
                                src="{{ asset('assets/images/Features/sales-management.png') }}" />
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
                                <h3 class="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white">
                                    Smart Inventory Control
                                </h3>

                                <!-- Description -->
                                <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Monitor rice stock levels, raw material inventory, and
                                    automated low-stock alerts. Manage supplier
                                    relationships and track purchase orders efficiently.
                                </p>

                                <!-- CTA Link -->
                                <a href="#"
                                    class="inline-flex items-center text-bgPrimary dark:text-white hover:dark:text-white hover:text-primary-700 font-semibold transition-colors duration-200 group">
                                    <span>Let's find out</span>
                                    <i data-lucide="arrow-right"
                                        class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"></i>
                                </a>
                            </div>
                        </div>
                        <!-- Image -->
                        <div class="md:order-first">
                            <img alt="Complete Sales Management Dashboard" loading="lazy" decoding="async"
                                class="w-full h-auto object-cover rounded-lg shadow-lg"
                                src="{{ asset('assets/images/Features/smart-inventory.png') }}" />
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
                                <h3 class="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white">
                                    Crushing & Production Tracking Start
                                </h3>

                                <!-- Description -->
                                <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Manage crushing schedules, track production efficiency,
                                    and monitor equipment status. Get real-time reports on
                                    daily output and quality metrics.
                                </p>

                                <!-- CTA Link -->
                                <a href="#"
                                    class="inline-flex items-center text-bgPrimary hover:text-primary-700 dark:text-white hover:dark:text-white font-semibold transition-colors duration-200 group">
                                    <span>Let's find out</span>
                                    <i data-lucide="arrow-right"
                                        class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"></i>
                                </a>
                            </div>
                        </div>
                        <!-- Image -->
                        <div class="rounded-xl">
                            <img alt="Complete Sales Management Dashboard" loading="lazy" decoding="async"
                                class="w-full h-auto object-cover rounded-lg shadow-lg"
                                src="{{ asset('assets/images/Features/crushing-production.png') }}" />
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
                                <h3 class="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white">
                                    Reports
                                </h3>

                                <!-- Description -->
                                <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Handle supplier payables, track expenses, and generate
                                    comprehensive financial reports. Monitor cash flow and
                                    profitability with detailed analytics.
                                </p>

                                <!-- CTA Link -->
                                <a href="#"
                                    class="inline-flex items-center text-bgPrimary hover:text-primary-700 dark:text-white hover:dark:text-white font-semibold transition-colors duration-200 group">
                                    <span>Let's find out</span>
                                    <i data-lucide="arrow-right"
                                        class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"></i>
                                </a>
                            </div>
                        </div>
                        <!-- Image -->
                        <div class="md:order-first">
                            <img alt="Complete Sales Management Dashboard" loading="lazy" decoding="async"
                                class="w-full h-auto object-cover rounded-lg shadow-lg"
                                src="{{ asset('assets/images/Features/reports.png') }}" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
            class="text-center opacity-0 translate-y-8 transition-all duration-700 scroll-animate bg-[#F5EEE9] dark:bg-[#1C1C1E] rounded-2xl p-6 md:p-8 lg:p-12 my-10 lg:my-16">
            <h2
                class="text-2xl dark:text-white lg:text-4xl font-bold opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                Ready to Modernize Your Rice Mill Operations?
            </h2>
            <p
                class="text-opacity-70 dark:text-[#BBBBBC] my-3 opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                Start your 30-day free trial today. No setup fees, no long-term
                contracts. See the difference in your first week.
            </p>
            <div
                class="flex justify-center flex-col md:flex-row items-center gap-1 lg:gap-2 mt-1 lg:mt-2 opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                <a class="inline-flex items-center justify-center px-4 py-3 text-base font-medium bg-white dark:bg-gray-700 dark:text-white border border-gray-900 dark:border-white border-opacity-20 hover:border-opacity-40 rounded-lg shadow-sm transition-all duration-200 no-underline cursor-pointer"
                    data-uc-toggle="">
                    <i data-lucide="play-circle" class="w-6 h-6 mr-1"></i>
                    <span>View demo</span>
                </a>
                <a class="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-bgPrimary hover:bg-bgPrimary rounded-lg shadow-sm transition-colors duration-200 no-underline"
                    href="{{ route('login') }}">
                    Start free trial
                </a>
            </div>
        </div>
    </div>

    <div id="pricing" class="py-16 md:py-20 bg-bgPrimary text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                <p class="text-gray-200 text-sm font-medium uppercase tracking-wide mb-4">
                    Pricing Plans
                </p>
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                    Simple, transparent pricing for every rice mill
                </h2>
                <p class="text-xl text-gray-200 max-w-3xl mx-auto">
                    Choose the plan that fits your mill size. No hidden fees.
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
                            Small Mill
                        </h3>
                        <div class="flex items-end justify-center mb-4">
                            <span class="text-4xl font-bold text-gray-900">৳2,999</span>
                            <span class="text-gray-500 ml-2">/ mo</span>
                        </div>
                        <p class="text-gray-600">Perfect for small operations.</p>
                    </div>

                    <!-- Features -->
                    <div class="px-8 pb-8">
                        <ul class="space-y-4">
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">Up to 5 users</span>
                            </li>
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">Sales & Purchase Management</span>
                            </li>
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">Basic Inventory Tracking</span>
                            </li>
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">Monthly Reports</span>
                            </li>
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">Email Support</span>
                            </li>
                        </ul>
                    </div>

                    <!-- CTA -->
                    <div class="px-8 pb-8">
                        <a href="sign-up.html"
                            class="block w-full text-center px-6 py-3 bg-bgPrimary hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200">
                            Get started
                        </a>
                    </div>
                </div>

                <!-- Medium Mill Plan (Popular) -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden relative border-2 border-2-bgPrimary">
                    <!-- Popular Badge -->
                    <div
                        class="absolute top-0 right-0 bg-bgPrimary text-white px-4 py-2 text-sm font-medium rounded-bl-lg">
                        Popular
                    </div>

                    <!-- Header -->
                    <div class="p-8 text-center">
                        <div
                            class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-bgPrimary rounded-full mb-4">
                            <i data-lucide="book" class="w-8 h-8"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">
                            Medium Mill
                        </h3>
                        <div class="flex items-end justify-center mb-4">
                            <span class="text-4xl font-bold text-gray-900">৳4,999</span>
                            <span class="text-gray-500 ml-2">/ mo</span>
                        </div>
                        <p class="text-gray-600">Most popular choice.</p>
                    </div>

                    <!-- Features -->
                    <div class="px-8 pb-8">
                        <ul class="space-y-4">
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">All <strong>Small Mill</strong> features</span>
                            </li>
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">Up to 15 users</span>
                            </li>
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">Advanced Crushing Management</span>
                            </li>
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">Financial Reports & Analytics</span>
                            </li>
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">Phone & Email Support</span>
                            </li>
                        </ul>
                    </div>

                    <!-- CTA -->
                    <div class="px-8 pb-8">
                        <a href="{{route('login')}}"
                            class="block w-full text-center px-6 py-3 bg-bgPrimary hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200">
                            Free trial
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
                            Large Mill
                        </h3>
                        <div class="flex items-end justify-center mb-4">
                            <span class="text-4xl font-bold text-gray-900">৳9,999</span>
                            <span class="text-gray-500 ml-2">/ mo</span>
                        </div>
                        <p class="text-gray-600">For large operations.</p>
                    </div>

                    <!-- Features -->
                    <div class="px-8 pb-8">
                        <ul class="space-y-4">
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">All <strong>Medium Mill</strong> features</span>
                            </li>
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">Unlimited users</span>
                            </li>
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">Multi-location management</span>
                            </li>
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">Custom integrations & API access</span>
                            </li>
                            <li class="flex items-start">
                                <i data-lucide="check" class="w-5 h-5 text-bgPrimary mt-0.5 mr-3 flex-shrink-0"></i>
                                <span class="text-gray-700">24/7 Priority Support</span>
                            </li>
                        </ul>
                    </div>

                    <!-- CTA -->
                    <div class="px-8 pb-8">
                        <a href="sign-up.html"
                            class="block w-full text-center px-6 py-3 bg-bgPrimary hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200">
                            Book a demo
                        </a>
                    </div>
                </div>
            </div>

            <!-- Footer Text -->
            <div class="text-center">
                <p class="text-gray-200 text-sm">
                    Prices exclude any applicable taxes.
                </p>
            </div>
        </div>
    </div>

    <!-- Interlock -->
    <div id="clients_feedbacks"
        class="py-16 md:py-20 bg-white dark:bg-[#0E0E0F] translate-y-8 transition-all duration-700 scroll-animate">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Testimonial Card -->
            <div class="bg-[#F5EEE9] dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    <!-- Left side: Content Section -->
                    <div class="lg:col-span-8 p-8 md:p-12 flex flex-col justify-between">
                        <!-- Logo -->
                        <div class="mb-8 opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                            <img alt="Interlock" loading="lazy" width="163" height="48" decoding="async"
                                class="h-12 w-auto dark:hidden" style="color: transparent"
                                src="{{ asset('assets/images/brands/brand-08.svg') }}" />
                            <img alt="Interlock" loading="lazy" width="163" height="48" decoding="async"
                                class="h-12 w-auto hidden dark:block" style="color: transparent"
                                src="{{ asset('assets/images/brands/brand-08-dark.svg') }}" />
                        </div>

                        <!-- Quote -->
                        <blockquote class="mb-8">
                            <p
                                class="text-xl md:text-2xl lg:text-3xl font-medium text-gray-900 dark:text-white leading-relaxed opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                                "Rice Mill ERP has completely transformed how we manage
                                our business. From tracking daily crushing operations to
                                managing supplier payments, everything is now organized
                                and efficient. Our productivity has increased by 35%."
                            </p>
                        </blockquote>

                        <!-- Author -->
                        <div class="mt-auto opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                            <div class="flex flex-col">
                                <cite class="text-lg font-semibold text-gray-900 dark:text-white not-italic">
                                    Mohammad Rahman
                                </cite>
                                <span class="text-gray-600 dark:text-gray-400 mt-1">
                                    Rahman Rice Mills
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Video Section -->
                    <div
                        class="lg:col-span-4 relative h-64 lg:h-full min-h-[400px] opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                        <img alt="Customer testimonial video" loading="lazy" width="1500" height="1000"
                            decoding="async" class="absolute inset-0 w-full h-full object-cover"
                            style="color: transparent" src="{{ asset('assets/images/common/login.webp') }}" />
                        <!-- Play Button -->
                        <button class="absolute inset-0 flex items-center justify-center group">
                            <div
                                class="w-16 h-16 lg:w-20 lg:h-20 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:bg-opacity-100 transition-all duration-200">
                                <i data-lucide="play" class="w-8 h-8 lg:w-10 lg:h-10 text-bgPrimary ml-1"></i>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- See All Feedbacks Link -->
            <div class="text-center mt-12">
                <a href="#"
                    class="inline-flex items-center gap-2 text-bgPrimary hover:text-primary-700 dark:text-white hover:dark:text-white font-semibold transition-colors duration-200">
                    <span>See all feedbacks</span>
                    <i data-lucide="arrow-right" class="w-5 h-5"></i>
                </a>
            </div>
        </div>
    </div>

    <!-- FAQ -->
    <div class="mt-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-5">
            <div class="inline-flex items-center justify-center mb-4">
                <h2
                    class="text-3xl md:text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:text-white">
                    Frequently Asked Questions
                </h2>
            </div>
            <p class="text-lg text-gray-600 dark:text-darkTextSecondary max-w-2xl mx-auto leading-relaxed">
                Everything you need to know about using the Rice Mill ERP Software
                ERP—modules, workflows, and settings.
            </p>
        </div>

        <div id="faq-accordion" class="">
            <!-- Item 3 -->
            <div class="border border-gray-200 rounded-3xl group mb-2">
                <button type="button"
                    class="flex justify-between items-center w-full sm:p-7 p-4 text-left transition-all duration-500 ease-out hover:bg-gray-50/60 hover:dark:bg-gray-800 group-hover:shadow-sm hover:rounded-3xl"
                    data-accordion-btn aria-expanded="false" aria-controls="faq-panel-2" id="faq-btn-2">
                    <div class="flex items-start space-x-4">
                        <h3
                            class="sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                            How do I record stock entries, godown details, and item
                            categories under Inventory Info?
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
                            Go to Inventory Info to define Godowns for storage, add Units
                            and Categories to standardize items, and register Dryers if
                            applicable. Create Items and then use Stock Add to enter
                            opening balances or adjustments. This keeps physical stock and
                            system stock aligned across locations.
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
                            class="sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                            What is the workflow for managing purchase and sales
                            transactions, including returns and dues?
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
                            Use the Transaction module to create Purchases and Sales
                            invoices. Handle Purchase Returns and Sales Returns when goods
                            move back. Track Outstanding Dues to follow receivables and
                            payables, and mark settlements through Received Add or Payment
                            Add. Each step updates ledgers, stock, and reports
                            automatically.
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
                            class="sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                            How can I monitor work orders, production progress, and
                            finished products?
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
                            Open the Production module to track Working Orders for ongoing
                            jobs and move completed jobs to Finished Products. The
                            dashboard’s “Work Orders Done” tile shows progress at a
                            glance, helping you manage capacity and spot delays early.
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
                            class="sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                            How do I manage employee payroll, salary slips, and attendance
                            shifts?
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
                            In the Payroll module, set up Departments, Designations, and
                            Shifts, then add Employees with salary details. Generate
                            Salary Slips, monitor Salary Owed, and record Salary Payments.
                            Use Employee Ledger and Employee Reports for transparent
                            payroll and audit trails.
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
                            class="sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                            What reports are available and how do I generate them?
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
                            The Reports module includes Stock Report, Day Book, Account
                            Book, Ledger Group Summary, Purchase and Sale Reports,
                            Receivable &amp; Payable, Profit &amp; Loss, and Balance
                            Sheet. Open a report, choose your filters like dates or
                            ledgers, and generate insights instantly for decision-making.
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
                            class="sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                            How can I track outstanding dues, cleared payments, and
                            supplier payables?
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
                            Check the dashboard tiles for Outstanding Dues and Dues
                            Cleared. Inside the Transaction module, update collections and
                            payments as they occur. The Top Supplier Payables widget
                            highlights who you owe and how much, helping you plan cash
                            flow and avoid missed obligations.
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
                            class="sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                            What features are available for Crushing/Rent management and
                            how do I use them?
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
                            The Crushing/Rent module helps mills offering processing or
                            rental services. Record party deposits, issue and receipt of
                            goods, and transport or crushing lists. Use the built-in
                            registers and reports to reconcile quantities and prepare
                            settlements accurately for each customer or party.
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
                            class="sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300">
                            How do I configure company settings, the financial year, and
                            production cost settings?
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
                            Open Settings to define your Financial Year for accurate
                            reporting, update Company Settings such as name, contact
                            details, and branding, and configure Production Cost Settings
                            to capture all processing expenses. Correct configuration
                            ensures precise costing and reliable financial statements
                            across the system.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Meet our team -->
        <div class="text-gray-900">
            <!-- Meet Our Team Section -->
            <section id="team" class="py-16 md:py-20 lg:py-24">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <!-- Header -->
                    <div class="text-center mb-12">
                        <!-- We're hiring badge -->
                        <div class="inline-flex items-center gap-2 mb-6">
                            <span
                                class="px-3 py-1 text-sm font-medium text-bgPrimary bg-primary-50 rounded-full opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                                We're hiring
                            </span>
                        </div>

                        <!-- Main heading -->
                        <h2
                            class="text-4xl md:text-5xl lg:text-6xl dark:text-white font-bold text-gray-900 mb-6 opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                            Meet our team
                        </h2>

                        <!-- Description -->
                        <p
                            class="text-lg md:text-xl text-gray-600 dark:text-darkTextSecondary max-w-3xl mx-auto leading-relaxed opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                            Our philosophy is simple — hire a team of diverse, passionate
                            people and foster a culture that empowers you to do your best
                            work.
                        </p>
                    </div>

                    <!-- Team Grid -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
                        <!-- Mark Zellers -->
                        <div class="flex flex-col items-center text-center">
                            <div
                                class="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mb-4 overflow-hidden rounded-full bg-gray-100">
                                <img src="{{ asset('assets/images/template/team-01.jpg') }}" alt="Mark Zellers"
                                    class="w-full h-full object-cover" />
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                Mark Zellers
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-darkTextSecondary">
                                Founder & CEO
                            </p>
                        </div>

                        <!-- John Zellers -->
                        <div class="flex flex-col items-center text-center">
                            <div
                                class="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mb-4 overflow-hidden rounded-full bg-gray-100">
                                <img src="{{ asset('assets/images/template/team-02.jpg') }}" alt="John Zellers"
                                    class="w-full h-full object-cover" />
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                John Zellers
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-darkTextSecondary">
                                Co-Founder
                            </p>
                        </div>

                        <!-- Kim Yun Son -->
                        <div class="flex flex-col items-center text-center">
                            <div
                                class="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mb-4 overflow-hidden rounded-full bg-gray-100">
                                <img src="{{ asset('assets/images/template/team-03.jpg') }}" alt="Kim Yun Son"
                                    class="w-full h-full object-cover" />
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                Kim Yun Son
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-darkTextSecondary">
                                Engineering Manager
                            </p>
                        </div>

                        <!-- André Garcia -->
                        <div class="flex flex-col items-center text-center">
                            <div
                                class="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mb-4 overflow-hidden rounded-full bg-gray-100">
                                <img src="{{ asset('assets/images/template/team-04.jpg') }}" alt="André Garcia"
                                    class="w-full h-full object-cover" />
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                André Garcia
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-darkTextSecondary">
                                Product Manager
                            </p>
                        </div>
                    </div>

                    <!-- We're hiring link -->
                    <div class="text-center">
                        <a href="#careers"
                            class="inline-flex items-center gap-2 text-bgPrimary hover:text-primary-700 dark:text-white dark:hover:text-darkTextSecondary font-semibold text-lg transition-colors opacity-0 translate-y-8 transition-all duration-700 banner-animate">
                            <span>We're hiring</span>
                            <i data-lucide="arrow-right" class="w-5 h-5"></i>
                        </a>
                    </div>
                </div>
            </section>
        </div>

        <!-- Divider -->
        <hr class="border-gray-200" />
    </div>



    <div id="footer" class="text-gray-900">
        <!-- Footer Section -->
        <footer class="pt-16 pb-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Top grid -->
                <div class="grid grid-cols-2 md:grid-cols-5 gap-8 md:text-left mb-10">
                    <!-- Inner Pages -->
                    <div>
                        <h4 class="text-xs font-bold uppercase mb-4 tracking-wider dark:text-white">
                            Inner Pages
                        </h4>
                        <ul class="space-y-1">
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Features</a>
                            </li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Pricing</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">About</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Career</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Contact</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Contact v2</a>
                            </li>
                        </ul>
                    </div>
                    <!-- Blog -->
                    <div>
                        <h4 class="text-xs font-bold uppercase mb-4 tracking-wider dark:text-white">
                            Blog
                        </h4>
                        <ul class="space-y-1">
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Classic</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Grid 2 cols</a>
                            </li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Grid 3 cols</a>
                            </li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Grid 4 cols</a>
                            </li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Blog detail</a>
                            </li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Blog detail
                                    v2</a></li>
                        </ul>
                    </div>
                    <!-- Shop -->
                    <div>
                        <h4 class="text-xs font-bold uppercase dark:text-white mb-4 tracking-wider">
                            Shop
                        </h4>
                        <ul class="space-y-1">
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Shop</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">With sidebar</a>
                            </li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Product
                                    detail</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Cart</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Checkout</a>
                            </li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Order
                                    confirmation</a></li>
                        </ul>
                    </div>
                    <!-- Other -->
                    <div>
                        <h4 class="text-xs font-bold uppercase dark:text-white mb-4 tracking-wider">
                            Other
                        </h4>
                        <ul class="space-y-1">
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">FAQ</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">404</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Coming Soon</a>
                            </li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Terms of
                                    service</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Privacy
                                    policy</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Request a
                                    demo</a></li>
                        </ul>
                    </div>
                    <!-- Membership -->
                    <div>
                        <h4 class="text-xs font-bold uppercase dark:text-white mb-4 tracking-wider">
                            Membership
                        </h4>
                        <ul class="space-y-1">
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Sign in</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Sign in v2</a>
                            </li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Sign up</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Sign up v2</a>
                            </li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Reset
                                    password</a></li>
                            <li><a href="#" class="hover:underline dark:text-darkTextSecondary">Reset password
                                    v2</a></li>
                        </ul>
                    </div>
                </div>

                <!-- Divider -->
                <hr class="my-8 border-gray-200" />

                <!-- Bottom -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-0">
                    <div class="text-center md:text-left text-sm text-gray-500 dark:text-darkTextSecondary mb-2 md:mb-0">
                        Rice Mill ERP © 2025, All rights reserved.
                    </div>
                    <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-center md:text-left">
                        <a href="#"
                            class="font-medium text-gray-900 dark:text-darkTextSecondary hover:underline">Privacy
                            notice</a>
                        <a href="#"
                            class="font-medium text-gray-900 dark:text-darkTextSecondary hover:underline">Legal</a>
                        <a href="#"
                            class="font-medium text-gray-900 dark:text-darkTextSecondary hover:underline">Cookie
                            settings</a>
                    </div>
                </div>

                <!-- Socials & Language -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between mt-8 gap-4 md:gap-0">
                    <div class="flex justify-center md:justify-start gap-4">
                        <a href="#" aria-label="LinkedIn"
                            class="dark:hover:text-white dark:text-darkTextSecondary">
                            <i data-lucide="linkedin" class="w-5 h-5"></i>
                        </a>
                        <a href="#" aria-label="Facebook"
                            class="dark:hover:text-white dark:text-darkTextSecondary">
                            <i data-lucide="facebook" class="w-5 h-5"></i>
                        </a>
                        <a href="#" aria-label="X" class="dark:hover:text-white dark:text-darkTextSecondary">
                            <i data-lucide="twitter" class="w-5 h-5"></i>
                        </a>
                        <a href="#" aria-label="Instagram"
                            class="dark:hover:text-white dark:text-darkTextSecondary">
                            <i data-lucide="instagram" class="w-5 h-5"></i>
                        </a>
                        <a href="#" aria-label="YouTube" class="dark:hover:text-white dark:text-darkTextSecondary">
                            <i data-lucide="youtube" class="w-5 h-5"></i>
                        </a>
                    </div>
                    <div
                        class="flex items-center justify-center md:justify-end gap-2 text-gray-900 dark:text-darkTextSecondary cursor-pointer hover:text-gray-600 dark:hover:text-white transition-all duration-300">
                        <i data-lucide="globe" class="w-5 h-5"></i>
                        <span>English</span>
                    </div>
                </div>
            </div>
        </footer>
    </div>






    {{-- ... keep your remaining sections unchanged, just swap assets to asset('...') and internal links to route() where relevant ... --}}

    <!-- Footer remains the same, swap paths to asset() as shown above -->

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
    {{-- <button id="themeToggle"
        class="fixed bottom-20 right-6 z-[60] inline-flex items-center justify-center w-10 h-10 rounded-full
         bg-white/90 dark:bg-gray-800/90 backdrop-blur
         border border-gray-200 dark:border-gray-700
         shadow-lg hover:bg-white dark:hover:bg-gray-700
         transition-colors"
        aria-label="Toggle theme" type="button">
        <i data-lucide="moon" class="w-5 h-5 dark:hidden"></i>
        <i data-lucide="sun" class="w-5 h-5 hidden dark:inline"></i>
    </button> --}}
@endsection
