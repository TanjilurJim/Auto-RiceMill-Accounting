@extends('layouts.guest')

@section('content')

<main>
    <!-- Page Heading -->
    <section>
        <div class="container mx-auto px-4 py-7 md:py-14">
            <h1 class="text-[#1D1C1E] text-3xl sm:text-3xl md:text-5xl font-bold mb-4 text-center underline"
                style="font-family: 'Rubik', sans-serif;">
                Contact Us
            </h1>
        </div>
    </section>
    <!-- Contact Information  -->
    <section>
        <div class="container mx-auto px-4 md:py-8 h-full flex justify-center items-center">
            <!-- Left Empty Space -->
            <div class="hidden md:block md:w-1/4 h-full mx-auto mb-4">
                <div class="h-full w-full"></div>
            </div>

            <!-- Main Content -->
            <div class="w-full  w-2/4 mx-auto mb-4">
                <div class="p-4">
                    <!-- Heading -->
                    <div class="mb-4 flex flex-col justify-center items-center">
                        <h2 class="text-[#1D1C1E] text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[34px] font-extrabold"
                            style="font-family: 'Rubik', sans-serif;">
                            Find the Perfect Solution for Your <br class="hidden lg:block"> Business
                        </h2>
                    </div>
                    <!-- Paragraph -->
                    <div>
                        <p class="text-[#1D1C1E] text-sm sm:text-base md:text-lg text-center leading-relaxed"
                            style="font-family: 'Rubik', sans-serif;">
                            We would love to hear from you! If you have any questions, comments, or feedback, please don’t
                            hesitate to reach out to us. Here are a few ways to get in touch.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Right Empty Space -->
            <div class="hidden md:block md:w-1/4 h-full mx-auto mb-4">
                <div class="h-full w-full"></div>
            </div>
        </div>
    </section>

    <!-- Contact Banner -->
    <section>
        <div class="container mx-auto px-4 py-8 md:py-14">
            <div class="flex flex-col md:flex-row justify-center items-center gap-4">
                <div class="w-full md:w-1/2 mb-4 flex flex-row justify-center items-center gap-4">
                    <img src="{{ asset('assets/undraw_contact-us_kcoa.svg') }}" alt="Contact Us" >
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Form -->
    <section class="py-10">
        <div class="container mx-auto px-4">
            <!-- Heading -->
            <div class="text-center mb-8">
                <h5 class="text-lg font-semibold text-[#F15A29]">We’re Listening</h5>
                <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D1C1E] mt-2">
                    Let's Connect!
                </h2>
            </div>

            <!-- Contact Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="flex flex-col items-center text-center">
                    <span class="text-lg font-medium text-[#1D1C1E]">Phone:</span>
                    <div class="text-sm sm:text-base md:text-lg text-gray-600">+880 1700001177</div>
                </div>
                <div class="flex flex-col items-center text-center">
                    <span class="text-lg font-medium text-[#1D1C1E]">Send Email:</span>
                    <div class="text-sm sm:text-base md:text-lg text-gray-600">autoricemillsoftware@gmial.com</div>
                </div>
                <div class="flex flex-col items-center text-center">
                    <span class="text-lg font-medium text-[#1D1C1E]">Address:</span>
                    <div class="text-sm sm:text-base md:text-lg text-gray-600">
                        Auto Ricemill Software, Chandra Mollika, Plot - 398, Road - 06, Avenue - 01, Mirpur DOHS, Dhaka-1216 
                    </div>
                </div>
            </div>

            <!-- Form -->
            <div class="mt-10">
                <form class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <!-- Business Name -->
                        <div class="col-span-1 sm:col-span-2">
                            <input type="text" name="your-business" placeholder="Business Name" class="w-full border border-[#1D1C1E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F15A29]  hover:border-[#F15A29] transition duration-300 ease-in-out" />
                        </div>
                        <!-- Your Name -->
                        <div>
                            <input type="text" name="your-name" placeholder="Your Name*" required class="w-full border border-[#1D1C1E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F15A29]  hover:border-[#F15A29] transition duration-300 ease-in-out" />
                        </div>
                        <!-- Mobile Number -->
                        <div>
                            <input type="tel" name="your-mobile" placeholder="Mobile Number*" required class="w-full border border-[#1D1C1E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F15A29]  hover:border-[#F15A29] transition duration-300 ease-in-out" />
                        </div>
                        <!-- City -->
                        <div>
                            <input type="text" name="your-city" placeholder="City" class="w-full border border-[#1D1C1E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F15A29]  hover:border-[#F15A29] transition duration-300 ease-in-out" />
                        </div>
                        <!-- Email -->
                        <div>
                            <input type="email" name="your-email" placeholder="Email*" required class="w-full border border-[#1D1C1E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F15A29]  hover:border-[#F15A29] transition duration-300 ease-in-out" />
                        </div>
                    </div>
                    <!-- Message -->
                    <div class="mt-6">
                        <textarea name="your-message" rows="5" placeholder="Message" class="w-full border border-[#1D1C1E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F15A29]  hover:border-[#F15A29] transition duration-300 ease-in-out"></textarea>
                    </div>
                    <!-- Submit Button -->
                    <div class="mt-6 text-center">
                        <button type="submit"
                            class="bg-[#F15A29] text-white hover:text-[#F15A29] py-3 px-6 rounded-lg hover:bg-[#1D1C1E] transition duration-300">
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <!-- map section  -->
    <section class="py-10">
        <div class="mx-auto px-4">
            <!-- <div class="flex flex-col items-center text-center mb-8">
                <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D1C1E] mt-2">
                    Our Location
                </h2>
            </div> -->
            <!-- Google Map Embed -->
            <div class="w-full h-[400px] md:h-[500px] lg:h-[600px]">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.1234567890123!2d90.12345678901234!3d23.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c12345678901%3A0x1234567890123456!2sYour%20Business%20Name%20Here!5e0!3m2!1sen!2sbd!4v1234567890123"
                    width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>
        </div>
    </section>

    
</main>

@endsection