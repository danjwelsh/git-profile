const fs = require('fs')
const path = require('path')

const profileStore = path.join(__dirname, '/../profiles.json')

const getProfiles = () => {
  return new Promise((resolve, reject) => {
    fs.stat(profileStore, (err, stat) => {
      if (err === null) {
        try {
          fs.readFile(profileStore, (err, data) => {
            if (err) throw reject(err)
            resolve(JSON.parse(data))
          })
        } catch (e) {
          reject(e)
        }
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
