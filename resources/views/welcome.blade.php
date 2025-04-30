@extends('layouts.guest')

@section('content')

    <header>
        <!-- nav bar top  -->
        <nav class="bg-[#F15A29]">
            <section class="py-2">
                <div class="mx-36">
                    <div class="px-4">
                        <ul class="flex items-center justify-center text-white font-normal" style="font-family: 'Rubik', sans-serif;">
                            <li class="mx-2">
                                <a href="#" class="hover:text-[#1D1C1E] transition duration-300 ease-in-out cursor-pointer">
                                    <span>
                                        <i class="fa-solid fa-phone"></i>
                                    </span>
                                    <span class="pl-1.5">+91 9511117684</span>
                                </a>
                            </li>
                            <li class="mx-2">
                                <a href="#" class="hover:text-[#1D1C1E] transition duration-300 ease-in-out cursor-pointer">
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
        <!-- Main Nav bar  -->
        <nav class="h-[108px]">
            <div class="h-full">
                <div class="mp-[14px] h-full">
                    <div class="h-full">
                        <section class="px-5.5 h-full">
                            <div class="h-full flex items-center justify-between">
                                <div class="h-full w-1/2 flex items-center">
                                    <img src="{{ asset('assets\Auto Rice Mill.png') }}" alt="Logo" class="h-14" />
                                </div>
                                <div class="h-full w-1/2 flex items-center">
                                    <nav class="text-[#1D1C1E] list-none flex items-center justify-end h-full w-full gap-5">
                                        <li>
                                            <a href="{{ route('dashboard') }}" class="font-normal hover:text-[#F15A29] transition duration-300 ease-in-out" style="font-family: 'Rubik', sans-serif;">Dashboard</a>
                                        </li>
                                        <li>
                                            <a href="{{ route('login') }}" class="font-normal hover:text-[#F15A29] transition duration-300 ease-in-out" style="font-family: 'Rubik', sans-serif;">Log in</a>
                                        </li>
                                        <li>
                                            <a href="{{ route('register') }}" class=" font-normal hover:text-[#F15A29] transition duration-300 ease-in-out" style="font-family: 'Rubik', sans-serif;">Register</a>
                                        </li>
                                    </nav>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <main>
        
    </main>

    <footer>
        <p>&copy; 2023 Auto Rice Mill. All rights reserved.</p>
    </footer>

@endsection