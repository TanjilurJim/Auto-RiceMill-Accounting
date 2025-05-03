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
                                    class="mt-6 inline-block bg-[#F15A29] text-[#1D1C1E] hover:text-white py-2 px-6 rounded hover:bg-[#1D1C1E] transition duration-300 ease-in-out"
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
                    <h2 class="text-2xl md:text-3xl font-bold text-[#1D1C1E] mb-6 underline" style="font-family: 'Rubik', sans-serif;"> Auto Rice Mill Software</h2>
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
                            <h2 class="text-2xl md:text-3xl font-extrabold leading-relaxed text-[#1D1C1E] underline"
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

        <section>

        </section>


        <section class="py-12 bg-gradient-to-b from-[#FFE7C7] to-[#FBAC4C]" style="font-family: 'Rubik', sans-serif;">
            <div class="container mx-auto px-4 md:px-8 lg:px-16">
                <div class="text-center">
                    <h2 class="text-2xl md:text-3xl font-bold text-[#1D1C1E] mb-6 underline" style="font-family: 'Rubik', sans-serif;"> Have questions? </h2>
                    <p>Share your details to see a demo, and we’ll be happy to help!</p>
                </div>
                <div class="mt-8">
                    <form action="#"  class="max-w-2xl mx-auto bg-white/30 p-6 rounded-lg shadow-md">
                        <div class="mb-4">
                            <label for="name" class="block text-[#1D1C1E] font-medium mb-2"
                                style="font-family: 'Rubik', sans-serif;">Your Name</label>
                            <input type="text" id="name" name="name"
                                class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F15A29]"
                                placeholder="Enter your name" required>
                        </div>
                        <div class="mb-4">
                            <label for="email" class="block text-[#1D1C1E] font-medium mb-2"
                                style="font-family: 'Rubik', sans-serif;">Your Email</label>
                            <input type="email" id="email" name="email"
                                class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F15A29]"
                                placeholder="Enter your email" required>
                        </div>
                        <div class="mb-4">
                            <label for="message" class="block text-[#1D1C1E] font-medium mb-2"
                                style="font-family: 'Rubik', sans-serif;">Your Message</label>
                            <textarea id="message" name="message" rows="4"
                                class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F15A29]"
                                placeholder="Enter your message"></textarea>
                        </div>
                        <div class="text-center">
                            <button type="submit"
                                class="bg-[#F15A29] text-white py-2 px-6 rounded-lg hover:bg-[#1D1C1E] transition duration-300 ease-in-out"
                                style="font-family: 'Rubik', sans-serif;">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>

        
    </main>

    <footer>
        <section class="bg-[#FFEACC]">
            <div class="px-4 sm:px-8 md:px-16 lg:px-36">
                <div>
                    <div class="p-2.5">
                        <section>
                            <div class="grid grid-cols-1 md:grid-cols-2 items-center justify-center h-full md:gap-8">
                                <!-- Left Column -->
                                <div class="h-full">
                                    <div class="p-2.5">
                                        <div class="h-[30px]  md:h-[60px]">
                                            <div class="h-full">
                                                <div class="h-full">
                                                    <div class="h-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="">
                                            <div class="mb-7">
                                                <img src="{{ asset('assets/Auto Rice Mill.png') }}"
                                                    class="w-[150px] sm:w-[200px] h-auto" alt="">
                                            </div>
                                        </div>

                                        <div>
                                            <div class="mb-5 text-base sm:text-lg"
                                                style="font-family: 'Rubik', sans-serif;">
                                                <p class="mb-5">Empowering innovation, driving success: Your trusted software partner.</p>
                                                <p>A leading software company that specializes in providing flexible business-oriented solutions to our customers around the world.</p>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div class="flex gap-4">
                                                <span>
                                                    <a href="https://twitter.com/" target="_blank">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 -4 48 48"><title>Twitter-color</title><desc>Created with Sketch.</desc><defs></defs><g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Color-" transform="translate(-300.000000, -164.000000)" fill="#00AAEC"><path d="M348,168.735283 C346.236309,169.538462 344.337383,170.081618 342.345483,170.324305 C344.379644,169.076201 345.940482,167.097147 346.675823,164.739617 C344.771263,165.895269 342.666667,166.736006 340.418384,167.18671 C338.626519,165.224991 336.065504,164 333.231203,164 C327.796443,164 323.387216,168.521488 323.387216,174.097508 C323.387216,174.88913 323.471738,175.657638 323.640782,176.397255 C315.456242,175.975442 308.201444,171.959552 303.341433,165.843265 C302.493397,167.339834 302.008804,169.076201 302.008804,170.925244 C302.008804,174.426869 303.747139,177.518238 306.389857,179.329722 C304.778306,179.280607 303.256911,178.821235 301.9271,178.070061 L301.9271,178.194294 C301.9271,183.08848 305.322064,187.17082 309.8299,188.095341 C309.004402,188.33225 308.133826,188.450704 307.235077,188.450704 C306.601162,188.450704 305.981335,188.390033 305.381229,188.271578 C306.634971,192.28169 310.269414,195.2026 314.580032,195.280607 C311.210424,197.99061 306.961789,199.605634 302.349709,199.605634 C301.555203,199.605634 300.769149,199.559408 300,199.466956 C304.358514,202.327194 309.53689,204 315.095615,204 C333.211481,204 343.114633,188.615385 343.114633,175.270495 C343.114633,174.831347 343.106181,174.392199 343.089276,173.961719 C345.013559,172.537378 346.684275,170.760563 348,168.735283" id="Twitter"></path></g></g></svg>
                                                    </a>
                                                </span>
                                                <span>
                                                    <a href="https://www.facebook.com/" target="_blank">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="#3B5998" fill-rule="evenodd" d="M9.94474914,22 L9.94474914,13.1657526 L7,13.1657526 L7,9.48481614 L9.94474914,9.48481614 L9.94474914,6.54006699 C9.94474914,3.49740494 11.8713513,2 14.5856738,2 C15.8857805,2 17.0033128,2.09717672 17.3287076,2.13987558 L17.3287076,5.32020466 L15.4462767,5.32094085 C13.9702212,5.32094085 13.6256856,6.02252733 13.6256856,7.05171716 L13.6256856,9.48481614 L17.306622,9.48481614 L16.5704347,13.1657526 L13.6256856,13.1657526 L13.6845806,22"></path></svg>
                                                    </a>
                                                </span>
                                                <span>
                                                    <a href="https://www.facebook.com/" target="_blank">
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 -2 44 44"><title>LinkedIn-color</title><desc>Created with Sketch.</desc><defs></defs><g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Color-" transform="translate(-702.000000, -265.000000)" fill="#007EBB"><path d="M746,305 L736.2754,305 L736.2754,290.9384 C736.2754,287.257796 734.754233,284.74515 731.409219,284.74515 C728.850659,284.74515 727.427799,286.440738 726.765522,288.074854 C726.517168,288.661395 726.555974,289.478453 726.555974,290.295511 L726.555974,305 L716.921919,305 C716.921919,305 717.046096,280.091247 716.921919,277.827047 L726.555974,277.827047 L726.555974,282.091631 C727.125118,280.226996 730.203669,277.565794 735.116416,277.565794 C741.21143,277.565794 746,281.474355 746,289.890824 L746,305 L746,305 Z M707.17921,274.428187 L707.117121,274.428187 C704.0127,274.428187 702,272.350964 702,269.717936 C702,267.033681 704.072201,265 707.238711,265 C710.402634,265 712.348071,267.028559 712.41016,269.710252 C712.41016,272.34328 710.402634,274.428187 707.17921,274.428187 L707.17921,274.428187 L707.17921,274.428187 Z M703.109831,277.827047 L711.685795,277.827047 L711.685795,305 L703.109831,305 L703.109831,277.827047 L703.109831,277.827047 Z" id="LinkedIn"></path></g></g></svg>
                                                    </a>
                                                </span>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Right Column -->
                                <div class="h-full">
                                    <div class="p-2.5">
                                        <div class="md:h-[73px]">
                                            <div>
                                                <div>
                                                    <div></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="mb-5 text-[#1D1C1E] text-lg sm:text-xl font-extrabold"
                                                style="font-family: 'Rubik', sans-serif;">
                                                <h4 class="underline">Contact</h4>
                                            </div>
                                        </div>
                                        <div>
                                            <div style="font-family: 'Rubik', sans-serif;">
                                                <p class="flex gap-2 items-center mb-4.5">
                                                    <img src="https://dataman.in/v2/wp-content/uploads/2023/03/call-icon.png"
                                                        alt="" width="18" height="18">
                                                    <span>+880 1700001177</span>
                                                </p>
                                                <p class="flex gap-2 items-center mb-4.5">
                                                    <img src="https://dataman.in/v2/wp-content/uploads/2023/03/mail.png"
                                                        alt="" width="18" height="18">
                                                    <span>autoricemillsoftware@gmial.com</span>
                                                </p>
                                                <p class="flex gap-2 items-start mb-4.5">
                                                    <img src="https://dataman.in/v2/wp-content/uploads/2023/03/map-icon.png"
                                                        alt="" width="18" height="18">
                                                    <span>Pallabi 11.5, House #146, Rd No. 2, Dhaka 1216, 6th Floor</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div>
                            <div class="mt-8 sm:mt-12 text-center" style="font-family: 'Rubik', sans-serif;">
                                <p>&copy; 2023 Auto Rice Mill Software. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </footer>

@endsection