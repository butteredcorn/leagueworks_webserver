module.exports = {
    authentication: {
        bcryptSaltRounds: 12,
        access_token_expiry_in_days: 7, //days
    },

    platform_restrictions: {
        MINIMUM_AGE_REQUIREMENT: 0, 
    },

    logging: true,

    google_urls: {
        google_places: (place_id) => {
            return `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,rating,formatted_address,formatted_phone_number,photo,geometry&key=${process.env.GOOGLE_API_KEY}`
        }
    }
}