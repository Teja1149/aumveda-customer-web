import {
    supabase
} from "./supabase";


// ============================================================
// GET CUSTOMER ADDRESSES
// ============================================================

export async function getCustomerAddresses(
    customerId
) {

    if (!customerId) {

        throw new Error(
            "Customer ID is required."
        );

    }


    const {
        data,
        error
    } =
        await supabase
            .from(
                "customer_addresses"
            )
            .select(`
                id,
                customer_id,
                label,
                recipient_name,
                phone,
                address_line1,
                address_line2,
                city,
                state,
                postal_code,
                country,
                is_default,
                created_at,
                updated_at
            `)
            .eq(
                "customer_id",
                customerId
            )
            .order(
                "is_default",
                {
                    ascending: false
                }
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Customer addresses loading failed:",
            error
        );


        throw new Error(
            error.message ||
            "Unable to load saved addresses."
        );

    }


    return Array.isArray(data)
        ? data
        : [];

}


// ============================================================
// CREATE ADDRESS
// ============================================================

export async function createCustomerAddress({

    customerId,

    label,

    recipientName,

    phone,

    addressLine1,

    addressLine2,

    city,

    state,

    postalCode,

    country = "India",

    isDefault = false

}) {

    if (!customerId) {

        throw new Error(
            "Customer ID is required."
        );

    }


    validateAddress({

        recipientName,

        phone,

        addressLine1,

        city,

        state,

        postalCode

    });


    if (isDefault) {

        await clearDefaultAddress(
            customerId
        );

    }


    const {
        data,
        error
    } =
        await supabase
            .from(
                "customer_addresses"
            )
            .insert({

                customer_id:
                    customerId,

                label:
                    cleanNullable(
                        label
                    ),

                recipient_name:
                    recipientName.trim(),

                phone:
                    phone.trim(),

                address_line1:
                    addressLine1.trim(),

                address_line2:
                    cleanNullable(
                        addressLine2
                    ),

                city:
                    city.trim(),

                state:
                    state.trim(),

                postal_code:
                    postalCode.trim(),

                country:
                    country?.trim() ||
                    "India",

                is_default:
                    Boolean(
                        isDefault
                    )

            })
            .select()
            .single();


    if (error) {

        console.error(
            "Address creation failed:",
            error
        );


        throw new Error(
            error.message ||
            "Unable to save address."
        );

    }


    return data;

}


// ============================================================
// UPDATE ADDRESS
// ============================================================

export async function updateCustomerAddress({

    addressId,

    customerId,

    label,

    recipientName,

    phone,

    addressLine1,

    addressLine2,

    city,

    state,

    postalCode,

    country = "India",

    isDefault = false

}) {

    if (
        !addressId ||
        !customerId
    ) {

        throw new Error(
            "Address information is missing."
        );

    }


    validateAddress({

        recipientName,

        phone,

        addressLine1,

        city,

        state,

        postalCode

    });


    if (isDefault) {

        await clearDefaultAddress(
            customerId,
            addressId
        );

    }


    const {
        data,
        error
    } =
        await supabase
            .from(
                "customer_addresses"
            )
            .update({

                label:
                    cleanNullable(
                        label
                    ),

                recipient_name:
                    recipientName.trim(),

                phone:
                    phone.trim(),

                address_line1:
                    addressLine1.trim(),

                address_line2:
                    cleanNullable(
                        addressLine2
                    ),

                city:
                    city.trim(),

                state:
                    state.trim(),

                postal_code:
                    postalCode.trim(),

                country:
                    country?.trim() ||
                    "India",

                is_default:
                    Boolean(
                        isDefault
                    )

            })
            .eq(
                "id",
                addressId
            )
            .eq(
                "customer_id",
                customerId
            )
            .select()
            .single();


    if (error) {

        console.error(
            "Address update failed:",
            error
        );


        throw new Error(
            error.message ||
            "Unable to update address."
        );

    }


    return data;

}


// ============================================================
// DELETE ADDRESS
// ============================================================

export async function deleteCustomerAddress(
    addressId,
    customerId
) {

    if (
        !addressId ||
        !customerId
    ) {

        throw new Error(
            "Address information is missing."
        );

    }


    const {
        error
    } =
        await supabase
            .from(
                "customer_addresses"
            )
            .delete()
            .eq(
                "id",
                addressId
            )
            .eq(
                "customer_id",
                customerId
            );


    if (error) {

        console.error(
            "Address deletion failed:",
            error
        );


        throw new Error(
            error.message ||
            "Unable to delete address."
        );

    }


    return true;

}


// ============================================================
// SET DEFAULT ADDRESS
// ============================================================

export async function setDefaultAddress(
    addressId,
    customerId
) {

    if (
        !addressId ||
        !customerId
    ) {

        throw new Error(
            "Address information is missing."
        );

    }


    await clearDefaultAddress(
        customerId,
        addressId
    );


    const {
        data,
        error
    } =
        await supabase
            .from(
                "customer_addresses"
            )
            .update({

                is_default:
                    true

            })
            .eq(
                "id",
                addressId
            )
            .eq(
                "customer_id",
                customerId
            )
            .select()
            .single();


    if (error) {

        console.error(
            "Default address update failed:",
            error
        );


        throw new Error(
            error.message ||
            "Unable to set default address."
        );

    }


    return data;

}


// ============================================================
// CLEAR CURRENT DEFAULT ADDRESS
// ============================================================

async function clearDefaultAddress(
    customerId,
    excludeAddressId = null
) {

    let query =
        supabase
            .from(
                "customer_addresses"
            )
            .update({

                is_default:
                    false

            })
            .eq(
                "customer_id",
                customerId
            )
            .eq(
                "is_default",
                true
            );


    if (excludeAddressId) {

        query =
            query.neq(
                "id",
                excludeAddressId
            );

    }


    const {
        error
    } =
        await query;


    if (error) {

        console.error(
            "Default address reset failed:",
            error
        );


        throw new Error(
            error.message ||
            "Unable to update the default address."
        );

    }

}


// ============================================================
// HELPERS
// ============================================================

function cleanNullable(
    value
) {

    const cleanValue =
        String(
            value || ""
        ).trim();


    return cleanValue ||
        null;

}


// ============================================================
// VALIDATION
// ============================================================

function validateAddress({

    recipientName,

    phone,

    addressLine1,

    city,

    state,

    postalCode

}) {

    if (
        !recipientName?.trim()
    ) {

        throw new Error(
            "Recipient name is required."
        );

    }


    if (
        !phone?.trim()
    ) {

        throw new Error(
            "Phone number is required."
        );

    }


    if (
        !/^[0-9+\-\s()]{7,20}$/
            .test(
                phone.trim()
            )
    ) {

        throw new Error(
            "Please enter a valid phone number."
        );

    }


    if (
        !addressLine1?.trim()
    ) {

        throw new Error(
            "Address line 1 is required."
        );

    }


    if (
        !city?.trim()
    ) {

        throw new Error(
            "City is required."
        );

    }


    if (
        !state?.trim()
    ) {

        throw new Error(
            "State is required."
        );

    }


    if (
        !postalCode?.trim()
    ) {

        throw new Error(
            "Postal code is required."
        );

    }


    if (
        !/^[0-9]{6}$/
            .test(
                postalCode.trim()
            )
    ) {

        throw new Error(
            "Please enter a valid 6-digit PIN code."
        );

    }

}