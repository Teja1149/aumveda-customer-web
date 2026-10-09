import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    Leaf
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import {
    getHomeCategories
} from "../../services/homeService";

import BotanicalDoodles
    from "../common/BotanicalDoodles";

import "../../styles/explore-ayurveda.css";


function ExploreAyurveda() {

    const navigate =
        useNavigate();


    const [
        categories,
        setCategories
    ] = useState([]);


    const [
        paused,
        setPaused
    ] = useState(false);


    const [
        manualMove,
        setManualMove
    ] = useState("");


    /* ============================================================
       LOAD CATEGORIES
    ============================================================ */

    useEffect(() => {

        let mounted =
            true;


        async function loadCategories() {

            try {

                const data =
                    await getHomeCategories();


                if (!mounted) {

                    return;

                }


                setCategories(
                    Array.isArray(data)
                        ? data
                        : []
                );

            }
            catch (error) {

                console.error(
                    "Category loading failed:",
                    error
                );

            }

        }


        loadCategories();


        return () => {

            mounted =
                false;

        };

    }, []);


    /* ============================================================
       CATEGORY CLICK
       REAL DATABASE CATEGORY ID
    ============================================================ */

    function handleCategoryClick(
        category
    ) {

        if (!category?.id) {

            return;

        }


        navigate(
            `/products?category=${encodeURIComponent(
                category.id
            )}`
        );

    }


    /* ============================================================
       CAROUSEL ITEMS
    ============================================================ */

    const carouselItems =
        useMemo(() => {

            if (!categories.length) {

                return [];

            }


            return [
                ...categories,
                ...categories,
                ...categories
            ];

        }, [
            categories
        ]);


    /* ============================================================
       MANUAL MOVEMENT
    ============================================================ */

    function moveLeft() {

        setManualMove(
            "move-left"
        );


        window.setTimeout(() => {

            setManualMove("");

        }, 650);

    }


    function moveRight() {

        setManualMove(
            "move-right"
        );


        window.setTimeout(() => {

            setManualMove("");

        }, 650);

    }


    /* ============================================================
       NO CATEGORIES
    ============================================================ */

    if (!categories.length) {

        return null;

    }


    /* ============================================================
       RENDER
    ============================================================ */

    return (

        <section
            className="explore-ayurveda"
        >

            <BotanicalDoodles
                variant="explore"
            />


            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className="
                    explore-ayurveda__header
                "
            >

                <div
                    className="
                        explore-ayurveda__eyebrow
                    "
                >

                    <span
                        className="
                            explore-ayurveda__eyebrow-line
                        "
                    />


                    <Leaf
                        size={14}
                        strokeWidth={1.7}
                    />


                    <span>

                        Natural Wellness Collections

                    </span>


                    <span
                        className="
                            explore-ayurveda__eyebrow-line
                        "
                    />

                </div>


                <h2>

                    Explore Aumveda

                </h2>


                <p>

                    Discover thoughtfully curated wellness
                    collections inspired by nature and
                    timeless Ayurvedic traditions.

                </p>

            </div>


            {/* ==================================================
                CAROUSEL
            ================================================== */}

            <div

                className="
                    explore-carousel
                "

                onMouseEnter={() =>
                    setPaused(
                        true
                    )
                }

                onMouseLeave={() =>
                    setPaused(
                        false
                    )
                }

            >

                {/* LEFT ARROW */}

                <button

                    type="button"

                    className="
                        explore-carousel__arrow
                        explore-carousel__arrow--left
                    "

                    onClick={
                        moveLeft
                    }

                    aria-label="
                        Previous categories
                    "

                >

                    <ChevronLeft
                        size={20}
                        strokeWidth={1.8}
                    />

                </button>


                {/* CATEGORY VIEWPORT */}

                <div
                    className="
                        explore-carousel__viewport
                    "
                >

                    <div
                        className={`
                            explore-carousel__track
                            ${paused ? "paused" : ""}
                            ${manualMove}
                        `}
                    >

                        {
                            carouselItems.map(
                                (
                                    category,
                                    index
                                ) => (

                                    <article

                                        key={
                                            `${category.id}-${index}`
                                        }

                                        className="
                                            explore-category
                                        "

                                        onClick={() =>
                                            handleCategoryClick(
                                                category
                                            )
                                        }

                                        role="button"

                                        tabIndex={0}

                                        onKeyDown={
                                            event => {

                                                if (
                                                    event.key ===
                                                    "Enter" ||

                                                    event.key ===
                                                    " "
                                                ) {

                                                    event.preventDefault();


                                                    handleCategoryClick(
                                                        category
                                                    );

                                                }

                                            }
                                        }

                                        aria-label={
                                            `View ${category.name} products`
                                        }

                                    >

                                        <div
                                            className="
                                                explore-category__visual
                                            "
                                        >

                                            <div
                                                className="
                                                    explore-category__ring
                                                "
                                            >

                                                <div
                                                    className="
                                                        explore-category__image
                                                    "
                                                >

                                                    <img

                                                        src={
                                                            category.image_url
                                                        }

                                                        alt={
                                                            category.name
                                                        }

                                                        loading="lazy"

                                                    />

                                                </div>

                                            </div>


                                            <span
                                                className="
                                                    explore-category__open
                                                "
                                            >

                                                <ArrowUpRight
                                                    size={14}
                                                />

                                            </span>

                                        </div>


                                        <h3>

                                            {
                                                category.name
                                            }

                                        </h3>


                                        <span
                                            className="
                                                explore-category__caption
                                            "
                                        >

                                            Explore collection

                                        </span>

                                    </article>

                                )
                            )
                        }

                    </div>

                </div>


                {/* RIGHT ARROW */}

                <button

                    type="button"

                    className="
                        explore-carousel__arrow
                        explore-carousel__arrow--right
                    "

                    onClick={
                        moveRight
                    }

                    aria-label="
                        Next categories
                    "

                >

                    <ChevronRight
                        size={20}
                        strokeWidth={1.8}
                    />

                </button>

            </div>

        </section>

    );

}


export default ExploreAyurveda;