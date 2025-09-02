<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AutoRiceMill</title>

    <link rel="icon" type="image/png" href="{{asset('assets/auto-rice-mill-png.png')}}">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
    <!-- fontawesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" rel="stylesheet" />
    <!-- Font  -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">

    <!-- Link Swiper's CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

    <!-- Animate -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">


    <!-- Custom CSS -->
    @vite('resources/css/app.css')
    @vite('resources/css/home.css')

</head>
<body class="font-sans antialiased">
    <header>
        <!-- nav-bar -->
        <nav class="py-5 border-b">
            <div class="container mx-auto px-4">
                <div class="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-10">
                    <!-- Logo -->
                    <div class="flex justify-center md:justify-start">
                        <a href="/" class="">
                            <img width="200" height="58" src="{{ asset('assets/auto-rice-mill-png.png') }}"
                                alt="Logo">
                        </a>
                    </div>

                    <!-- Contact Info -->
                    <div class="hidden md:block w-full md:w-auto flex flex-col md:flex-row items-center justify-center gap-6">
                        <ul class="flex flex-col md:flex-row gap-6 text-[#1D1C1E]">
                            <!-- Phone -->
                            <li class="group flex items-center gap-3">
                                <div class="w-[50px] h-[50px] flex justify-center items-center overflow-hidden">
                                    <i
                                        class="fa-solid fa-phone text-[#6A1A1F] text-3xl group-hover:scale-125 transition-transform duration-300 ease-in-out"></i>
                                </div>
                                <div>
                                    <h4 class="text-lg font-medium leading-6 mb-[5px]">
                                        <a href="tel:+4733378901">(+00)888.666.88</a>
                                    </h4>
                                    <span class="text-sm text-[#999999]">Free Call</span>
                                </div>
                            </li>
                            <!-- Clock -->
                            <li class="group flex items-center gap-3">
                                <div class="w-[50px] h-[50px] flex justify-center items-center overflow-hidden">
                                    <i
                                        class="fa-regular fa-clock text-[#6A1A1F] text-3xl group-hover:scale-125 transition-transform duration-300 ease-in-out"></i>
                                </div>
                                <div>
                                    <h4 class="text-lg font-medium leading-6 mb-[5px]">
                                        08:00 AM - 06:00 PM
                                    </h4>
                                    <span class="text-sm text-[#999999]">Monday - Friday</span>
                                </div>
                            </li>
                            <!-- Address -->
                            <li class="group flex items-center gap-3">
                                <div class="w-[50px] h-[50px] flex justify-center items-center overflow-hidden">
                                    <i
                                        class="fa-regular fa-map text-[#6A1A1F] text-3xl group-hover:scale-125 transition-transform duration-300 ease-in-out"></i>
                                </div>
                                <div>
                                    <h4 class="text-lg font-medium leading-6 mb-[5px]">
                                        Rafusoft
                                    </h4>
                                    <span class="text-sm text-[#999999]">Dhaka, Bangladesh</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    @yield('content')

    <footer>
        <section id="contact" class="mx-auto bg-[#6A1A1F] text-white">
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
                                                <img src="{{ asset('assets/auto-rice-mill-white.png') }}"
                                                    class="w-[150px] sm:w-[200px] h-auto" alt="">
                                            </div>
                                        </div>

                                        <div>
                                            <div class="mb-5 text-base sm:text-lg" >
                                                <p class="mb-5">Empowering innovation, driving success: Your trusted software partner.</p>
                                                <p>A leading software company that specializes in providing flexible business-oriented solutions to our customers around the world.</p>
                                            </div>
                                        </div>

                                        <div>
                                            <div class="flex gap-4">
                                                <span>
                                                    <a href="https://twitter.com/" target="_blank">
                                                        <i class="fa-brands fa-twitter text-xl"></i>
                                                    </a>
                                                </span>
                                                <span>
                                                    <a href="https://www.facebook.com/" target="_blank">
                                                        <i class="fa-brands fa-facebook text-xl"></i>
                                                    </a>
                                                </span>
                                                <span>
                                                    <a href="https://www.facebook.com/" target="_blank">
                                                        <i class="fa-brands fa-linkedin text-xl"></i>
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
                                            <div class="mb-5  text-lg sm:text-xl font-extrabold" >
                                                <h4 class="">Contact</h4>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <p class="flex gap-2 items-center mb-4.5">
                                                    <i class="fa-solid fa-phone text-lg"></i>
                                                    <span>+880 1700001177</span>
                                                </p>
                                                <p class="flex gap-2 items-center mb-4.5">
                                                    <i class="fa-regular fa-envelope text-lg"></i>
                                                    <span>autoricemillsoftware@gmial.com</span>
                                                </p>
                                                <p class="flex gap-2 items-start mb-4.5">
                                                    <i class="fa-solid fa-location-dot text-lg"></i>
                                                    <span>Auto Ricemill Software, Chandra Mollika, Plot - 398, Road - 06, Avenue - 01, Mirpur DOHS, Dhaka-1216</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div>
                            <div class="mt-8 sm:mt-12 text-center">
                                <p>&copy; {{ now()->year }} Auto Rice Mill Software. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </footer>


    <!-- Swiper JS -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    

    <!-- Initialize Swiper -->
    <script>
        // hero section 
        // Function to determine the direction based on window width
        function getSwiperDirection() {
            return window.innerWidth >= 1024 ? "vertical" : "horizontal";
        }

        var swiper = new Swiper(".heroSwiper", {
            direction: getSwiperDirection(),
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
                navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            on: {
                resize: function () {
                    // Update direction on window resize
                    swiper.changeDirection(getSwiperDirection());
                },
            },
        });

        document.addEventListener('DOMContentLoaded', function () {
            var qualityProductsSwiper = new Swiper(".qualityProductsSwiper", {
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
            });
        });

        // Testimonials
        document.addEventListener('DOMContentLoaded', function () {
            var testimonialsSwiper = new Swiper(".testimonialsSwiper", {
                loop: true,
                autoplay: {
                delay: 3000,
                disableOnInteraction: false, 
                },
                navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
                },
                pagination: {
                el: ".swiper-pagination",
                clickable: true,
                },
            });
        });

        </script>


    <script>
        
    </script>

    <!-- Our Gallery -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const filterButtons = document.querySelectorAll('.filter-btn');

            // Set "All" as active by default
            filterButtons.forEach(button => {
                if (button.getAttribute('data-filter') === 'all') {
                    button.classList.add('bg-[#6A1A1F]', 'text-white');
                }
            });

            filterButtons.forEach(button => {
                button.addEventListener('click', function (e) {
                    e.preventDefault();

                    // Remove 'active' class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('bg-[#6A1A1F]', 'text-white'));

                    // Add 'active' class to the clicked button
                    this.classList.add('bg-[#6A1A1F]', 'text-white');

                    // Filter gallery items
                    const filter = this.getAttribute('data-filter');
                    const galleryItems = document.querySelectorAll('.gallery li');

                    galleryItems.forEach(item => {
                        if (filter === 'all' || item.getAttribute('data-category') === filter) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });
        });
    </script>

    <!-- Animate -->

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init();
    </script>

</body>
</html>
