import { supabase } from "./supabase";


// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;


// ============================================================
// VALIDATE API URL
// ============================================================

if (!API_BASE_URL) {

    console.error(
        "VITE_API_BASE_URL is missing from the Customer Web .env file."
    );

}


// ============================================================
// REQUEST HELPER
// ============================================================

async function request(
    endpoint,
    options = {}
) {

    // --------------------------------------------------------
    // GET CURRENT SUPABASE SESSION
    // --------------------------------------------------------

    let accessToken = null;

    try {

        const {
            data,
            error,
        } = await supabase.auth.getSession();


        if (!error) {

            accessToken =
                data?.session?.access_token ||
                null;

        }

    }
    catch (error) {

        console.error(
            "Failed to retrieve Supabase session:",
            error
        );

    }


    // --------------------------------------------------------
    // HEADERS
    // --------------------------------------------------------

    const headers = {

        "Content-Type":
            "application/json",

        ...options.headers,

    };


    // --------------------------------------------------------
    // ATTACH BEARER TOKEN
    // --------------------------------------------------------

    if (accessToken) {

        headers.Authorization =
            `Bearer ${accessToken}`;

    }


    // --------------------------------------------------------
    // API REQUEST
    // --------------------------------------------------------

    const response =
        await fetch(

            `${API_BASE_URL}${endpoint}`,

            {

                ...options,

                headers,

            }

        );


    // --------------------------------------------------------
    // ERROR HANDLING
    // --------------------------------------------------------

    if (!response.ok) {

        let message =
            "API request failed";


        try {

            const errorData =
                await response.json();


            if (
                typeof errorData?.detail ===
                "string"
            ) {

                message =
                    errorData.detail;

            }
            else if (
                typeof errorData?.message ===
                "string"
            ) {

                message =
                    errorData.message;

            }
            else if (
                errorData?.detail
            ) {

                message =
                    JSON.stringify(
                        errorData.detail
                    );

            }

        }
        catch {

            // Keep default message

        }


        const error =
            new Error(message);


        error.status =
            response.status;


        throw error;

    }


    // --------------------------------------------------------
    // EMPTY RESPONSE
    // --------------------------------------------------------

    if (
        response.status === 204
    ) {

        return null;

    }


    // --------------------------------------------------------
    // JSON RESPONSE
    // --------------------------------------------------------

    return response.json();

}


// ============================================================
// API CLIENT
// ============================================================

const api = {

    // ========================================================
    // GET
    // ========================================================

    get: (
        endpoint,
        options = {}
    ) =>

        request(

            endpoint,

            {

                ...options,

                method: "GET",

            }

        ),


    // ========================================================
    // POST
    // ========================================================

    post: (
        endpoint,
        data,
        options = {}
    ) =>

        request(

            endpoint,

            {

                ...options,

                method: "POST",

                body:
                    JSON.stringify(
                        data
                    ),

            }

        ),


    // ========================================================
    // PUT
    // ========================================================

    put: (
        endpoint,
        data,
        options = {}
    ) =>

        request(

            endpoint,

            {

                ...options,

                method: "PUT",

                body:
                    JSON.stringify(
                        data
                    ),

            }

        ),


    // ========================================================
    // PATCH
    // ========================================================

    patch: (
        endpoint,
        data,
        options = {}
    ) =>

        request(

            endpoint,

            {

                ...options,

                method: "PATCH",

                body:
                    JSON.stringify(
                        data
                    ),

            }

        ),


    // ========================================================
    // DELETE
    // ========================================================

    delete: (
        endpoint,
        options = {}
    ) =>

        request(

            endpoint,

            {

                ...options,

                method: "DELETE",

            }

        ),

};


// ============================================================
// EXPORTS
// ============================================================

export {
    api,
};

export default api;