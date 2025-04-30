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
                                    <span class="pl-1.5">+91 9511117684</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="hover:text-[#1D1C1E] transition duration-300 ease-in-out cursor-pointer flex items-center">
                                    <span>
                                        <i class="fa-regular fa-envelope"></i>
                                    </span>
                                    <span class="pl-1.5">shweta@dataman.in</span>
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
                <div class="h-full w-full flex items-center justify-center bg-white/60">
                    <div class="container mx-auto px-4 h-full">
                        <div class="flex flex-col md:flex-row items-center justify-center h-full">
                            <!-- Left Content -->
                            <div class="w-full md:w-1/2 text-left mb-8 md:mb-0">
                                <h1 class="text-4xl md:text-5xl text-[#1D1C1E] font-bold"
                                    style="font-family: 'Rubik', sans-serif;">Auto Rice Mill Software</h1>
                                <p class="text-lg md:text-xl text-[#1D1C1E] mt-4" style="font-family: 'Rubik', sans-serif;">
                                    Use our cutting-edge Auto Rice Mill Software to transform your rice milling processes —
                                    from paddy to polished rice. Boost your productivity, maximize your earnings, and take
                                    complete control over your rice mill operations. With Auto Rice Mill Software, you’re on
                                    the smart path to milling success.
                                </p>
                                <!-- <a href="{{ route('login') }}" -->
                                <a href="#"
                                    class="mt-6 inline-block bg-[#F15A29] text-white py-2 px-6 rounded hover:bg-[#1D1C1E] transition duration-300 ease-in-out"
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

        <!-- Features Section -->

    </main>

    <footer>
        <p>&copy; 2023 Auto Rice Mill. All rights reserved.</p>
    </footer>

@endsection