const axios = require('axios')
const { google_places } = require('../globals').google_urls

const getPlaceDetailsRaw = (url) => {
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

/**
 * 
 * @param {[{urls}]} for each arena in arenas, get the google details, format and save them. 
 */
const getArenasByIDs = (arenaIDs) => {
   return new Promise(async(resolve, reject) => {
      try {
         const arenas = [];
         if(!Array.isArray(arenas)) throw new Error(`arenaIDs must be of type array. It was ${arenaIDs}.`)
         for(arena of arenaIDs) {
            
            const url = google_places(arena.id)

            //console.log(url)

            const result = await getPlaceDetailsRaw(url)

            //console.log(result)

            const data = result.data.result

            const photos = []

            for (let i = 0; i < data.photos.length; i++) {
               photos.push({photo_ref: data.photos[i].photo_reference, photo_link: null})
            }

            arenas.push({
               google_place_id: arena.id,
               name: data.name,
               address: data.formatted_address,
               phone_number: data.formatted_phone_number,
               location: {
                  lat: data.geometry.location.lat,
                  long: data.geometry.location.lng
               },
               photos: photos,
               rating: data.rating
            })
         };

         resolve(arenas);
      } catch (err) {
         reject(err)
      }
   })
}

module.exports = {
   getPlaceDetailsRaw,
    getArenasByIDs
}

/**
 * example of data:
 * {
   "html_attributions" : [],
   "result" : {
      "formatted_address" : "6260 Killarney St, Vancouver, BC V5S 2X7, Canada",
      "formatted_phone_number" : "(604) 718-8200",
      "geometry" : {
         "location" : {
            "lat" : 49.2274099,
            "lng" : -123.0443906
         },
         "viewport" : {
            "northeast" : {
               "lat" : 49.22868233029151,
               "lng" : -123.0431840697085
            },
            "southwest" : {
               "lat" : 49.22598436970851,
               "lng" : -123.0458820302915
            }
         }
      },
      "name" : "Killarney Community Centre",
      "photos" : [
         {
            "height" : 1080,
            "html_attributions" : [
               "\u003ca href=\"https://maps.google.com/maps/contrib/117273304257812030195\"\u003eRodrigo Coin Curvo\u003c/a\u003e"
            ],
            "photo_reference" : "CmRaAAAAE0jr1UGW7lbelOaoNyjtCOnDMzZUigorMOVkoy9LbCAE9lO93GZv0Yk1kGEySXbaU2aGoUXlJnUBQ-NWFpOit2f4ISncdhq2T4C7LmPdrbgeXvb2IV1YUf9hSv5zPeBDEhDdGEmE34E7fUnvMFDeB9V5GhRDQMkljlFX6T287dVgOTGDbtXODQ",
            "width" : 1920
         },
         {
            "height" : 1836,
            "html_attributions" : [
               "\u003ca href=\"https://maps.google.com/maps/contrib/109296323454951474687\"\u003eAlex W\u003c/a\u003e"
            ],
            "photo_reference" : "CmRaAAAAabH_ssZYTWpkFVYZRMOVTJ0gPI7FV4BT_tRKl-GS8UdQ2U7IQCRmXyMvDDMkbWGQNJ0OauR7FcsbBnKLBDRIk9X2IlvP_HAYjv74ju2dYv3_nJWuAqHwvYHPJML2TgfCEhCPIHSMWdpE8qm9GVC_ZPjjGhRp5HPyJ_gJZMmUgsEb6dFcMUipfA",
            "width" : 3264
         },
         {
            "height" : 3024,
            "html_attributions" : [
               "\u003ca href=\"https://maps.google.com/maps/contrib/100802610659876736779\"\u003eKenny Ho\u003c/a\u003e"
            ],
            "photo_reference" : "CmRaAAAASBmyMSRDcpQMv0Qgw1yxQzCbL2Cv4kv_LM9kM_jFMwNZWjf658mBTXZtndLivEe2yZHDtQi59ngaPyGdiV19GpSQh6RXCFJIFYLWRcWBROvH4oHE2M45X9r3XygiCvSpEhDAhpQ9rUgiWtisqg2P5lwAGhTJCSNqsVPP-PnLifIJtQrP5eTNbA",
            "width" : 4032
         },
         {
            "height" : 2160,
            "html_attributions" : [
               "\u003ca href=\"https://maps.google.com/maps/contrib/101435831846261023569\"\u003ePeter T\u003c/a\u003e"
            ],
            "photo_reference" : "CmRaAAAAOSqXRAijF4DFRHh3uvBU_VwJEizY13brAXgGwi7MqkrlzJyjLj-FeXUvlLtmMaLjX_U25B8Lc4bAfhUY-3U9fEhdwBV6eTgpeobA-5K9Wb93OifXijBRzi2qYqCu4D8gEhD_7K0ySM9QiqrH8pqSVukBGhT-zrHqFQzBUI7TbhsmEGdKZAkQzg",
            "width" : 3840
         },
         {
            "height" : 2988,
            "html_attributions" : [
               "\u003ca href=\"https://maps.google.com/maps/contrib/104638451786061427982\"\u003eMike Shen\u003c/a\u003e"
            ],
            "photo_reference" : "CmRaAAAAKWb-4GTpnI-y5ytFb9DHVmm_6PPT4RnziUiFjcJlCEYzfvSzkbjBFLOMsLscDQjgHSxGpVXU6btysHqDFRKupsOvEQ73nRFPfcXDFYWNELfcR-noCjPp3-Bn1yVIxrnfEhAYsdCdccm7f3l2JSKkJGcAGhT4eFyBAmgsq7L07kEPFAUyF26zcQ",
            "width" : 3984
         },
         {
            "height" : 3880,
            "html_attributions" : [
               "\u003ca href=\"https://maps.google.com/maps/contrib/116062483590080492637\"\u003eAdrian Procter\u003c/a\u003e"
            ],
            "photo_reference" : "CmRaAAAADbZ46JTrDVKUXBW14qx9u718t54vzi5JZZdQXF2xH_fG4jaaJtHGJN8aHYAiCWpPoAXOCNLcSROcLDZP3eViZ-OFHipxZ-HDMON6ZIYN1GCZJ1emyvzSZRkF9L8O4XptEhA6MwjbGRFfWCeFrliUALW7GhQl5hFob8Yn-rJ3LHTIWZ9rURPLtg",
            "width" : 5184
         },
         {
            "height" : 3024,
            "html_attributions" : [
               "\u003ca href=\"https://maps.google.com/maps/contrib/113323081148787574745\"\u003eSunny Wei\u003c/a\u003e"
            ],
            "photo_reference" : "CmRaAAAA4UHZIk26inkLPrYZMQBRpcITiK0bgL0On9cKYtETZSE8zNj95MzHs-t6Dos-gVhxIgB9ziVOEr6nrOQ665dG7xOqd29oduF7YTYhGDx9xyF5XLhxoq7v-HNRh7eL98W6EhCPgcBZ5XZ5ahfuttK1RiSbGhST8SSidl8MZGOR7IxwSdx0QwJiAQ",
            "width" : 4032
         },
         {
            "height" : 2340,
            "html_attributions" : [
               "\u003ca href=\"https://maps.google.com/maps/contrib/108587674424422129125\"\u003eAmanda Lye\u003c/a\u003e"
            ],
            "photo_reference" : "CmRaAAAAcjwfEEaGGj2ypFn_3XEFF7G808rTOCDceckzqAx1UM95zdP3n0ed9CuIEuHrTG5jkyNp9N95YM1YBMEhoPTWAWOvnbyGXgTQ_QOuphUcZjBKr0rdouzU1DaZYjq2kIMaEhCMFCaOIeK40tDtfWPKzs5WGhQhoROGt53Xq2qn1auYzRPA6N7Cjw",
            "width" : 4160
         },
         {
            "height" : 3024,
            "html_attributions" : [
               "\u003ca href=\"https://maps.google.com/maps/contrib/111933442968308126385\"\u003eGuilherme Mendes\u003c/a\u003e"
            ],
            "photo_reference" : "CmRaAAAAT1_4qEScbracx0T7_II4peeYD5rufFnUshYGD_pIjLTCNrLq6DM7g42h1wWCUqTSMJTScjA7WLLU9TH1ss2oUinVf75vidA0wD81WfqDcw9DTcQRT-6PP0Y12dxre369EhBxPuE8P5va2f6cx_JjxO8eGhRjNI1iqknc7mQbe6-CbZW47YQZCg",
            "width" : 4032
         },
         {
            "height" : 3024,
            "html_attributions" : [
               "\u003ca href=\"https://maps.google.com/maps/contrib/105228349541098182324\"\u003eGodwin C\u003c/a\u003e"
            ],
            "photo_reference" : "CmRaAAAA3yku95OO0ibl0DcOs070SlOn4IvenRHusIEEAkzwpGCPJ_EeOz9sqVQjCzeURHGO6FJT-ubLpyK60uUssYXUU7R_2KArIxDCwM-wjVyZDJZKnbwMWoiV68nh32sNu8j7EhBxzUTkXMZ99hIubaz-nNtpGhTUHmwnJtZoVmgTJec3MJhc-RzlHQ",
            "width" : 4032
         }
      ],
      "rating" : 4.3
   },
   "status" : "OK"
}
 */