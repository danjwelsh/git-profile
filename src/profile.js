const util = require('util')
const exec = util.promisify(require('child_process').exec)
const store = require('./store')

/**
 * Set a profile
 * @param  {string}  id Profile id
 * @return {Promise<boolean>} True if set
 */
const setProfile = async (id) => {
  // Fetch profile
  const profile = await store.getProfile(id)

  // Exit if not found
  if (!profile) {
    console.log('Profile could not be found')
    return false
  }

  // Set the profile
  const executed = await setGitProfile(profile)
  return executed
}

/**
 * Execute commands to set the git profile
 * @param  {Object}  profile Git profile
 * @return {Promise<boolean>} True if executed
 */
const setGitProfile = async (profile) => {
  const commands = [
    `git config --global user.name "${profile.name}"`,
    `git config --global user.email "${profile.email}"`,
    `git config --global user.signingkey ${profile.key}`
  ]

  // Join into a single command
  const command = commands.join(' && ')

  try {
    // Execute the command
    await exec(command)
    if (process.env.TESTING === 'false') console.log('Using:', profile.id)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

/**
 * List all profiles
 * @return {Promise<void>}
 */
const listProfiles = async () => {
  const profiles = await store.getProfiles()

  if (process.env.TESTING === 'true') return
  console.log('Your profiles:')
  for (let i = 0; i < profiles.length; i++) {
    console.log(`\t${profiles[i].id}`)
  }
}

/**
 * Remove a profile from the store
 * @param  {string}  id Profile ID
 * @return {Promise<boolean>}
 */
const removeProfile = async (id) => {
  const profile = await store.getProfile(id)
  if (!profile) {
    throw new Error('Profile could not be found')
  }

  let profiles = await store.getProfiles()
  for (let i = 0; i < profiles.length; i++) {
    if (profiles[i].id === id) {
      profiles.splice(i, 1)
      await store.setProfiles(profiles)
      return true
    }
  }

  return false
}

/**
 * Store a profile
 * @param  {Object}  profile Profile to store
 * @return {Promise}
 */
const storeProfile = async (profile) => {
  let profiles = await store.getProfiles()
  profiles.push(profile)
  await store.setProfiles(profiles)
}

module.exports = {
  setProfile,
  setGitProfile,
  listProfiles,
  storeProfile,
  removeProfile
}
