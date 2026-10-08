import {
    supabase
} from "./supabase";


// ============================================================
// GET CUSTOMER PROFILE
// ============================================================

export async function getCustomerProfile(
    userId
) {

    if (!userId) {

        throw new Error(
            "User ID is required."
        );

    }


    // ========================================================
    // LOAD COMMON PROFILE
    // ========================================================

    const {
        data: profile,
        error: profileError
    } =
        await supabase
            .from("profiles")
            .select(`
                id,
                role,
                full_name,
                phone,
                avatar_url,
                is_active,
                created_at,
                updated_at
            `)
            .eq(
                "id",
                userId
            )
            .maybeSingle();


    if (profileError) {

        console.error(
            "Profile loading failed:",
            profileError
        );


        throw new Error(
            profileError.message ||
            "Unable to load profile."
        );

    }


    // ========================================================
    // LOAD CUSTOMER PROFILE
    // ========================================================

    const {
        data: customerProfile,
        error: customerProfileError
    } =
        await supabase
            .from("customer_profiles")
            .select(`
                user_id,
                date_of_birth,
                gender,
                marketing_opt_in,
                created_at,
                updated_at
            `)
            .eq(
                "user_id",
                userId
            )
            .maybeSingle();


    if (customerProfileError) {

        console.error(
            "Customer profile loading failed:",
            customerProfileError
        );


        throw new Error(
            customerProfileError.message ||
            "Unable to load customer profile."
        );

    }


    // ========================================================
    // RETURN NORMALIZED PROFILE
    // ========================================================

    return {

        id:
            profile?.id ||
            userId,

        role:
            profile?.role ||
            "customer",

        full_name:
            profile?.full_name ||
            "",

        phone:
            profile?.phone ||
            "",

        avatar_url:
            profile?.avatar_url ||
            "",

        is_active:
            profile?.is_active ??
            true,

        created_at:
            profile?.created_at ||
            null,

        updated_at:
            profile?.updated_at ||
            null,

        date_of_birth:
            customerProfile
                ?.date_of_birth ||
            "",

        gender:
            customerProfile
                ?.gender ||
            "",

        marketing_opt_in:
            Boolean(
                customerProfile
                    ?.marketing_opt_in
            )

    };

}


// ============================================================
// UPDATE CUSTOMER PROFILE
// ============================================================

export async function updateCustomerProfile({
    userId,
    fullName,
    phone,
    dateOfBirth,
    gender,
    marketingOptIn
}) {

    if (!userId) {

        throw new Error(
            "User ID is required."
        );

    }


    const cleanName =
        String(
            fullName || ""
        ).trim();


    const cleanPhone =
        String(
            phone || ""
        ).trim();


    const cleanGender =
        String(
            gender || ""
        ).trim();


    const cleanDateOfBirth =
        String(
            dateOfBirth || ""
        ).trim();


    if (!cleanName) {

        throw new Error(
            "Please enter your full name."
        );

    }


    // ========================================================
    // UPDATE PUBLIC PROFILE
    // ========================================================

    const {
        data: updatedProfile,
        error: profileError
    } =
        await supabase
            .from("profiles")
            .update({

                full_name:
                    cleanName,

                phone:
                    cleanPhone ||
                    null

            })
            .eq(
                "id",
                userId
            )
            .select(`
                id,
                role,
                full_name,
                phone,
                avatar_url,
                is_active,
                created_at,
                updated_at
            `)
            .single();


    if (profileError) {

        console.error(
            "Profile update failed:",
            profileError
        );


        throw new Error(
            profileError.message ||
            "Unable to update profile."
        );

    }


    // ========================================================
    // UPDATE / CREATE CUSTOMER PROFILE
    // ========================================================

    const {
        data: updatedCustomerProfile,
        error: customerProfileError
    } =
        await supabase
            .from(
                "customer_profiles"
            )
            .upsert(
                {

                    user_id:
                        userId,

                    date_of_birth:
                        cleanDateOfBirth ||
                        null,

                    gender:
                        cleanGender ||
                        null,

                    marketing_opt_in:
                        Boolean(
                            marketingOptIn
                        )

                },
                {

                    onConflict:
                        "user_id"

                }
            )
            .select(`
                user_id,
                date_of_birth,
                gender,
                marketing_opt_in,
                created_at,
                updated_at
            `)
            .single();


    if (
        customerProfileError
    ) {

        console.error(
            "Customer profile update failed:",
            customerProfileError
        );


        throw new Error(
            customerProfileError.message ||
            "Unable to update customer information."
        );

    }


    // ========================================================
    // UPDATE SUPABASE AUTH USER METADATA
    // ========================================================

    const {
        data: authData,
        error: authError
    } =
        await supabase
            .auth
            .updateUser({

                data: {

                    full_name:
                        cleanName

                }

            });


    if (authError) {

        console.error(
            "Auth profile update failed:",
            authError
        );


        throw new Error(
            authError.message ||
            "Profile was saved, but account information could not be refreshed."
        );

    }


    // ========================================================
    // RETURN NORMALIZED UPDATED PROFILE
    // ========================================================

    return {

        ...updatedProfile,

        date_of_birth:
            updatedCustomerProfile
                ?.date_of_birth ||
            "",

        gender:
            updatedCustomerProfile
                ?.gender ||
            "",

        marketing_opt_in:
            Boolean(
                updatedCustomerProfile
                    ?.marketing_opt_in
            ),

        auth_user:
            authData?.user ||
            null

    };

}