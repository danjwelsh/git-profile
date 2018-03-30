/**
 * index.js
 * Author: Daniel Welsh
 * Date: 30/03/2018
 * Description:
 *  Manage git profiles
 */

const profiles = require('./profiles.json')
const readline = require('readline')
const fs = require('fs')

process.on('unhandledRejection', error => {
  console.error(error)
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const mode = process.argv[2]

const findProfile = (id) => {
  profiles.forEach((profile) => {
    if (profile.id === id) {
      return profile
    }
  })
}

const readInfo = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

const setGitProfile = (profile) => {
  console.log('setting git profile')
}

const main = async () => {
  if (mode === undefined) {
    console.log('Commands:\n\tset')
    process.exit(1)
  }

  switch (mode) {
    case 'set':
      const profileName = process.argv[3]
      if (profileName === undefined) {
        console.log('Must specify profile name')
        process.exit(1)
      }

      const storedProfile = findProfile(profileName)
      setGitProfile(storedProfile)
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
      fs.writeFile('profiles.json', JSON.stringify(profiles), 'utf8', () => {
        console.log('Profile saved!')
      })

      setGitProfile(profile)
      break
    default:
      console.log('Commands:\n\tset\n\tadd')
      process.exit(1)
  }
}

main()
