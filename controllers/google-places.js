const axios = require('axios')

const getPlaceDetails = (url) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(url) {
                resolve(axios({
                    method: 'POST',
                    url: url,
                }))
            } else {
                reject(new Error("Error getting place details."))
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getPlaceDetails
}