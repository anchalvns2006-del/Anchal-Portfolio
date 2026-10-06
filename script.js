document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       BASIC SETTINGS
    ========================================================= */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const isDesktop = window.innerWidth > 820;


    /* =========================================================
       CURRENT YEAR
    ========================================================= */

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* =========================================================
       NAVIGATION
    ========================================================= */

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.getElementById("navLinks");

    const mobileMenu =
        document.getElementById("mobileMenu");


    /*
       Desktop + Mobile navigation links
    */

    const navigationLinks =
        document.querySelectorAll(
            '.nav-links a[href^="#"], .mobile-menu a[href^="#"]'
        );


    /*
       Open / close mobile menu
    */

    if (menuToggle && mobileMenu) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                mobileMenu.classList.toggle("open");

            menuToggle.classList.toggle(
                "active",
                isOpen
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close menu"
                    : "Open menu"
            );

        });

    }


    /*
       Smooth navigation
    */

    navigationLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }


            event.preventDefault();


            /*
               Navbar height
            */

            const header =
                document.querySelector(".site-header");

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 80;


            /*
               Exact position
            */

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;


            window.scrollTo({

                top: targetPosition,

                behavior:
                    reduceMotion
                        ? "auto"
                        : "smooth"

            });


            /*
               Close mobile menu
            */

            if (mobileMenu) {
                mobileMenu.classList.remove("open");
            }

            if (menuToggle) {

                menuToggle.classList.remove(
                    "active"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open menu"
                );

            }

            document.body.classList.remove(
                "menu-open"
            );

        });

    });


    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const desktopNavLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    function updateActiveNavigation() {

        let currentSection = "home";

        const scrollPosition =
            window.scrollY + 180;


        sections.forEach((section) => {

            const sectionTop =
                section.offsetTop;

            const sectionBottom =
                sectionTop +
                section.offsetHeight;


            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {

                currentSection =
                    section.id;

            }

        });


        desktopNavLinks.forEach((link) => {

            const href =
                link.getAttribute("href");


            link.classList.toggle(
                "active",
                href ===
                `#${currentSection}`
            );

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );


    updateActiveNavigation();


    /* =========================================================
       SCROLL PROGRESS
    ========================================================= */

    const scrollProgress =
        document.getElementById(
            "scrollProgress"
        );


    function updateScrollProgress() {

        if (!scrollProgress) {
            return;
        }


        const scrollTop =
            window.scrollY;


        const totalHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;


        const progress =
            totalHeight > 0
                ? (scrollTop / totalHeight) * 100
                : 0;


        scrollProgress.style.width =
            `${progress}%`;

    }


    updateScrollProgress();


    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );


    /* =========================================================
       HERO ROLE — MOVING TEXT
    ========================================================= */

    const roleMain =
        document.querySelector(
            ".hero-role .role-main"
        );

    const roleAccent =
        document.querySelector(
            ".hero-role .role-accent"
        );


    /*
       Current HTML has:

       Software Engineer
       ·
       AI / ML
       ·
       Full Stack

       We animate the three roles
       without changing your HTML.
    */

    if (
        roleMain &&
        roleAccent &&
        !reduceMotion
    ) {

        const roleSets = [

            {
                main: "Software Engineer",
                accent: "AI / ML"
            },

            {
                main: "AI / ML",
                accent: "Full Stack"
            },

            {
                main: "Full Stack",
                accent: "Software Engineer"
            }

        ];


        let roleIndex = 0;


        function animateHeroRole() {

            const next =
                roleSets[roleIndex];


            if (typeof gsap !== "undefined") {

                const roleElements = [
                    roleMain,
                    roleAccent
                ];


                gsap.to(
                    roleElements,
                    {
                        y: -18,
                        opacity: 0,
                        duration: 0.35,
                        stagger: 0.04,
                        ease: "power2.in",

                        onComplete: () => {

                            roleMain.textContent =
                                next.main;

                            roleAccent.textContent =
                                next.accent;


                            gsap.fromTo(

                                roleElements,

                                {
                                    y: 18,
                                    opacity: 0
                                },

                                {
                                    y: 0,
                                    opacity: 1,
                                    duration: 0.55,
                                    stagger: 0.05,
                                    ease: "power3.out"
                                }

                            );

                        }

                    }
                );

            } else {

                roleMain.textContent =
                    next.main;

                roleAccent.textContent =
                    next.accent;

            }


            roleIndex =
                (roleIndex + 1) %
                roleSets.length;

        }


        setInterval(
            animateHeroRole,
            2600
        );

    }


    /* =========================================================
       STAR BACKGROUND
    ========================================================= */

    const starCanvas =
        document.getElementById(
            "starCanvas"
        );


    const starContext =
        starCanvas
            ? starCanvas.getContext("2d")
            : null;


    let stars = [];


    let canvasWidth =
        window.innerWidth;


    let canvasHeight =
        window.innerHeight;


    let devicePixelRatio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    const starMouse = {

        x: canvasWidth / 2,

        y: canvasHeight / 2,

        targetX: canvasWidth / 2,

        targetY: canvasHeight / 2

    };


    function resizeStarCanvas() {

        if (
            !starCanvas ||
            !starContext
        ) {
            return;
        }


        canvasWidth =
            window.innerWidth;

        canvasHeight =
            window.innerHeight;


        devicePixelRatio =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        starCanvas.width =
            canvasWidth *
            devicePixelRatio;


        starCanvas.height =
            canvasHeight *
            devicePixelRatio;


        starCanvas.style.width =
            `${canvasWidth}px`;


        starCanvas.style.height =
            `${canvasHeight}px`;


        starContext.setTransform(
            devicePixelRatio,
            0,
            0,
            devicePixelRatio,
            0,
            0
        );

    }


    function createBackgroundStar() {

        return {

            x:
                Math.random() *
                canvasWidth,

            y:
                Math.random() *
                canvasHeight,

            radius:
                Math.random() *
                1.35 +
                0.25,

            opacity:
                Math.random() *
                0.65 +
                0.15,

            speed:
                Math.random() *
                0.0008 +
                0.00025,

            drift:
                (Math.random() - 0.5) *
                0.06,

            phase:
                Math.random() *
                Math.PI *
                2,

            depth:
                Math.random() *
                1.25 +
                0.3

        };

    }


    function createStars() {

        stars = [];


        const count =
            Math.min(
                190,
                Math.max(
                    90,
                    Math.floor(
                        canvasWidth / 8
                    )
                )
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            stars.push(
                createBackgroundStar()
            );

        }

    }


    function animateStars() {

        if (
            !starCanvas ||
            !starContext ||
            reduceMotion
        ) {
            return;
        }


        starContext.clearRect(
            0,
            0,
            canvasWidth,
            canvasHeight
        );


        starMouse.x +=
            (
                starMouse.targetX -
                starMouse.x
            ) * 0.04;


        starMouse.y +=
            (
                starMouse.targetY -
                starMouse.y
            ) * 0.04;


        stars.forEach((star) => {

            star.phase +=
                star.speed * 18;


            star.x +=
                star.drift;


            if (star.x < -10) {

                star.x =
                    canvasWidth + 10;

            }


            if (
                star.x >
                canvasWidth + 10
            ) {

                star.x = -10;

            }


            const twinkle =
                0.72 +
                Math.sin(
                    star.phase
                ) *
                0.28;


            const dx =
                starMouse.x -
                star.x;


            const dy =
                starMouse.y -
                star.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            /*
               Cursor attraction
            */

            if (distance < 150) {

                star.x -=
                    dx *
                    0.00018 *
                    star.depth;


                star.y -=
                    dy *
                    0.00018 *
                    star.depth;

            }


            starContext.beginPath();


            starContext.fillStyle =
                `rgba(180,255,209,${star.opacity * twinkle})`;


            starContext.arc(
                star.x,
                star.y,
                star.radius,
                0,
                Math.PI * 2
            );


            starContext.fill();

        });


        /*
           Cursor glow
        */

        const glow =
            starContext.createRadialGradient(

                starMouse.x,
                starMouse.y,
                0,

                starMouse.x,
                starMouse.y,
                140

            );


        glow.addColorStop(
            0,
            "rgba(125,255,178,.055)"
        );


        glow.addColorStop(
            1,
            "rgba(125,255,178,0)"
        );


        starContext.fillStyle =
            glow;


        starContext.beginPath();


        starContext.arc(
            starMouse.x,
            starMouse.y,
            140,
            0,
            Math.PI * 2
        );


        starContext.fill();


        requestAnimationFrame(
            animateStars
        );

    }


    if (
        starCanvas &&
        starContext
    ) {

        resizeStarCanvas();

        createStars();


        if (!reduceMotion) {

            requestAnimationFrame(
                animateStars
            );

        }

    }


    window.addEventListener(
        "resize",
        () => {

            if (
                starCanvas &&
                starContext
            ) {

                resizeStarCanvas();

                createStars();

            }

        }
    );


    /* =========================================================
       MOUSE POSITION
    ========================================================= */

    window.addEventListener(
        "mousemove",
        (event) => {

            starMouse.targetX =
                event.clientX;

            starMouse.targetY =
                event.clientY;

        },
        { passive: true }
    );


    /* =========================================================
       CUSTOM CURSOR
    ========================================================= */

    if (
        isDesktop &&
        !reduceMotion
    ) {

        const cursorDot =
            document.querySelector(
                ".cursor-dot"
            );


        const cursorRing =
            document.querySelector(
                ".cursor-ring"
            );


        let mouseX =
            window.innerWidth / 2;


        let mouseY =
            window.innerHeight / 2;


        let dotX =
            mouseX;


        let dotY =
            mouseY;


        let ringX =
            mouseX;


        let ringY =
            mouseY;


        window.addEventListener(
            "mousemove",
            (event) => {

                mouseX =
                    event.clientX;

                mouseY =
                    event.clientY;

            },
            { passive: true }
        );


        function animateCursor() {

            dotX +=
                (mouseX - dotX) *
                0.34;


            dotY +=
                (mouseY - dotY) *
                0.34;


            ringX +=
                (mouseX - ringX) *
                0.13;


            ringY +=
                (mouseY - ringY) *
                0.13;


            if (cursorDot) {

                cursorDot.style.left =
                    `${dotX}px`;

                cursorDot.style.top =
                    `${dotY}px`;

            }


            if (cursorRing) {

                cursorRing.style.left =
                    `${ringX}px`;

                cursorRing.style.top =
                    `${ringY}px`;

            }


            requestAnimationFrame(
                animateCursor
            );

        }


        animateCursor();


        /*
           Cursor hover effect
        */

        const interactiveElements =
            document.querySelectorAll(
                "a, button, .project-card, .skill-item, .hero-photo-wrap, .float-card"
            );


        interactiveElements.forEach(
            (element) => {

                element.addEventListener(
                    "mouseenter",
                    () => {

                        cursorRing?.classList.add(
                            "is-hover"
                        );

                    }
                );


                element.addEventListener(
                    "mouseleave",
                    () => {

                        cursorRing?.classList.remove(
                            "is-hover"
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       CURSOR STAR TRAIL
    ========================================================= */

    if (
        isDesktop &&
        !reduceMotion
    ) {

        let trailContainer =
            document.getElementById(
                "cursorTrail"
            );


        if (!trailContainer) {

            trailContainer =
                document.createElement(
                    "div"
                );


            trailContainer.id =
                "cursorTrail";


            trailContainer.style.position =
                "fixed";


            trailContainer.style.inset =
                "0";


            trailContainer.style.pointerEvents =
                "none";


            trailContainer.style.zIndex =
                "190";


            document.body.appendChild(
                trailContainer
            );

        }


        let lastTrailTime = 0;

        let lastTrailX = 0;

        let lastTrailY = 0;


        function createTrailStar(x, y) {

            const star =
                document.createElement(
                    "span"
                );


            star.style.position =
                "fixed";


            star.style.left =
                `${x}px`;


            star.style.top =
                `${y}px`;


            const size =
                Math.random() > 0.82
                    ? 5
                    : 3;


            star.style.width =
                `${size}px`;


            star.style.height =
                `${size}px`;


            star.style.borderRadius =
                "50%";


            star.style.background =
                "#7dffb2";


            star.style.boxShadow =
                "0 0 8px #7dffb2, 0 0 18px rgba(125,255,178,.55)";


            star.style.opacity =
                "0.95";


            star.style.transform =
                "translate(-50%, -50%) scale(1)";


            star.style.transition =
                "transform .8s ease, opacity .8s ease";


            trailContainer.appendChild(
                star
            );


            requestAnimationFrame(() => {

                const moveX =
                    (Math.random() - 0.5) *
                    70;


                const moveY =
                    (Math.random() - 0.5) *
                    70;


                star.style.transform =
                    `translate(
                        calc(-50% + ${moveX}px),
                        calc(-50% + ${moveY}px)
                    ) scale(0)`;


                star.style.opacity =
                    "0";

            });


            setTimeout(
                () => star.remove(),
                850
            );

        }


        window.addEventListener(
            "mousemove",
            (event) => {

                const x =
                    event.clientX;

                const y =
                    event.clientY;


                const dx =
                    x - lastTrailX;


                const dy =
                    y - lastTrailY;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                const now =
                    performance.now();


                if (
                    distance > 7 &&
                    now - lastTrailTime > 32
                ) {

                    lastTrailTime =
                        now;


                    createTrailStar(
                        x +
                        (Math.random() - 0.5) *
                        12,

                        y +
                        (Math.random() - 0.5) *
                        12
                    );


                    if (distance > 45) {

                        createTrailStar(
                            x +
                            (Math.random() - 0.5) *
                            22,

                            y +
                            (Math.random() - 0.5) *
                            22
                        );

                    }


                    lastTrailX = x;

                    lastTrailY = y;

                }

            },
            { passive: true }
        );

    }


    /* =========================================================
       GSAP
    ========================================================= */

    if (
        !reduceMotion &&
        typeof gsap !== "undefined"
    ) {

        if (
            typeof ScrollTrigger !==
            "undefined"
        ) {

            gsap.registerPlugin(
                ScrollTrigger
            );

        }


        /* =====================================================
           HERO ENTRANCE
        ===================================================== */

        const heroTimeline =
            gsap.timeline();


        heroTimeline.from(
            ".hero-copy .reveal-up",
            {
                opacity: 0,
                y: 38,
                duration: 0.85,
                stagger: 0.08,
                ease: "power4.out"
            }
        );


        heroTimeline.from(
            ".hero-visual",
            {
                opacity: 0,
                scale: 0.91,
                x: 45,
                duration: 1.05,
                ease: "power4.out"
            },
            "-=0.65"
        );


        heroTimeline.from(
            ".hero-visual .float-card",
            {
                opacity: 0,
                scale: 0.75,
                duration: 0.65,
                stagger: 0.12,
                ease: "back.out(1.7)"
            },
            "-=0.45"
        );


        /* =====================================================
           SECTION REVEALS
        ===================================================== */

        if (
            typeof ScrollTrigger !==
            "undefined"
        ) {

            gsap.utils
                .toArray(".reveal-up")
                .forEach((element) => {

                    if (
                        element.closest(
                            ".hero-copy"
                        )
                    ) {
                        return;
                    }


                    gsap.from(
                        element,
                        {
                            opacity: 0,
                            y: 45,
                            duration: 0.9,
                            ease: "power3.out",

                            scrollTrigger: {
                                trigger: element,
                                start: "top 88%",
                                once: true
                            }
                        }
                    );

                });


            gsap.utils
                .toArray(".reveal-scale")
                .forEach((element) => {

                    if (
                        element.closest(
                            ".hero"
                        )
                    ) {
                        return;
                    }


                    gsap.from(
                        element,
                        {
                            opacity: 0,
                            scale: 0.95,
                            duration: 0.9,
                            ease: "power3.out",

                            scrollTrigger: {
                                trigger: element,
                                start: "top 88%",
                                once: true
                            }
                        }
                    );

                });

        }


        /* =====================================================
           ORBITS
        ===================================================== */

        const orbitA =
            document.querySelector(
                ".orbit-a"
            );


        const orbitB =
            document.querySelector(
                ".orbit-b"
            );


        if (orbitA) {

            gsap.to(
                orbitA,
                {
                    rotation: 360,
                    duration: 28,
                    repeat: -1,
                    ease: "none"
                }
            );

        }


        if (orbitB) {

            gsap.to(
                orbitB,
                {
                    rotation: -360,
                    duration: 37,
                    repeat: -1,
                    ease: "none"
                }
            );

        }


        /* =====================================================
           HERO GLOW
        ===================================================== */

        const heroGlow =
            document.querySelector(
                ".hero-glow"
            );


        if (heroGlow) {

            gsap.to(
                heroGlow,
                {
                    scale: 1.13,
                    opacity: 0.72,
                    duration: 3.1,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                }
            );

        }


        /* =====================================================
           FLOATING CARDS
        ===================================================== */

        document
            .querySelectorAll(
                ".float-card"
            )
            .forEach(
                (card, index) => {

                    gsap.to(
                        card,
                        {
                            y:
                                index % 2 === 0
                                    ? -12
                                    : 12,

                            duration:
                                2.7 +
                                index * 0.45,

                            repeat: -1,

                            yoyo: true,

                            ease:
                                "sine.inOut"
                        }
                    );

                }
            );


        /* =====================================================
           HERO PHOTO
        ===================================================== */

        const photoWrap =
            document.querySelector(
                ".hero-photo-wrap"
            );


        if (photoWrap) {

            gsap.to(
                photoWrap,
                {
                    y: -8,
                    duration: 3,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                }
            );


            if (
                typeof ScrollTrigger !==
                "undefined"
            ) {

                gsap.to(
                    photoWrap,
                    {
                        yPercent: -5,
                        rotation: -1,
                        ease: "none",

                        scrollTrigger: {
                            trigger: ".hero",
                            start: "top top",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );

            }

        }


        /* =====================================================
           HERO VISUAL PARALLAX
        ===================================================== */

        const heroVisual =
            document.querySelector(
                ".hero-visual"
            );


        if (heroVisual) {

            heroVisual.addEventListener(
                "mousemove",
                (event) => {

                    if (
                        window.innerWidth <= 820
                    ) {
                        return;
                    }


                    const rect =
                        heroVisual.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;


                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;


                    gsap.to(
                        ".hero-grid-lines",
                        {
                            x: x * 0.025,
                            y: y * 0.025,
                            duration: 0.5,
                            ease: "power2.out"
                        }
                    );


                    gsap.to(
                        ".hero-orbit",
                        {
                            x: x * 0.018,
                            y: y * 0.018,
                            duration: 0.55,
                            ease: "power2.out"
                        }
                    );


                    gsap.to(
                        ".hero-glow",
                        {
                            x: x * 0.03,
                            y: y * 0.03,
                            duration: 0.55,
                            ease: "power2.out"
                        }
                    );

                }
            );


            heroVisual.addEventListener(
                "mouseleave",
                () => {

                    gsap.to(
                        [
                            ".hero-grid-lines",
                            ".hero-orbit",
                            ".hero-glow"
                        ],
                        {
                            x: 0,
                            y: 0,
                            duration: 0.7,
                            ease: "power3.out"
                        }
                    );

                }
            );

        }


        /* =====================================================
           PROJECT 3D TILT
        ===================================================== */

        document
            .querySelectorAll(
                ".project-card"
            )
            .forEach(
                (card) => {

                    const visual =
                        card.querySelector(
                            ".visual-window"
                        );


                    if (!visual) {
                        return;
                    }


                    card.addEventListener(
                        "mousemove",
                        (event) => {

                            if (
                                window.innerWidth <= 820
                            ) {
                                return;
                            }


                            const rect =
                                card.getBoundingClientRect();


                            const x =
                                event.clientX -
                                rect.left;


                            const y =
                                event.clientY -
                                rect.top;


                            const centerX =
                                rect.width / 2;


                            const centerY =
                                rect.height / 2;


                            const rotateY =
                                (
                                    (x - centerX) /
                                    centerX
                                ) * 5;


                            const rotateX =
                                (
                                    (y - centerY) /
                                    centerY
                                ) * -4;


                            gsap.to(
                                visual,
                                {
                                    rotationY:
                                        rotateY,

                                    rotationX:
                                        rotateX,

                                    x:
                                        (
                                            x -
                                            centerX
                                        ) * 0.018,

                                    y:
                                        (
                                            y -
                                            centerY
                                        ) * 0.012,

                                    transformPerspective:
                                        1100,

                                    duration:
                                        0.35,

                                    ease:
                                        "power2.out"
                                }
                            );

                        }
                    );


                    card.addEventListener(
                        "mouseleave",
                        () => {

                            gsap.to(
                                visual,
                                {
                                    rotationY: 0,
                                    rotationX: 0,
                                    x: 0,
                                    y: 0,
                                    duration: 0.55,
                                    ease: "power3.out"
                                }
                            );

                        }
                    );

                }
            );


        /* =====================================================
           MAGNETIC ELEMENTS
        ===================================================== */

        document
            .querySelectorAll(
                ".magnetic"
            )
            .forEach(
                (element) => {

                    element.addEventListener(
                        "mousemove",
                        (event) => {

                            if (
                                window.innerWidth <= 820
                            ) {
                                return;
                            }


                            const rect =
                                element.getBoundingClientRect();


                            const x =
                                event.clientX -
                                rect.left -
                                rect.width / 2;


                            const y =
                                event.clientY -
                                rect.top -
                                rect.height / 2;


                            gsap.to(
                                element,
                                {
                                    x: x * 0.13,
                                    y: y * 0.13,
                                    duration: 0.3,
                                    ease: "power3.out"
                                }
                            );

                        }
                    );


                    element.addEventListener(
                        "mouseleave",
                        () => {

                            gsap.to(
                                element,
                                {
                                    x: 0,
                                    y: 0,
                                    duration: 0.5,
                                    ease:
                                        "elastic.out(1,.35)"
                                }
                            );

                        }
                    );

                }
            );


        /* =====================================================
           SKILL REVEAL
        ===================================================== */

        if (
            typeof ScrollTrigger !==
            "undefined"
        ) {

            document
                .querySelectorAll(
                    ".skill-column"
                )
                .forEach(
                    (column) => {

                        const items =
                            column.querySelectorAll(
                                ".skill-item"
                            );


                        gsap.from(
                            items,
                            {
                                opacity: 0,
                                y: 18,
                                stagger: 0.055,
                                duration: 0.55,
                                ease: "power2.out",

                                scrollTrigger: {
                                    trigger: column,
                                    start: "top 86%",
                                    once: true
                                }
                            }
                        );

                    }
                );

        }


        /* =====================================================
           PROJECT TAG HOVER
        ===================================================== */

        document
            .querySelectorAll(
                ".project-tags span"
            )
            .forEach(
                (tag) => {

                    tag.addEventListener(
                        "mouseenter",
                        () => {

                            gsap.to(
                                tag,
                                {
                                    y: -2,
                                    duration: 0.22,
                                    ease: "power2.out"
                                }
                            );

                        }
                    );


                    tag.addEventListener(
                        "mouseleave",
                        () => {

                            gsap.to(
                                tag,
                                {
                                    y: 0,
                                    duration: 0.25,
                                    ease: "power2.out"
                                }
                            );

                        }
                    );

                }
            );


        /* =====================================================
           CONTACT CARD FLOAT
        ===================================================== */

        const contactCard =
            document.querySelector(
                ".contact-card"
            );


        if (contactCard) {

            gsap.to(
                contactCard,
                {
                    y: -5,
                    duration: 3,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                }
            );

        }


        /* =====================================================
           SECTION LINE ANIMATION
        ===================================================== */

        if (
            typeof ScrollTrigger !==
            "undefined"
        ) {

            document
                .querySelectorAll(
                    ".section-line"
                )
                .forEach(
                    (line) => {

                        gsap.from(
                            line,
                            {
                                scaleX: 0,
                                transformOrigin:
                                    "left center",

                                duration:
                                    0.9,

                                ease:
                                    "power3.out",

                                scrollTrigger: {
                                    trigger: line,
                                    start: "top 90%",
                                    once: true
                                }
                            }
                        );

                    }
                );

        }

    }


    /* =========================================================
       BUTTON RIPPLE
    ========================================================= */

    document
        .querySelectorAll(".btn")
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    (event) => {

                        if (reduceMotion) {
                            return;
                        }


                        const rect =
                            button.getBoundingClientRect();


                        const ripple =
                            document.createElement(
                                "span"
                            );


                        ripple.style.position =
                            "absolute";


                        ripple.style.width =
                            "10px";


                        ripple.style.height =
                            "10px";


                        ripple.style.borderRadius =
                            "50%";


                        ripple.style.background =
                            "rgba(255,255,255,.35)";


                        ripple.style.pointerEvents =
                            "none";


                        ripple.style.left =
                            `${event.clientX - rect.left}px`;


                        ripple.style.top =
                            `${event.clientY - rect.top}px`;


                        ripple.style.transform =
                            "translate(-50%,-50%) scale(0)";


                        ripple.style.transition =
                            "transform .6s ease, opacity .6s ease";


                        button.style.position =
                            "relative";


                        button.style.overflow =
                            "hidden";


                        button.appendChild(
                            ripple
                        );


                        requestAnimationFrame(
                            () => {

                                ripple.style.transform =
                                    "translate(-50%,-50%) scale(18)";

                                ripple.style.opacity =
                                    "0";

                            }
                        );


                        setTimeout(
                            () => {
                                ripple.remove();
                            },
                            650
                        );

                    }
                );

            }
        );


    /* =========================================================
       PAGE LOADED
    ========================================================= */

    window.addEventListener(
        "load",
        () => {

            document.body.classList.add(
                "page-loaded"
            );


            if (
                typeof ScrollTrigger !==
                "undefined"
            ) {

                setTimeout(
                    () => {

                        ScrollTrigger.refresh();

                    },
                    300
                );

            }

        }
    );

});