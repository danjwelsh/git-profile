#!/usr/bin/env node

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

// Get the program mode
const mode = process.argv[2]

// Read in from stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

/**
 * Ask a question to stdout and get the answer from stdin
 * @param  {string} question Question to be asked
 * @return {Promise<string>} Response to the question
 */
const readInfo = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

/**
 * Main method
 * @return {Promise<void>}
 */
const main = async () => {
  // Check if a mode was given
  if (mode === undefined) {
    console.log('Commands:\n\tset\n\tadd\n\tlist')
    process.exit(1)
  }

  switch (mode) {
    // Set a profile
    case 'set':
      // Get profile identifier from arguments
      const profileId = process.argv[3]
      if (profileId === undefined) {
        console.log('Must specify profile name')
        process.exit(1)
      }
      // Set the profile
      await profileManager.setProfile(profileId)
      process.exit(0)

    // Add a profile
    case 'add':

      // Get details from stdin
      const id = await readInfo('Profile Name: ')
      const name = await readInfo('Your Name: ')
      const email = await readInfo('Email Address: ')
      const key = await readInfo('Key: ')

      // Close the reader
      rl.close()

      const profile = {
        id,
        name,
        email,
        key
      }

      // Store the profile
      await profileManager.storeProfile(profile)
      process.exit(0)

    case 'list':
      // List all stored profiles
      await profileManager.listProfiles()
      process.exit(0)

    case 'remove':
      try {
        await profileManager.removeProfile(process.argv[3])
      } catch (e) {
        console.log('Profile was not removed')
        process.exit(1)
      }
      process.exit(0)

    default:
      console.log('Commands:\n\tset\n\tadd\n\tlist')
      process.exit(1)
  }
}

main()
