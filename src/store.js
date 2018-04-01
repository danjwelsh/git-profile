const fs = require('fs')
const path = require('path')

// Set path to profile store
const profileStore = path.join(__dirname, '/../profiles.json')

/**
 * Get profiles from file
 * @return {[type]} [description]
 */
const getProfiles = () => {
  return new Promise((resolve, reject) => {
    // Check file exists
    fs.stat(profileStore, (err, stat) => {
      if (err === null) {
        try {
          // Read in data
          fs.readFile(profileStore, (err, data) => {
            if (err) throw reject(err)
            resolve(JSON.parse(data))
          })
        } catch (e) {
          reject(e)
        }
      } else if (err.code === 'ENOENT') {
        // If file doesn't exist, create a new one with an empty array
        const profiles = []
        fs.writeFile(profileStore, JSON.stringify(profiles, null, 2), 'utf8', () => {
          resolve([])
        })
      } else {
        reject(err)
      }
    })
  })
}

/**
 * Get a single profile from the store
 * @param  {string}  id Profile if
 * @return {Promise<Object>} Return the profile if it exists
 */
const getProfile = async (id) => {
  const profiles = await getProfiles()
  for (let i = 0; i < profiles.length; i++) {
    if (profiles[i].id === id) {
      return profiles[i]
    }
  }
}

/**
 * Store profiles
 * @param  {Object[]}  profiles Profiles to store
 * @return {Promise}
 */
const setProfiles = async (profiles) => {
  return new Promise((resolve, reject) => {
    if (!profiles) {
      reject(new Error('Profiles not defined'))
    } else {
      fs.writeFile(profileStore, JSON.stringify(profiles, null, 2), 'utf8', () => {
        resolve()
      })
    }
  })
}

module.exports = {
  getProfiles,
  getProfile,
  setProfiles
}
