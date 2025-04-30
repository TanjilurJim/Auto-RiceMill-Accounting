@extends('layouts.guest')

@section('content')

    <header>
        <!-- nav bar top -->
        <nav class="bg-[#F15A29]">
            <section class="py-2">
                <div class="container mx-auto px-4">
                    <div class="flex flex-col sm:flex-row items-center justify-center text-white font-normal" style="font-family: 'Rubik', sans-serif;">
                        <ul class="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <li>
                                <a href="#" class="hover:text-[#1D1C1E] transition duration-300 ease-in-out cursor-pointer flex items-center">
                                    <span>
                                        <i class="fa-solid fa-phone"></i>
                                    </span>
                                    <span class="pl-1.5">+880 1700001177</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="hover:text-[#1D1C1E] transition duration-300 ease-in-out cursor-pointer flex items-center">
                                    <span>
                                        <i class="fa-regular fa-envelope"></i>
                                    </span>
                                    <span class="pl-1.5">autoricemillsoftware@gmial.com</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </nav>
        <!-- Main Nav bar -->
        <nav class="lg:h-[108px] bg-white shadow-md">
            <div class="h-full">
                <div class="h-full px-4 md:px-8 lg:px-16">
                    <div class="h-full flex flex-col md:flex-row items-center justify-between">
                        <!-- Logo Section -->
                        <div class="h-full w-full md:w-1/2 flex items-center justify-center md:justify-start mb-4 md:mb-0">
                            <img src="{{ asset('assets/Auto Rice Mill.png') }}" alt="Logo" class="h-14">
                        </div>
                        <!-- Navigation Links -->
                        <div class="h-full w-full md:w-1/2 flex items-center justify-center md:justify-end">
                            <ul class="text-[#1D1C1E] list-none flex flex-col md:flex-row items-center gap-4 md:gap-6">
                                <li>
                                    <a href="{{ route('dashboard') }}" class="font-normal hover:text-[#F15A29] transition duration-300 ease-in-out" style="font-family: 'Rubik', sans-serif;">Dashboard</a>
                                </li>
                                <li>
                                    <a href="{{ route('login') }}" class="font-normal hover:text-[#F15A29] transition duration-300 ease-in-out" style="font-family: 'Rubik', sans-serif;">Log in</a>
                                </li>
                                <li>
                                    <a href="{{ route('register') }}" class="font-normal hover:text-[#F15A29] transition duration-300 ease-in-out" style="font-family: 'Rubik', sans-serif;">Register</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <main>

        <!-- Hero Section -->
        <section>
            <div class=" bg-cover bg-center"
                style="background-image: url('{{ asset('assets/Auto Rice Mill.jpg') }}'); background-size: cover; height: 100vh;">
                <div class="h-full w-full flex items-center justify-center bg-white/50">
                    <div class="container mx-auto px-4 h-full">
                        <div class="flex flex-col md:flex-row items-center justify-center h-full">
                            <!-- Left Content -->
                            <div class="w-full md:w-1/2 text-left mb-8 md:mb-0">
                                <h1 class="text-3xl md:text-5xl text-[#1D1C1E] font-bold"
                                    style="font-family: 'Rubik', sans-serif;">Auto Rice Mill Software</h1>
                                <p class="text-base md:text-xl text-[#1D1C1E] mt-4" style="font-family: 'Rubik', sans-serif;">
                                    Use our cutting-edge Auto Rice Mill Software to transform your rice milling processes —
                                    from paddy to polished rice. Boost your productivity, maximize your earnings, and take
                                    complete control over your rice mill operations. With Auto Rice Mill Software, you’re on
                                    the smart path to milling success.
                                </p>
                                <!-- <a href="{{ route('login') }}" -->
                                <a href="#"
                                    class="mt-6 inline-block bg-[#F15A29] text-white hover:text-[#F15A29] py-2 px-6 rounded hover:bg-[#1D1C1E] transition duration-300 ease-in-out"
                                    style="font-family: 'Rubik', sans-serif;">Get Started</a>
                            </div>
                            <!-- Right Content -->
                            <div class="w-full md:w-1/2 text-center">
                                <!-- Add any additional content or images here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="my-20">
            <div class="container mx-auto px-4 md:px-8 lg:px-16">
                <div class="text-center">
                    <h2 class="text-2xl md:text-3xl font-bold text-[#1D1C1E] mb-6" style="font-family: 'Rubik', sans-serif;">Auto Rice Mill Software</h2>
                </div>
                <div class="grid grid-cols-1">
                    <div class="text-center grid gap-5">
                        <p class="text-base md:text-lg text-[#1D1C1E]" style="font-family: 'Rubik', sans-serif;">
                            Auto Rice Mill Software is an all-in-one solution designed to efficiently manage the daily operations of a rice milling business. It helps automate and streamline key processes like inventory management, production planning, quality control, sales and distribution, and financial accounting — making day-to-day management faster, easier, and more accurate. Our advanced accounting system handles everything from transaction recording to financial reporting, ensuring precise expense tracking and optimized cash flow. With Auto Rice Mill Software, rice mill owners gain full control over their operations, reduce manual errors, and boost overall business profitability

                        </p>
                        <p class="text-base md:text-lg text-[#1D1C1E]" style="font-family: 'Rubik', sans-serif;">
                            Rice Mill inventory management software allows you to efficiently track and control inventory movements, monitor stock levels, automate replenishment, and optimize warehouse operations. Our Rice Mill ERP system integrates procurement, production, inventoryAuto Rice Mill Software offers a powerful inventory management system that allows you to efficiently track and control inventory movements, monitor stock levels, automate stock replenishment, and optimize warehouse operations. Our integrated ERP system connects every part of your rice milling business — including procurement, production, inventory, sales, and finance — into one seamless platform. Auto Rice Mill Software streamlines workflows, automates key processes, and enhances team collaboration to boost operational efficiency and profitability.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- features section  -->
        <section class="py-12">
            <div class="container mx-auto px-4 md:px-8 lg:px-16">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <!-- Left Content -->
                    <div>
                        <div class="mb-5">
                            <h2 class="text-2xl md:text-3xl font-extrabold leading-relaxed text-[#1D1C1E]"
                                style="font-family: 'Rubik', sans-serif;">
                                Auto Rice Mill Software - Features
                            </h2>
                        </div>
                        <div class="pt-6 pb-10 flex flex-col gap-4" style="font-family: 'Rubik', sans-serif;">
                            <p class="text-base md:text-lg text-[#1D1C1E] flex gap-2">
                                <img decoding="async" class="w-6 h-6"
                                    src="https://dataman.in/v2/wp-content/uploads/2023/03/check-mark-1.png" alt="">
                                State-of-the-art sales &amp; purchase modules
                            </p>
                            <p class="text-base md:text-lg text-[#1D1C1E] flex gap-2">
                                <img decoding="async" class="w-6 h-6"
                                    src="https://dataman.in/v2/wp-content/uploads/2023/03/check-mark-1.png" alt="">
                                User-friendly production module
                            </p>
                            <p class="text-base md:text-lg text-[#1D1C1E] flex gap-2">
                                <img decoding="async" class="w-6 h-6"
                                    src="https://dataman.in/v2/wp-content/uploads/2023/03/check-mark-1.png" alt=""> Export
                                module loaded with cutting-edge technology
                            </p>
                            <p class="text-base md:text-lg text-[#1D1C1E] flex gap-2">
                                <img decoding="async" class="w-6 h-6"
                                    src="https://dataman.in/v2/wp-content/uploads/2023/03/check-mark-1.png" alt=""> Super
                                accurate accounting and finance module
                            </p>
                            <p class="text-base md:text-lg text-[#1D1C1E] flex gap-2">
                                <img decoding="async" class="w-6 h-6"
                                    src="https://dataman.in/v2/wp-content/uploads/2023/03/check-mark-1.png" alt="">
                                Analytical-centric reporting system
                            </p>
                            <p class="text-base md:text-lg text-[#1D1C1E] flex gap-2">
                                <img decoding="async" class="w-6 h-6"
                                    src="https://dataman.in/v2/wp-content/uploads/2023/03/check-mark-1.png" alt=""> Fully
                                updated taxation module
                            </p>
                            <p class="text-base md:text-lg text-[#1D1C1E] flex gap-2">
                                <img decoding="async" class="w-6 h-6"
                                    src="https://dataman.in/v2/wp-content/uploads/2023/03/check-mark-1.png" alt=""> Multiple
                                site handling capability from one location
                            </p>
                            <p class="text-base md:text-lg text-[#1D1C1E] flex gap-2">
                                <img decoding="async" class="w-6 h-6"
                                    src="https://dataman.in/v2/wp-content/uploads/2023/03/check-mark-1.png" alt=""> No
                                complication payroll module
                            </p>
                        </div>
                    </div>
                    <!-- Right Content -->
                    <div class="flex justify-center">
                        <img decoding="async" width="600" height="428"
                            src="https://dataman.in/v2/wp-content/uploads/2023/03/rice-cultivation.webp" >
                    </div>
                </div>
            </div>
        </section>
        
    </main>

    <footer>
        <p>&copy; 2023 Auto Rice Mill. All rights reserved.</p>
    </footer>

@endsection