@extends('layouts.guest')

@section('content')

    <main>

        <!-- Hero Section -->
        <section>
            <div class=" bg-cover bg-center"
                style="background-image: url('{{ asset('assets/Auto Rice Mill.jpg') }}'); background-size: cover; height: 100vh;">
                <div class="h-full w-full flex items-center justify-center bg-[#1D1C1E]/50">
                    <div class="container mx-auto px-4 h-full">
                        <div class="flex flex-col md:flex-row items-center justify-center h-full">
                            <!-- Left Content -->
                            <div class="w-full md:w-1/2 text-left mb-8 md:mb-0 text-white" 
                            style="font-family: 'Rubik', sans-serif;">
                                <h1 class="text-3xl md:text-5xl font-bold">Auto Rice Mill Software</h1>
                                <p class="text-base md:text-xl mt-4" >
                                    Use our cutting-edge Auto Rice Mill Software to transform your rice milling processes —
                                    from paddy to polished rice. Boost your productivity, maximize your earnings, and take
                                    complete control over your rice mill operations. With Auto Rice Mill Software, you’re on
                                    the smart path to milling success.
                                </p>
                                <!-- <a href="{{ route('login') }}" -->
                                <a href="#" class="mt-6 inline-block bg-[#F15A29] text-white hover:text-[#F15A29] py-2 px-6 rounded hover:bg-[#1D1C1E] transition duration-300 ease-in-out" style="font-family: 'Rubik', sans-serif;">Get Started</a>
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

        <!-- about Software Section  -->
        <section class="my-20">
            <div class="container mx-auto px-4 md:px-8 lg:px-16">
                <div class="text-center">
                    <h2 class="text-2xl md:text-3xl font-bold text-[#F15A29] mb-6 underline" style="font-family: 'Rubik', sans-serif;"> Auto Rice Mill Software</h2>
                </div>
                <div class="grid grid-cols-1">
                    <div class="text-center grid gap-5">
                        <p class="text-base md:text-lg text-[#1D1C1E]" style="font-family: 'Rubik', sans-serif;">
                            Auto Rice Mill Software is an all-in-one solution designed to efficiently manage the daily operations of a rice milling business. It helps automate and streamline key processes like inventory management, production planning, quality control, sales and distribution, and financial accounting — making day-to-day management faster, easier, and more accurate. Our advanced accounting system handles everything from transaction recording to financial reporting, ensuring precise expense tracking and optimized cash flow. With Auto Rice Mill Software, rice mill owners gain full control over their operations, reduce manual errors, and boost overall business profitability

                        </p>
                        <!-- <p class="text-base md:text-lg text-[#1D1C1E]" style="font-family: 'Rubik', sans-serif;">
                            Rice Mill inventory management software allows you to efficiently track and control inventory movements, monitor stock levels, automate replenishment, and optimize warehouse operations. Our Rice Mill ERP system integrates procurement, production, inventoryAuto Rice Mill Software offers a powerful inventory management system that allows you to efficiently track and control inventory movements, monitor stock levels, automate stock replenishment, and optimize warehouse operations. Our integrated ERP system connects every part of your rice milling business — including procurement, production, inventory, sales, and finance — into one seamless platform. Auto Rice Mill Software streamlines workflows, automates key processes, and enhances team collaboration to boost operational efficiency and profitability.
                        </p> -->
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
                            <h2 class="text-2xl md:text-3xl font-extrabold leading-relaxed text-[#F15A29] underline"
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
                            <!-- <p class="text-base md:text-lg text-[#1D1C1E] flex gap-2">
                                <img decoding="async" class="w-6 h-6"
                                    src="https://dataman.in/v2/wp-content/uploads/2023/03/check-mark-1.png" alt=""> Fully
                                updated taxation module
                            </p> -->
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
                    <div class="flex justify-center bg-cover bg-center" style="background-image: url('{{ asset('assets/c530d708-brush.png') }}');">
                        <img decoding="async" width="600" height="428"
                            src="https://dataman.in/v2/wp-content/uploads/2023/03/rice-cultivation.webp" >
                        <!-- <img decoding="async" width="600" height="428"
                            src="{{ asset('assets/tax.png') }}" > -->
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Software Modules  -->
        <section class="py-12 bg-[#F9F9F9]" style="font-family: 'Rubik', sans-serif;">
            <div class="container mx-auto px-4 md:px-8 lg:px-16">
                <div class="text-center mb-8">
                    <h2 class="text-2xl md:text-3xl font-bold text-[#F15A29] mb-6 underline">
                        Auto Rice Mill Software Modules
                    </h2>
                    <p class="text-base md:text-lg text-[#1D1C1E]">
                        Explore the comprehensive modules of Auto Rice Mill Software designed to streamline your operations.
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <!-- Module 1 -->
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                        <h3 class="text-xl font-bold text-[#1D1C1E] mb-4">Account Info</h3>
                        <p class="text-base text-[#1D1C1E]">
                            Account Ledgers and Salesman.
                        </p>
                    </div>
                    <!-- Module 2 -->
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                        <h3 class="text-xl font-bold text-[#1D1C1E] mb-4">Inventory Info</h3>
                        <p class="text-base text-[#1D1C1E]">
                            Manage Godowns, Units, Categories, and Items efficiently.
                        </p>
                    </div>
                    <!-- Module 3 -->
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                        <h3 class="text-xl font-bold text-[#1D1C1E] mb-4">Transaction</h3>
                        <p class="text-base text-[#1D1C1E]">
                            Includes Purchases, Sales, Returns, Payments, Stock Transfers, and more.
                        </p>
                    </div>
                    <!-- Module 4 -->
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                        <h3 class="text-xl font-bold text-[#1D1C1E] mb-4">Production</h3>
                        <p class="text-base text-[#1D1C1E]">
                            Manage Working Orders and Finished Products.
                        </p>
                    </div>
                    <!-- Module 5 -->
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                        <h3 class="text-xl font-bold text-[#1D1C1E] mb-4">Payroll</h3>
                        <p class="text-base text-[#1D1C1E]">
                            Includes Departments, Designations, Shifts, Employees, Salary Payments, and Reports.
                        </p>
                    </div>
                    <!-- Module 6 -->
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                        <h3 class="text-xl font-bold text-[#1D1C1E] mb-4">Reports</h3>
                        <p class="text-base text-[#1D1C1E]">
                            Generate Stock Reports, Day Books, Account Books, Purchase Reports, and more.
                        </p>
                    </div>
                    <!-- Module 7 -->
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                        <h3 class="text-xl font-bold text-[#1D1C1E] mb-4">Settings</h3>
                        <p class="text-base text-[#1D1C1E]">
                            Configure Financial Year and Company Settings.
                        </p>
                    </div>
                    <!-- Module 8 -->
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                        <h3 class="text-xl font-bold text-[#1D1C1E] mb-4">Permissions</h3>
                        <p class="text-base text-[#1D1C1E]">
                            Manage user permissions for secure access control.
                        </p>
                    </div>
                    <!-- Module 9 -->
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                        <h3 class="text-xl font-bold text-[#1D1C1E] mb-4">Roles</h3>
                        <p class="text-base text-[#1D1C1E]">
                            Define and manage roles for your team.
                        </p>
                    </div>
                    <!-- Module 10 -->
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                        <h3 class="text-xl font-bold text-[#1D1C1E] mb-4">Users</h3>
                        <p class="text-base text-[#1D1C1E]">
                            Manage user accounts and access levels.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="py-12 bg-gradient-to-b from-[#FFE7C7] to-[#FBAC4C]" style="font-family: 'Rubik', sans-serif;">
            <div class="container mx-auto px-4 md:px-8 lg:px-16">
                <div class="text-center">
                    <h2 class="text-2xl md:text-3xl font-bold text-[#F15A29] mb-6 underline" style="font-family: 'Rubik', sans-serif;"> Have questions? </h2>
                    <p>Share your details to see a demo, and we’ll be happy to help!</p>
                </div>
                <div class="mt-8">
                    <form action="#"  class="max-w-2xl mx-auto bg-white/30 p-6 rounded-lg shadow-md">
                        <div class="mb-4">
                            <label for="name" class="block text-[#1D1C1E] font-medium mb-2"
                                style="font-family: 'Rubik', sans-serif;">Your Name</label>
                            <input type="text" id="name" name="name"
                                class="w-full border border-[#1D1C1E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F15A29]  hover:border-[#F15A29] transition duration-300 ease-in-out"
                                placeholder="Enter your name" required>
                        </div>
                        <div class="mb-4">
                            <label for="email" class="block text-[#1D1C1E] font-medium mb-2"
                                style="font-family: 'Rubik', sans-serif;">Your Email</label>
                            <input type="email" id="email" name="email"
                                class="w-full border border-[#1D1C1E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F15A29]  hover:border-[#F15A29] transition duration-300 ease-in-out"
                                placeholder="Enter your email" required>
                        </div>
                        <div class="mb-4">
                            <label for="message" class="block text-[#1D1C1E] font-medium mb-2"
                                style="font-family: 'Rubik', sans-serif;">Your Message</label>
                            <textarea id="message" name="message" rows="4"
                                class="w-full border border-[#1D1C1E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F15A29]  hover:border-[#F15A29] transition duration-300 ease-in-out"
                                placeholder="Enter your message"></textarea>
                        </div>
                        <div class="text-center">
                            <button type="submit"
                                class="bg-[#F15A29] text-white hover:text-[#F15A29] py-2 px-6 rounded-lg hover:bg-[#1D1C1E] transition duration-300 ease-in-out"
                                style="font-family: 'Rubik', sans-serif;">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>

        
    </main>

@endsection