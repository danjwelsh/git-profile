/**
 * index.js
 * Author: Daniel Welsh
 * Date: 30/03/2018
 * Description:
 *  Manage git profiles
 */

// const profiles = require('./profiles.json')
const readline = require('readline')
const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const path = require('path')

process.on('unhandledRejection', error => {
  console.error(error)
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const mode = process.argv[2]

const findProfile = (id, profiles) => {
  for (let i = 0; i < profiles.length; i++) {
    if (profiles[i].id === id) {
      return profiles[i]
    }
  }
}

const readInfo = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

const setGitProfile = async (profile) => {
  const commands = [
    `git config --global user.name "${profile.name}"`,
    `git config --global user.email "${profile.email}"`,
    `git config --global user.signingkey ${profile.key}`
  ]

  const command = commands.join(' && ')
  await exec(command)

  console.log('Using:', profile.id)
}

const loadSavedProfiles = () => {
  return new Promise((resolve, reject) => {
    fs.stat(path.join(__dirname, '/profiles.json'), (err, stat) => {
      if (err === null) {
        resolve(require('./profiles.json'))
      } else if (err.code === 'ENOENT') {
        const profiles = []
        fs.writeFile(path.join(__dirname, '/profiles.json'), JSON.stringify(profiles, null, 2), 'utf8', () => {
          resolve([])
        })
      } else {
        reject(err)
      }
    })
  })
}

const main = async () => {
  if (mode === undefined) {
    console.log('Commands:\n\tset\n\tadd')
    process.exit(1)
  }

  // Load set profiles
  const profiles = await loadSavedProfiles()

  switch (mode) {
    case 'set':
      const profileId = process.argv[3]
      if (profileId === undefined) {
        console.log('Must specify profile name')
        process.exit(1)
      }

      const storedProfile = findProfile(profileId, profiles)

      if (!storedProfile) {
        console.log('Profile could not be found')
        process.exit(1)
      }

      await setGitProfile(storedProfile)
      process.exit(0)

    case 'add':
      const id = await readInfo('Profile Name: ')
      const name = await readInfo('Your Name: ')
      const email = await readInfo('Email Address: ')
      const key = await readInfo('Key: ')

      rl.close()

      const profile = {
        id,
        name,
        email,
        key
      }

      profiles.push(profile)
      fs.writeFile(path.join(__dirname, '/profiles.json'), JSON.stringify(profiles, null, 2), 'utf8', () => {
        console.log(`Profile saved as: ${profile.id}`)
        console.log(`To set your profile, run with the arguments set ${profile.id}`)
      })

      break
    default:
      console.log('Commands:\n\tset\n\tadd')
      process.exit(1)
  }
}

main()
