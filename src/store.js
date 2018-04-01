const fs = require('fs')
const path = require('path')

const profileStore = path.join(__dirname, '/../profiles.json')

const getProfiles = () => {
  return new Promise((resolve, reject) => {
    fs.stat(profileStore, (err, stat) => {
      if (err === null) {
        resolve(require('./../profiles.json'))
      } else if (err.code === 'ENOENT') {
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

const getProfile = async (id) => {
  const profiles = await getProfiles()
  for (let i = 0; i < profiles.length; i++) {
    if (profiles[i].id === id) {
      return profiles[i]
    }
  }
}

const setProfiles = async (profiles) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(profileStore, JSON.stringify(profiles, null, 2), 'utf8', () => {
    })
  })
}

module.exports = {
  getProfiles,
  getProfile,
  setProfiles
}
