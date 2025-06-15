@extends('layouts.guest')
@section('content')
<main>
    <!-- Hero Section -->
    <section class="">
        <div class="bg-[#6A1A1F]">
            <!-- banner section  -->
            <div class="h-screen mx-auto h-full">
                <!-- heroSwiper -->
                <div class="swiper heroSwiper h-full">
                    <div class="swiper-wrapper">
                        <!-- Slide 1 -->
                        <div class="swiper-slide">
                            <div class="h-full w-full flex items-center bg-cover bg-center"
                                style="background-image: url('https://raipurautoricemills.com/public/assets/images/Slider-01.jpg');">
                                <div class="w-full h-auto flex flex-col md:flex-row items-center justify-center px-4">
                                    <div data-aos="zoom-in" class="w-full md:w-[660px] bg-white/70 p-6 md:p-8 rounded-lg shadow-lg">
                                        <h2 class=" text-black text-xl sm:text-2xl md:text-3xl font-bold leading-9 mb-4 ">
                                            Welcome To Auto Ricemill Accounting Software </h2>
                                        <h1 class="text-[#6A1A1F] text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-wide mb-4"> 
                                            Our Latest Item <br> Food Industry
                                        </h1>
                                        <p class="text-black text-sm sm:text-base md:text-lg font-medium leading-7 mb-6">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the...
                                        </p>
                                        <a href="{{ auth()->check() ? route('dashboard') : route('login') }}" class="border border-black px-6 py-2 text-sm md:text-base font-medium text-[#6A1A1F] hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out">
                                            View Software
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Slide 2 -->
                        <div class="swiper-slide">
                            <div class="h-full w-full flex items-center bg-cover bg-center"
                                style="background-image: url('https://raipurautoricemills.com/public/assets/images/Slider-06.jpg');">
                                <div class="w-full h-auto flex flex-col md:flex-row items-center justify-center px-4">
                                    <div  class="w-full md:w-[660px] bg-white/70 p-6 md:p-8 rounded-lg shadow-lg">
                                        <h2 class=" text-black text-xl sm:text-2xl md:text-3xl font-bold leading-9 mb-4">
                                            Welcome To Food Industry
                                        </h2>
                                        <h1 class=" text-[#6A1A1F] text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-wide mb-4">
                                            Our Latest Item <br> Food Industry
                                        </h1>
                                        <p class="text-black text-sm sm:text-base md:text-lg font-medium leading-7 mb-6">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                                            Ipsum has been the...
                                        </p>
                                        <a href="{{ auth()->check() ? route('dashboard') : route('login') }}"
                                            class="border border-black px-6 py-2 text-sm md:text-base font-medium text-[#6A1A1F] hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out">
                                            View Software
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Content Section -->
            <div class="py-12.5">
                <div class="container mx-auto px-3">
                    <div class="flex flex-col md:flex-row items-center gap-5 md:gap-0 text-white">
                        <!-- Left Content -->
                        <div class="px-3 md:w-3/4">
                            <h2 class="text-xl md:text-2xl lg:text-3xl font-semibold leading-7 md:leading-11 m-1.5 text-center md:text-left">Amazing things happen to your business </h2>
                            <p class="leading-7 text-sm lg:text-base text-center md:text-left">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                        </div>
                        <!-- Right Content -->
                        <div class="px-3 md:w-1/4 flex items-center justify-end">
                            <a href="#contact" class="px-6 py-2 sm:px-7.5 sm:py-3 border-2 border-white text-xs sm:text-sm font-semibold text-center rounded-full hover:bg-white hover:text-[#6A1A1F] transition duration-300 ease-in-out">Contact Us </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Quality Products -->
    <section>
        <div class="container mx-auto px-3 md:px-7.5 lg:px-20 py-6 lg:py-12.5">
            <div class="flex flex-col md:flex-row items-center">
                <!-- Left Content -->
                <div data-aos="fade-right" data-aos-duration="3000" class="h-full w-full md:w-1/2 flex justify-center items-center px-3">
                    <div class="mb-7.5 md:py-5 md:pr-6.5  md:bg-[#F8991D] rounded-lg w-full h-full">
                        <div class="md:ml-[-15px] lg:ml-[-20px] w-full h-full">
                            <!-- Swiper Slider -->
                            <div class="swiper qualityProductsSwiper rounded-lg">
                                <div class="swiper-wrapper">
                                    <div class="swiper-slide">
                                        <img src="{{ asset('assets/pic1.jpg') }}" alt="Quality Products" class="rounded-lg">
                                    </div>
                                    <div class="swiper-slide">
                                        <img src="{{ asset('assets/pic2.jpg') }}" alt="Quality Products" class="rounded-lg">
                                    </div>
                                    <div class="swiper-slide">
                                        <img src="{{ asset('assets/pic3.jpg') }}" alt="Quality Products" class="rounded-lg">
                                    </div>
                                    <div class="swiper-slide">
                                        <img src="{{ asset('assets/pic4.jpg') }}" alt="Quality Products" class="rounded-lg">
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Right Content -->
                <div data-aos="fade-left" data-aos-duration="3000" class="h-full w-full md:w-1/2 flex justify-center items-center lg:px-3">
                    <div class="md:pl-4.5 lg:pl-7.5 h-full">
                        <div class="mb-3.5 lg:mb-7.5">
                            <h2 class="text-2xl md:text-3xl lg:text-6xl leading-tight font-semibold mb-2 lg:mb-4 text-center md:text-left">
                                Quality Products With Sweet Eggs & Breads
                            </h2>
                            <p class="lg:pt-2.5 text-sm sm:text-base lg:text-lg text-[#494949] leading-7 mb-3 lg:mb-6 text-center md:text-left">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent molestie nec nisl eget scelerisque. Quisque placerat suscipit eros, eu tincidunt tellus blandit vel. Donec pellentesque dapibus interdum. Mauris et tellus congue, rutrum neque a, varius felis.
                            </p>
                        </div>
                        <div class="flex flex-row gap-3 justify-center ">
                            <a href="#contact"
                                class="bg-[#171717] text-white text-sm py-3 px-7.5 font-semibold rounded hover:bg-gray-800 transition duration-300">
                                Contact us
                            </a>
                            <a href="#contact"
                                class="bg-[#171717] text-white text-sm py-3 px-7.5 font-semibold rounded hover:bg-gray-800 transition duration-300">
                                Inquire
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Our Latest Items -->
    <section>
        <div class="bg-[#6A1A1F] flex flex-col lg:flex-row items-center justify-center">
            <div data-aos="fade-right" data-aos-duration="3000" class="h-full lg:w-1/2 h-full">
                <div>
                    <div class="overflow-hidden">
                        <img class="w-full hover:scale-110 transition-transform duration-500 ease-in-out"
                            src="{{ asset('assets/pic7.jpg') }}" alt="">
                        <!-- <img class="w-full hover:scale-110 transition-transform duration-500 ease-in-out"
                            src="https://raipurautoricemills.com/public/assets/images/rarm-export-procedure.jpg" alt=""> -->
                    </div>
                </div>
                <div class="flex flex-col md:flex-row items-center justify-center">
                    <div class="overflow-hidden">
                        <img class="w-full hover:scale-110 transition-transform duration-500 ease-in-out"
                            src="{{ asset('assets/pic5.jpg') }}" alt="">
                    </div>
                    <div class="overflow-hidden">
                        <img class="w-full hover:scale-110 transition-transform duration-500 ease-in-out"
                            src="{{ asset('assets/pic6.jpg') }}" alt="">
                    </div>
                </div>
            </div>
            <div data-aos="fade-left" data-aos-duration="3000" class="h-full lg:w-1/2 h-full p-5 md:px-20 lg:px-32.5 md:py-12 lg:py-25">
                <div class="w-full h-full text-white">
                    <h2 class="text-2xl md:text-4xl lg:text-5xl leading-14.5 mb-6 font-medium">Our Latest Item Food Industry</h2>
                    <p class="leading-7 text-sm lg:text-[15px] mb-6 text-left text-[#ffffffbf]">
                        Praesent pharetra orci odio, ut mattis tellus ullamcorper ornare. Suspendisse ullamcorper 
                        <span class="text-white">metus in erat viverra</span> , vehicula pharetra dolor accumsan. In arcu ex, rutrum finibus malesuada vel. Praesent pharetra orci odio, ut mattis tellus ullamcorper ornare. Suspendisse ullamcorper <span class="text-white">metus in erat viverra</span> , vehicula pharetra dolor accumsan. In arcu ex, rutrum finibus malesuada vel.
                    </p>
                    <a href="{{ auth()->check() ? route('dashboard') : route('login') }}" class="bg-white text-[#555] text-[13px] font-semibold text-center cursor-pointer px-7.5 py-3 rounded hover:bg-gray-100 hover:text-[#333] hover:scale-105 transition-transform duration-300 ease-in-out"> View Project </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Our Gallery -->
    <section>
        <div class="md:py-10 my-10 lg:py-20">
            <div class="container mx-auto px-3">

                <div data-aos="fade-up" class="mb-12.5 text-center">
                    <h2 class="mb-1.5 text-4xl leading-11 font-semibold">Our Gallery</h2>
                    <p class="md:mx-7.5 lg:mx-60 mb-6 pt-2.5 leading-7 text-sm md:text-base text-[#494949]">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry has been the industry's standard dummy text ever since the been when an unknown printer.
                    </p>
                </div>

                <!-- Filter Buttons -->
                <div>
                    <div data-aos="fade-down" class="px-3">
                        <div class="mb-7.5">
                            <ul class="flex flex-wrap gap-2.5 items-center justify-center">
                                <li class="mb-0.5">
                                    <a href="#" data-filter="all"
                                        class="filter-btn px-5 py-1 mr-1 mb-1 border-2 border-[#6A1A1F] text-sm font-semibold text-[#6A1A1F] rounded hover:bg-[#6A1A1F] hover:text-white transition duration-300 ease-in-out active:bg-[#6A1A1F] active:text-white">
                                        <span>All</span>
                                    </a>
                                </li>
                                <li class="mb-0.5">
                                    <a href="#" data-filter="healthy-food"
                                        class="filter-btn px-5 py-1 mr-1 mb-1 border-2 border-[#6A1A1F] text-sm font-semibold text-[#6A1A1F] rounded hover:bg-[#6A1A1F] hover:text-white transition duration-300 ease-in-out active:bg-[#6A1A1F] active:text-white">
                                        <span>Healthy Food</span>
                                    </a>
                                </li>
                                <li class="mb-0.5">
                                    <a href="#" data-filter="food"
                                        class="filter-btn px-5 py-1 mr-1 mb-1 border-2 border-[#6A1A1F] text-sm font-semibold text-[#6A1A1F] rounded hover:bg-[#6A1A1F] hover:text-white transition duration-300 ease-in-out active:bg-[#6A1A1F] active:text-white">
                                        <span>Food</span>
                                    </a>
                                </li>
                                <li class="mb-0.5">
                                    <a href="#" data-filter="organic"
                                        class="filter-btn px-5 py-1 mr-1 mb-1 border-2 border-[#6A1A1F] text-sm font-semibold text-[#6A1A1F] rounded hover:bg-[#6A1A1F] hover:text-white transition duration-300 ease-in-out active:bg-[#6A1A1F] active:text-white">
                                        <span>Organic</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Gallery -->
                <div>
                    <div class="px-2">
                        <ul class="flex flex-wrap items-center justify-center lg:justify-start gallery">
                            <li data-aos="zoom-in" data-aos-duration="1000" class="px-2 mb-3.5" data-category="healthy-food">
                                <div class="overflow-hidden rounded-lg shadow-lg">
                                    <img width="279" height="336" src="{{ asset('assets/pic1.jpg') }}" alt="" class="hover:scale-120 transition-transform duration-500 ease-in-out">
                                </div>
                            </li>
                            <li data-aos="zoom-in" data-aos-duration="1000" class="px-2 mb-3.5" data-category="food">
                                <div class="overflow-hidden rounded-lg shadow-lg">
                                    <img width="279" height="336" src="{{ asset('assets/pic2.jpg') }}" alt="" class="hover:scale-120 transition-transform duration-500 ease-in-out">
                                </div>
                            </li>
                            <li data-aos="zoom-in" data-aos-duration="1000" class="px-2 mb-3.5" data-category="organic">
                                <div class="overflow-hidden rounded-lg shadow-lg">
                                    <img width="279" height="336" src="{{ asset('assets/pic3.jpg') }}" alt="" class="hover:scale-120 transition-transform duration-500 ease-in-out">
                                </div>
                            </li>
                            <li data-aos="zoom-in" data-aos-duration="1000" class="px-2 mb-3.5" data-category="healthy-food">
                                <div class="overflow-hidden rounded-lg shadow-lg">
                                    <img width="279" height="336" src="{{ asset('assets/pic4.jpg') }}" alt="" class="hover:scale-120 transition-transform duration-500 ease-in-out">
                                </div>
                            </li>
                            <li data-aos="zoom-in" data-aos-duration="1000" class="px-2 mb-3.5" data-category="healthy-food">
                                <div class="overflow-hidden rounded-lg shadow-lg">
                                    <img width="279" height="336" src="{{ asset('assets/pic1.jpg') }}" alt="" class="hover:scale-120 transition-transform duration-500 ease-in-out">
                                </div>
                            </li>
                            <li data-aos="zoom-in" data-aos-duration="1000" class="px-2 mb-3.5" data-category="food">
                                <div class="overflow-hidden rounded-lg shadow-lg">
                                    <img width="279" height="336" src="{{ asset('assets/pic2.jpg') }}" alt="" class="hover:scale-120 transition-transform duration-500 ease-in-out">
                                </div>
                            </li>
                            <li data-aos="zoom-in" data-aos-duration="1000" class="px-2 mb-3.5" data-category="organic">
                                <div class="overflow-hidden rounded-lg shadow-lg">
                                    <img width="279" height="336" src="{{ asset('assets/pic3.jpg') }}" alt="" class="hover:scale-120 transition-transform duration-500 ease-in-out">
                                </div>
                            </li>
                            <li data-aos="zoom-in" data-aos-duration="1000" class="px-2 mb-3.5" data-category="healthy-food">
                                <div class="overflow-hidden rounded-lg shadow-lg">
                                    <img width="279" height="336" src="{{ asset('assets/pic4.jpg') }}" alt="" class="hover:scale-120 transition-transform duration-500 ease-in-out">
                                </div>
                            </li>
                            <li data-aos="zoom-in" data-aos-duration="1000" class="px-2 mb-3.5" data-category="healthy-food">
                                <div class="overflow-hidden rounded-lg shadow-lg">
                                    <img width="279" height="336" src="{{ asset('assets/pic1.jpg') }}" alt="" class="hover:scale-120 transition-transform duration-500 ease-in-out">
                                </div>
                            </li>
                            <li data-aos="zoom-in" data-aos-duration="1000" class="px-2 mb-3.5" data-category="food">
                                <div class="overflow-hidden rounded-lg shadow-lg">
                                    <img width="279" height="336" src="{{ asset('assets/pic2.jpg') }}" alt="" class="hover:scale-120 transition-transform duration-500 ease-in-out">
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- Software Modules  -->
    <section>
        <div class="bg-[#6A1A1F] py-10 sm:py-12 md:py-16 lg:py-20 px-5 sm:px-10 md:px-16 lg:px-28">
            <div class="container mx-auto">

                <div data-aos="fade-up" class="mb-12.5 text-center">
                    <h2 class="mb-1.5 text-4xl leading-11 font-semibold text-white">Auto Rice Mill Software Modules</h2>
                    <p class="md:mx-7.5 lg:mx-60 mb-6 pt-2.5 leading-7 text-sm md:text-base text-white">Explore the comprehensive modules of Auto Rice Mill Software designed to streamline your operations.</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <!-- Item 1 -->
                    <div class="px-3 mb-7.5">
                        <div data-aos="zoom-in" class="w-full h-full bg-white rounded shadow-lg px-5 sm:px-7.5 py-8 sm:py-12.5 text-center flex flex-col items-center justify-center">
                            <div class="group w-20 sm:w-24 h-20 sm:h-24 mb-4 bg-[#F7F3F4] flex items-center justify-center rounded-xl overflow-hidden" style="transform: rotate(30deg);">
                                <i class="fa-solid fa-circle-info text-[#6A1A1F] object-cover group-hover:scale-150 transition-transform duration-500 ease-in-out" style="transform: rotate(-30deg); font-size: 2rem;"></i>
                            </div>
                            <div>
                                <h3 class="text-lg sm:text-xl font-semibold mb-2">Account Info</h3>
                                <p class="text-gray-600 text-sm sm:text-base">Account Ledgers, Salesmen, Account Groups</p>
                            </div>
                        </div>
                    </div>
                    <!-- Item 2 -->
                    <div class="px-3 mb-7.5">
                        <div data-aos="zoom-in" class="w-full h-full bg-white rounded shadow-lg px-5 sm:px-7.5 py-8 sm:py-12.5 text-center flex flex-col items-center justify-center">
                            <div class="group w-20 sm:w-24 h-20 sm:h-24 mb-4 bg-[#F7F3F4] flex items-center justify-center rounded-xl overflow-hidden" style="transform: rotate(30deg);">
                                <i class="fa-solid fa-boxes-stacked text-[#6A1A1F] object-cover group-hover:scale-150 transition-transform duration-500 ease-in-out" style="transform: rotate(-30deg); font-size: 2rem;"></i>
                            </div>
                            <div>
                                <h3 class="text-lg sm:text-xl font-semibold mb-2">Inventory Info</h3>
                                <p class="text-gray-600 text-sm sm:text-base">Godowns, Units, Category, Items</p>
                            </div>
                        </div>
                    </div>
                    <!-- Item 3 -->
                    <div class="px-3 mb-7.5">
                        <div data-aos="zoom-in" class="w-full h-full bg-white rounded shadow-lg px-5 sm:px-7.5 py-8 sm:py-12.5 text-center flex flex-col items-center justify-center">
                            <div class="group w-20 sm:w-24 h-20 sm:h-24 mb-4 bg-[#F7F3F4] flex items-center justify-center rounded-xl overflow-hidden" style="transform: rotate(30deg);">
                                <i class="fa-solid fa-money-check-dollar text-[#6A1A1F] object-cover group-hover:scale-150 transition-transform duration-500 ease-in-out" style="transform: rotate(-30deg); font-size: 2rem;"></i>
                            </div>
                            <div>
                                <h3 class="text-lg sm:text-xl font-semibold mb-2">Transaction</h3>
                                <p class="text-gray-600 text-sm sm:text-base">Purchases, Purchases Return, Sales Add List, Sales Order & List, Sales Return, Received Modes, Received Add, Payment Add, Contra Add, Journal Add, Stock Transfer</p>
                            </div>
                        </div>
                    </div>
                    <!-- Item 4 -->
                    <div class="px-3 mb-7.5">
                        <div data-aos="zoom-in" class="w-full h-full bg-white rounded shadow-lg px-5 sm:px-7.5 py-8 sm:py-12.5 text-center flex flex-col items-center justify-center">
                            <div class="group w-20 sm:w-24 h-20 sm:h-24 mb-4 bg-[#F7F3F4] flex items-center justify-center rounded-xl overflow-hidden" style="transform: rotate(30deg);">
                                <i class="fa-solid fa-industry text-[#6A1A1F] object-cover group-hover:scale-150 transition-transform duration-500 ease-in-out" style="transform: rotate(-30deg); font-size: 2rem;"></i>
                            </div>
                            <div>
                                <h3 class="text-lg sm:text-xl font-semibold mb-2">Production</h3>
                                <p class="text-gray-600 text-sm sm:text-base">Working Order, Finished Products</p>
                            </div>
                        </div>
                    </div>
                    <!-- Item 5 -->
                    <div class="px-3 mb-7.5">
                        <div data-aos="zoom-in" class="w-full h-full bg-white rounded shadow-lg px-5 sm:px-7.5 py-8 sm:py-12.5 text-center flex flex-col items-center justify-center">
                            <div class="group w-20 sm:w-24 h-20 sm:h-24 mb-4 bg-[#F7F3F4] flex items-center justify-center rounded-xl overflow-hidden" style="transform: rotate(30deg);">
                                <i class="fa-solid fa-gear text-[#6A1A1F] object-cover group-hover:scale-150 transition-transform duration-500 ease-in-out" style="transform: rotate(-30deg); font-size: 2rem;"></i>
                            </div>
                            <div>
                                <h3 class="text-lg sm:text-xl font-semibold mb-2">Payroll</h3>
                                <p class="text-gray-600 text-sm sm:text-base">Departament, Designation, Shift, Employees, Salary Payment, Salary Receive, Employee Report</p>
                            </div>
                        </div>
                    </div>
                    <!-- Item 6 -->
                    <div class="px-3 mb-7.5">
                        <div data-aos="zoom-in" class="w-full h-full bg-white rounded shadow-lg px-5 sm:px-7.5 py-8 sm:py-12.5 text-center flex flex-col items-center justify-center">
                            <div class="group w-20 sm:w-24 h-20 sm:h-24 mb-4 bg-[#F7F3F4] flex items-center justify-center rounded-xl overflow-hidden" style="transform: rotate(30deg);">
                                <i class="fa-solid fa-chart-column text-[#6A1A1F] object-cover group-hover:scale-150 transition-transform duration-500 ease-in-out" style="transform: rotate(-30deg); font-size: 2rem;"></i>
                            </div>
                            <div>
                                <h3 class="text-lg sm:text-xl font-semibold mb-2">Reports</h3>
                                <p class="text-gray-600 text-sm sm:text-base">Stock Report, Day Book, Account Book, Ledger Group Summary, Purchase Report, Sale Report</p>
                            </div>
                        </div>
                    </div>
                    <!-- Item 7 -->
                    <div class="px-3 mb-7.5">
                        <div data-aos="zoom-in" class="w-full h-full bg-white rounded shadow-lg px-5 sm:px-7.5 py-8 sm:py-12.5 text-center flex flex-col items-center justify-center">
                            <div class="group w-20 sm:w-24 h-20 sm:h-24 mb-4 bg-[#F7F3F4] flex items-center justify-center rounded-xl overflow-hidden" style="transform: rotate(30deg);">
                                <i class="fa-solid fa-sliders text-[#6A1A1F] object-cover group-hover:scale-150 transition-transform duration-500 ease-in-out" style="transform: rotate(-30deg); font-size: 2rem;"></i>
                            </div>
                            <div>
                                <h3 class="text-lg sm:text-xl font-semibold mb-2">Settings</h3>
                                <p class="text-gray-600 text-sm sm:text-base">Financial Year, Company Settings</p>
                            </div>
                        </div>
                    </div>
                    <!-- Item 8 -->
                    <div class="px-3 mb-7.5">
                        <div data-aos="zoom-in" class="w-full h-full bg-white rounded shadow-lg px-5 sm:px-7.5 py-8 sm:py-12.5 text-center flex flex-col items-center justify-center">
                            <div class="group w-20 sm:w-24 h-20 sm:h-24 mb-4 bg-[#F7F3F4] flex items-center justify-center rounded-xl overflow-hidden" style="transform: rotate(30deg);">
                                <i class="fa-solid fa-lock text-[#6A1A1F] object-cover group-hover:scale-150 transition-transform duration-500 ease-in-out" style="transform: rotate(-30deg); font-size: 2rem;"></i>
                            </div>
                            <div>
                                <h3 class="text-lg sm:text-xl font-semibold mb-2">Permissions</h3>
                                <p class="text-gray-600 text-sm sm:text-base">permissions for secure access control across modules.</p>
                            </div>
                        </div>
                    </div>
                    <!-- Item 9 -->
                    <div class="px-3 mb-7.5">
                        <div data-aos="zoom-in" class="w-full h-full bg-white rounded shadow-lg px-5 sm:px-7.5 py-8 sm:py-12.5 text-center flex flex-col items-center justify-center">
                            <div class="group w-20 sm:w-24 h-20 sm:h-24 mb-4 bg-[#F7F3F4] flex items-center justify-center rounded-xl overflow-hidden" style="transform: rotate(30deg);">
                                <i class="fa-solid fa-shield text-[#6A1A1F] object-cover group-hover:scale-150 transition-transform duration-500 ease-in-out" style="transform: rotate(-30deg); font-size: 2rem;"></i>
                            </div>
                            <div>
                                <h3 class="text-lg sm:text-xl font-semibold mb-2">Roles</h3>
                                <p class="text-gray-600 text-sm sm:text-base">Define and manage user roles for your team members.</p>
                            </div>
                        </div>
                    </div>
                    <!-- Item 10 -->
                    <div class="px-3 mb-7.5">
                        <div data-aos="zoom-in" class="w-full h-full bg-white rounded shadow-lg px-5 sm:px-7.5 py-8 sm:py-12.5 text-center flex flex-col items-center justify-center">
                            <div class="group w-20 sm:w-24 h-20 sm:h-24 mb-4 bg-[#F7F3F4] flex items-center justify-center rounded-xl overflow-hidden" style="transform: rotate(30deg);">
                                <i class="fa-solid fa-user text-[#6A1A1F] object-cover group-hover:scale-150 transition-transform duration-500 ease-in-out" style="transform: rotate(-30deg); font-size: 2rem;"></i>
                            </div>
                            <div>
                                <h3 class="text-lg sm:text-xl font-semibold mb-2">Users</h3>
                                <p class="text-gray-600 text-sm sm:text-base">Manage user accounts and access levels.</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials -->
    <section class="bg-white">
        <div class="container text-black mx-auto px-4 py-8 md:py-14">
            <div  class="p-2.5">
                <!-- Heading -->
                <h2 class="leading-[38px] text-2xl sm:text-3xl md:text-[40px] font-bold text-center my-2.5">
                    Testimonials
                </h2>
                <p class="text-center text-sm leading-6.5 md:text-base px-2.5 md:px-14 lg:px-56">There are many variations of passages of Lorem Ipsum typesetting industry has been the industry's standard dummy text ever since the been when an unknown printer.</p>
            </div>

            <!-- Swiper Testimonials -->
            <div class=" swiper testimonialsSwiper mt-10">
                <div class="swiper-wrapper">
                    <!-- Testimonial 1 -->
                    <div class="swiper-slide">
                        <div class="md:px-12 lg:px-20 flex flex-col md:flex-row justify-center">
                            <div class="w-full md:w-1/3 flex items-center justify-center">
                                <img width="250" height="300" src="{{ asset('assets/Our-team/pic1.jpg') }}" class="rounded-xl" alt="">
                            </div>
                            <div class="w-full md:w-2/3 text-left  flex items-center mb-4">
                                <div class="px-2.5 text-center md:text-left">
                                    <p class="text-lg lg:leading-8 italic font-normal mx-auto">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the when an printer took a galley of type and scrambled it to make [...]
                                    </p>
                                    <div class="mt-4">
                                        <div class="text-xl leading-7.5 font-medium mb-1.5">Silviia Garden</div>
                                        <div class="text-sm">Customer</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Testimonial 2 -->
                    <div class="swiper-slide">
                        <div class="md:px-12 lg:px-20 flex flex-col md:flex-row justify-center">
                            <div class="w-full md:w-1/3 flex items-center justify-center">
                                <img width="250" height="300" src="{{ asset('assets/Our-team/pic2.jpg') }}" class="rounded-xl" alt="">
                            </div>
                            <div class="w-full md:w-2/3 text-left  flex items-center mb-4">
                                <div class="px-2.5 text-center md:text-left">
                                    <p class="text-lg lg:leading-8 italic font-normal mx-auto">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the when an printer took a galley of type and scrambled it to make [...]
                                    </p>
                                    <div class="mt-4">
                                        <div class="text-xl leading-7.5 font-medium mb-1.5">Silviia Garden</div>
                                        <div class="text-sm">Customer</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Testimonial 3 -->
                    <div class="swiper-slide">
                        <div class="md:px-12 lg:px-20 flex flex-col md:flex-row justify-center">
                            <div class="w-full md:w-1/3 flex items-center justify-center">
                                <img width="250" height="300" src="{{ asset('assets/Our-team/pic3.jpg') }}" class="rounded-xl" alt="">
                            </div>
                            <div class="w-full md:w-2/3 text-left  flex items-center mb-4">
                                <div class="px-2.5 text-center md:text-left">
                                    <p class="text-lg lg:leading-8 italic font-normal mx-auto">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the when an printer took a galley of type and scrambled it to make [...]
                                    </p>
                                    <div class="mt-4">
                                        <div class="text-xl leading-7.5 font-medium mb-1.5">Silviia Garden</div>
                                        <div class="text-sm">Customer</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Navigation buttons -->
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        </div>
    </section>
</main>
@endsection