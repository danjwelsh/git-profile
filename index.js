/**
 * index.js
 * Author: Daniel Welsh
 * Date: 30/03/2018
 * Description:
 *  Manage git profiles
 */

const readline = require('readline')
const profileManager = require('./src/profile')

process.on('unhandledRejection', error => {
  console.error(error)
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const mode = process.argv[2]

const readInfo = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

const main = async () => {
  if (mode === undefined) {
    console.log('Commands:\n\tset\n\tadd\n\tlist')
    process.exit(1)
  }

  switch (mode) {
    case 'set':
      const profileId = process.argv[3]
      if (profileId === undefined) {
        console.log('Must specify profile name')
        process.exit(1)
      }
      await profileManager.setProfile(profileId)
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

      await profileManager.storeProfile(profile)
      process.exit(0)

    case 'list':
      await profileManager.listProfiles()
      process.exit(0)

    default:
      console.log('Commands:\n\tset\n\tadd\n\tlist')
      process.exit(1)
  }
}

main()
