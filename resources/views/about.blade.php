@extends('layouts.guest')

@section('content')

<main>
    <!-- Page Heading -->
    <section>
        <div class="container mx-auto px-4 py-7 md:py-14">
            <h1 class="text-[#1D1C1E] text-3xl sm:text-3xl md:text-5xl font-bold mb-4 text-center underline"
                style="font-family: 'Rubik', sans-serif;">
                About Us
            </h1>
        </div>
    </section>

    <!-- mission, Vision, and Values -->
    <section>
        <div class="container mx-auto px-4">
            <section class="">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

                    <div class="w-full h-full hover:mt-[-2px] hover:mb-[2px] transition-all duration-300 ease-in-out">
                        <div class="p-4 w-full h-full">
                            <div class="border rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white w-full h-full">
                                <div class="px-11 mb-14 rounded-xl border-t-4 border-[#F15A29] w-full h-full">
                                    <div class="w-full h-full">
                                        <div class="mt-15 mb-6 flex justify-center items-center">
                                            <img src="https://dataman.in/v2/wp-content/uploads/2023/01/goal.png" alt="">
                                        </div>
                                        <div class="text-center" style="font-family: 'Rubik', sans-serif;">
                                            <div class="mb-0.5">
                                                <h5 class="mb-0.5 text-xl font-bold leading-[26px]">Our Mission</h5>
                                            </div>
                                            <p class="text-base leading-[27px]">To push the boundaries of what's possible through technology and create software that transforms industries and makes a lasting impact.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="w-full h-full hover:mt-[-2px] hover:mb-[2px] transition-all duration-300 ease-in-out">
                        <div class="p-4 w-full h-full">
                            <div class="border rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white w-full h-full">
                                <div class="px-11 mb-14 rounded-xl border-t-4 border-[#F15A29] w-full h-full">
                                    <div class="w-full h-full">
                                        <div class="mt-15 mb-6 flex justify-center items-center">
                                            <img src="https://dataman.in/v2/wp-content/uploads/2023/01/vision.png" alt="">
                                        </div>
                                        <div class="text-center" style="font-family: 'Rubik', sans-serif;">
                                            <div class="mb-0.5">
                                                <h5 class="mb-0.5 text-xl font-bold leading-[26px]">Our Vision</h5>
                                            </div>
                                            <p class="text-base leading-[27px]">To be the leader in software development, known for delivering exceptional solutions that exceed customer expectations and drive growth.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="w-full h-full hover:mt-[-2px] hover:mb-[2px] transition-all duration-300 ease-in-out">
                        <div class="p-4 w-full h-full">
                            <div class="border rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white w-full h-full">
                                <div class="px-11 mb-14 rounded-xl border-t-4 border-[#F15A29] w-full h-full">
                                    <div class="w-full h-full">
                                        <div class="mt-15 mb-6 flex justify-center items-center">
                                            <img src="https://dataman.in/v2/wp-content/uploads/2023/01/values.png" alt="">
                                        </div>
                                        <div class="text-center" style="font-family: 'Rubik', sans-serif;">
                                            <div class="mb-0.5">
                                                <h5 class="mb-0.5 text-xl font-bold leading-[26px]">Our Values</h5>
                                            </div>
                                            <p class="text-base leading-[27px]">We are committed to delivering outstanding software & solutions that are reliable, user-friendly, effective and to constantly improving our products.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    </section>

    <!-- Empowering you with technology  -->
    <section class="bg-[#FFEACC]">
        <div class="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center w-full h-full">
            <!-- Left Content -->
            <div class="w-full md:w-1/2 h-full">
                <div class="p-2.5 w-full h-full" style="font-family: 'Rubik', sans-serif;">
                    <!-- Heading -->
                    <div class="mb-0.5">
                        <h5 class="text-sm font-bold uppercase">About Us</h5>
                    </div>
                    <div>
                        <h2 class="leading-[38px] text-2xl sm:text-3xl md:text-4xl font-extrabold underline">
                            Empowering you with technology
                        </h2>
                    </div>

                    <!-- Description -->
                    <div class="my-3 md:my-5">
                        <p class="text-base sm:text-lg md:text-xl leading-[30px]">
                            We focus on empowering individuals &amp; organizations through the use of technology.
                        </p>
                    </div>
                    <div>
                        <p class="text-sm sm:text-base leading-6">
                            Founded in 1990, Dataman is an INDIA-headquartered provider of IT solutions and services with
                            250+ IT professionals working full-time. For over 30+ years, we have been working hard to build
                            trust at every step. We work closely with our clients to ensure that all communication and
                            business requirements are transparent and clearly resolved in a timely manner.
                        </p>
                    </div>

                    <!-- Button -->
                    <div>
                        <a href="#"
                            class="mt-6 inline-block bg-[#F15A29] text-white hover:text-[#F15A29] py-2 px-6 rounded hover:bg-[#1D1C1E] transition duration-300 ease-in-out"
                            style="font-family: 'Rubik', sans-serif;">Our Services</a>
                    </div>
                </div>
            </div>

            <!-- Right Content -->
            <div class="w-full md:w-1/2 h-full relative bg-[#FFEACC]">
                <div class="p-2.5 w-full h-full ">
                    <img src="{{ asset('assets/about_nsew.jpg') }}" alt="About Us"
                        class="w-full h-auto ">
                    <div class="absolute inset-0 flex justify-center items-center">
                        <a class="bg-amber-500 hover:bg-amber-700 p-4 rounded-full flex justify-center items-center"
                            href="https://www.youtube.com/" target="_blank">
                            <svg width="24" height="24" class="text-white">
                                <polygon points="1,1 1,22 20,12" fill="currentColor"></polygon>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About Information  -->
    <section class="w-full py-8 bg-[#FFEACC]">
        <div class="container mx-auto px-4 py-8 ">
            <div>
                <div class="p-2.5">
                    <div>
                        <div class="mb-0.5">
                            <h5 class="text-sm text-[#F15A29] font-bold uppercase text-center">What we do</h5>
                        </div>
                    </div>
                    <div>
                        <div class="mb-0.5">
                            <h2 class="leading-[38px] text-3xl font-extrabold text-center underline">Transforming ideas into impactful software solutions</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Choose Us -->
    <section class="w-full py-8 bg-[#FFEACC]">
        <div class="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-10">
            <!-- Left Content -->
            <div class="w-full lg:w-1/2 flex justify-center">
                <img decoding="async" width="596" height="556"
                    src="https://dataman.in/v2/wp-content/uploads/2023/01/about_us_i1mg_01.png" alt="About Us"
                    class="w-full max-w-[596px] h-auto">
            </div>

            <!-- Right Content -->
            <div class="w-full lg:w-1/2 ml-5">

                <!-- Focus on User Experience -->
                <div class="flex justify-evenly gap-4 mb-6">
                    <div class="flex-shrink-0">
                        <img width="50" height="50" src="https://dataman.in/v2/wp-content/uploads/2023/01/tick-mark-1-4.png"
                            alt="Tick Mark" class="w-12 h-12">
                    </div>
                    <div class="md:w-[65%]">
                        <h6 class="text-lg md:text-xl font-bold">Focus on User Experience</h6>
                        <p class="text-sm md:text-base text-gray-600">Emphasize designing software with an intuitive and user-friendly interface to enhance customer satisfaction and engagement.</p>
                    </div>
                </div>

                <!-- New Technology Integration -->
                <div class="flex justify-evenly gap-4 mb-6">
                    <div class="flex-shrink-0">
                        <img width="50" height="50" src="https://dataman.in/v2/wp-content/uploads/2023/01/technology.png"
                            alt="Technology" class="w-12 h-12">
                    </div>
                    <div class="md:w-[65%]">
                        <h6 class="text-lg md:text-xl font-bold">New Technology Integration</h6>
                        <p class="text-sm md:text-base text-gray-600">Stay ahead of the curve by continuously improving
                            products, developing new features, and integrating the latest technologies.</p>
                    </div>
                </div>

                <!-- Team-Oriented Culture -->
                <div class="flex justify-evenly gap-4">
                    <div class="flex-shrink-0">
                        <img width="50" height="50" src="https://dataman.in/v2/wp-content/uploads/2023/01/teamwork.png"
                            alt="Teamwork" class="w-12 h-12">
                    </div>
                    <div class="md:w-[65%]">
                        <h6 class="text-lg md:text-xl font-bold">Team-Oriented Culture</h6>
                        <p class="text-sm md:text-base text-gray-600">Encourage teamwork among employees to foster
                            innovation and problem-solving, leading to better products and services.</p>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <div class="bg-[#FFEACC]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 27.8" preserveAspectRatio="xMidYMax slice">
            <path fill="#fff" stroke="#F15A29" stroke-width="0" class="elementor-shape-fill"
            d="M265.8 3.5c-10.9 0-15.9 6.2-15.9 6.2s-3.6-3.5-9.2-.9c-9.1 4.1-4.4 13.4-4.4 13.4s-1.2.2-1.9.9c-.6.7-.5 1.9-.5 1.9s-1-.5-2.3-.2c-1.3.3-1.6 1.4-1.6 1.4s.4-3.4-1.5-5c-3.9-3.4-8.3-.2-8.3-.2s-.6-.7-.9-.9c-.4-.2-1.2-.2-1.2-.2s-4.4-3.6-11.5-2.6-10.4 7.9-10.4 7.9-.5-3.3-3.9-4.9c-4.8-2.4-7.4 0-7.4 0s2.4-4.1-1.9-6.4-6.2 1.2-6.2 1.2-.9-.5-2.1-.5-2.3 1.1-2.3 1.1.1-.7-1.1-1.1c-1.2-.4-2 0-2 0s3.6-6.8-3.5-8.9c-6-1.8-7.9 2.6-8.4 4-.1-.3-.4-.7-.9-1.1-1-.7-1.3-.5-1.3-.5s1-4-1.7-5.2c-2.7-1.2-4.2 1.1-4.2 1.1s-3.1-1-5.7 1.4-2.1 5.5-2.1 5.5-.9 0-2.1.7-1.4 1.7-1.4 1.7-1.7-1.2-4.3-1.2c-2.6 0-4.5 1.2-4.5 1.2s-.7-1.5-2.8-2.4c-2.1-.9-4 0-4 0s2.6-5.9-4.7-9c-7.3-3.1-12.6 3.3-12.6 3.3s-.9 0-1.9.2c-.9.2-1.5.9-1.5.9S99.4 3 94.9 3.9c-4.5.9-5.7 5.7-5.7 5.7s-2.8-5-12.3-3.9-11.1 6-11.1 6-1.2-1.4-4-.7c-.8.2-1.3.5-1.8.9-.9-2.1-2.7-4.9-6.2-4.4-3.2.4-4 2.2-4 2.2s-.5-.7-1.2-.7h-1.4s-.5-.9-1.7-1.4-2.4 0-2.4 0-2.4-1.2-4.7 0-3.1 4.1-3.1 4.1-1.7-1.4-3.6-.7c-1.9.7-1.9 2.8-1.9 2.8s-.5-.5-1.7-.2c-1.2.2-1.4.7-1.4.7s-.7-2.3-2.8-2.8c-2.1-.5-4.3.2-4.3.2s-1.7-5-11.1-6c-3.8-.4-6.6.2-8.5 1v21.2h283.5V11.1c-.9.2-1.6.4-1.6.4s-5.2-8-16.1-8z"/>
        </svg>
    </div>

    <!-- Our Gallery -->
    <section class="">
        <div class="container mx-auto px-4 py-8 md:py-14">
            <div class="p-2.5">
                <!-- Heading and Description -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 class="leading-[38px] text-2xl sm:text-3xl md:text-4xl font-extrabold underline">
                            Our Gallery
                        </h2>
                        <p class="text-base sm:text-lg md:text-xl leading-[30px] mt-2">
                            Get a glimpse behind the scenes
                        </p>
                    </div>
                    <div class="flex justify-end">
                        <a href="#"
                            class="mt-6 inline-block bg-[#F15A29] text-white hover:text-[#F15A29] py-2 px-6 rounded hover:bg-[#1D1C1E] transition duration-300 ease-in-out">
                            Join Team
                        </a>
                    </div>
                </div>

                <!-- Swiper Gallery -->
                <div class="my-5">
                    <div class="swiper gallerySwiper">
                        <div class="swiper-wrapper">
                            <!-- Slide 1 -->
                            <div class="swiper-slide">
                                <div class="flex justify-center items-center mb-4">
                                    <img src="https://dataman.in/v2/wp-content/uploads/2023/01/IMG20230130131448-01.jpg"
                                        alt="Gallery Image 1" class="w-full max-w-[400px] h-auto rounded-lg shadow-md">
                                </div>
                            </div>
                            <!-- Slide 2 -->
                            <div class="swiper-slide">
                                <div class="flex justify-center items-center mb-4">
                                    <img src="https://dataman.in/v2/wp-content/uploads/2023/01/IMG20230130131448-01.jpg"
                                        alt="Gallery Image 2" class="w-full max-w-[400px] h-auto rounded-lg shadow-md">
                                </div>
                            </div>
                            <!-- Slide 3 -->
                            <div class="swiper-slide">
                                <div class="flex justify-center items-center mb-4">
                                    <img src="https://dataman.in/v2/wp-content/uploads/2023/01/IMG20230130131448-01.jpg"
                                        alt="Gallery Image 3" class="w-full max-w-[400px] h-auto rounded-lg shadow-md">
                                </div>
                            </div>
                            <!-- Slide 4 -->
                            <div class="swiper-slide">
                                <div class="flex justify-center items-center mb-4">
                                    <img src="https://dataman.in/v2/wp-content/uploads/2023/01/IMG20230130131448-01.jpg"
                                        alt="Gallery Image 4" class="w-full max-w-[400px] h-auto rounded-lg shadow-md">
                                </div>
                            </div>
                        </div>
                        <!-- Pagination -->
                        <div class="swiper-pagination mb-[-10px]"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Our purpose  -->
    <section class="w-full py-8">
        <div class="container mx-auto px-4 md:px-20">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <!-- Left Content -->
                <div>
                    <div class="p-3">
                        <img src="https://dataman.in/v2/wp-content/uploads/2023/01/417ccs52s32.png" alt="Our Purpose"
                            class="w-full h-auto">
                    </div>
                </div>

                <!-- Right Content -->
                <div>
                    <div class="p-3">
                        <!-- Heading -->
                        <div class="mb-4">
                            <h5 class="text-sm font-bold uppercase text-[#F15A29]">Our Purpose</h5>
                        </div>
                        <div class="mb-4">
                            <h2 class="leading-[38px] text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1D1C1E] underline">
                                Customer Should Save Time & Effort
                            </h2>
                        </div>

                        <!-- Points -->
                        <div class="space-y-5">
                            <div class="flex items-start gap-4">
                                <img width="22" height="22"
                                    src="https://dataman.in/v2/wp-content/uploads/2019/07/chek_o.png" alt="Check Icon"
                                    class="w-6 h-6">
                                <p class="text-sm sm:text-base leading-6 font-bold text-gray-700">
                                    To generate revenue and profit through sales of software products and services.
                                </p>
                            </div>
                            <div class="flex items-start gap-4">
                                <img width="22" height="22"
                                    src="https://dataman.in/v2/wp-content/uploads/2019/07/chek_o.png" alt="Check Icon"
                                    class="w-6 h-6">
                                <p class="text-sm sm:text-base leading-6 font-bold text-gray-700">
                                    To create and maintain a positive brand image and reputation in the market.
                                </p>
                            </div>
                            <div class="flex items-start gap-4">
                                <img width="22" height="22"
                                    src="https://dataman.in/v2/wp-content/uploads/2019/07/chek_o.png" alt="Check Icon"
                                    class="w-6 h-6">
                                <p class="text-sm sm:text-base leading-6 font-bold text-gray-700">
                                    To provide a positive work environment and opportunities for growth and development for
                                    employees.
                                </p>
                            </div>
                            <div class="flex items-start gap-4">
                                <img width="22" height="22"
                                    src="https://dataman.in/v2/wp-content/uploads/2019/07/chek_o.png" alt="Check Icon"
                                    class="w-6 h-6">
                                <p class="text-sm sm:text-base leading-6 font-bold text-gray-700">
                                    To stay current with emerging technologies and continuously improve software development
                                    processes.
                                </p>
                            </div>
                            <div class="flex items-start gap-4">
                                <img width="22" height="22"
                                    src="https://dataman.in/v2/wp-content/uploads/2019/07/chek_o.png" alt="Check Icon"
                                    class="w-6 h-6">
                                <p class="text-sm sm:text-base leading-6 font-bold text-gray-700">
                                    To build long-lasting relationships with customers and partners.
                                </p>
                            </div>
                            <div class="flex items-start gap-4">
                                <img width="22" height="22"
                                    src="https://dataman.in/v2/wp-content/uploads/2019/07/chek_o.png" alt="Check Icon"
                                    class="w-6 h-6">
                                <p class="text-sm sm:text-base leading-6 font-bold text-gray-700">
                                    To contribute to the advancement of the software industry.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials -->
    <section>
        <div class="container mx-auto px-4 py-8 md:py-14">
            <div class="p-2.5">
                <!-- Heading -->
                <h5 class="text-sm text-[#F15A29] font-bold uppercase text-center">Testimonials</h5>
                <h2 class="leading-[38px] text-2xl sm:text-3xl md:text-4xl font-extrabold text-center underline mt-2">
                    What Our Client’s Say
                </h2>
            </div>

            <!-- Swiper Testimonials -->
            <div class="swiper mySwiper mt-10">
                <div class="swiper-wrapper">
                    <!-- Testimonial 1 -->
                    <div class="swiper-slide">
                        <div class="text-center">
                            <div class="flex justify-center items-center mb-4">
                                <img src="{{ asset('assets/Untitled.png') }}" class="w-12 h-12"
                                    style="transform: rotate(180deg);" alt="">
                            </div>
                            <p class="text-lg leading-7 font-normal w-[80%] mx-auto">
                                "I have been using this company's services for several months now and I am thoroughly
                                impressed with their expertise and customer service. Their team of professionals quickly
                                resolved any issues I encountered and provided valuable insights and recommendations for
                                optimizing my software."
                            </p>
                            <div class="mt-4">
                                <div class="text-lg font-bold">Silviia Garden</div>
                                <div class="text-sm">Customer</div>
                            </div>
                        </div>
                    </div>
                    <!-- Testimonial 2 -->
                    <div class="swiper-slide">
                        <div class="text-center">
                            <div class="flex justify-center items-center mb-4">
                                <img src="{{ asset('assets/Untitled.png') }}" class="w-12 h-12"
                                    style="transform: rotate(180deg);" alt="">
                            </div>
                            <p class="text-lg leading-7 font-normal w-[80%] mx-auto">
                                "I've been using Dataman's product for the last 6 years and it has completely transformed
                                the way I work. The user-friendly interface and powerful features have made my job so much
                                easier and more efficient."
                            </p>
                            <div class="mt-4">
                                <div class="text-lg font-bold">Denis Robinson</div>
                                <div class="text-sm">Customer</div>
                            </div>
                        </div>
                    </div>
                    <!-- Testimonial 3 -->
                    <div class="swiper-slide">
                        <div class="text-center">
                            <div class="flex justify-center items-center mb-4">
                                <img src="{{ asset('assets/Untitled.png') }}" class="w-12 h-12"
                                    style="transform: rotate(180deg);" alt="">
                            </div>
                            <p class="text-lg leading-7 font-normal w-[80%] mx-auto">
                                "Dataman's product has completely transformed the way I work. The user-friendly interface
                                and powerful features have made my job so much easier and more efficient."
                            </p>
                            <div class="mt-4">
                                <div class="text-lg font-bold">Tommy Dents</div>
                                <div class="text-sm">Customer</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Pagination -->
                <div class="swiper-pagination"></div>
                <!-- Navigation -->
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        </div>
    </section>

</main>



@endsection