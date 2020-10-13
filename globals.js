module.exports = {
    authentication: {
        bcryptSaltRounds: 12,
    },

    platform_restrictions: {
        MINIMUM_AGE_REQUIREMENT: 0, 
    },

    google_urls: {
        google_places: function (place_id) {
            return `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,rating,formatted_phone_number&key=${process.env.GOOGLE_API_KEY}`
        }
    }
}