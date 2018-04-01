const util = require('util')
const exec = util.promisify(require('child_process').exec)
const store = require('./store')

const setProfile = async (id) => {
  const profile = await store.getProfile(id)

  if (!profile) {
    console.log('Profile could not be found')
    return false
  }

  const executed = await setGitProfile(profile)
  return executed
}

const setGitProfile = async (profile) => {
  const commands = [
    `git config --global user.name "${profile.name}"`,
    `git config --global user.email "${profile.email}"`,
    `git config --global user.signingkey ${profile.key}`
  ]

  const command = commands.join(' && ')

  try {
    await exec(command)
    if (process.env.TESTING === 'false') console.log('Using:', profile.id)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

const listProfiles = async () => {
  const profiles = await store.getProfiles()

  if (process.env.TESTING === 'true') return
  console.log('Your profiles:')
  for (let i = 0; i < profiles.length; i++) {
    console.log(`\t${profiles[i].id}`)
  }
}

const storeProfile = async (profile) => {
  let profiles = await store.getProfiles()
  profiles.push(profile)
  await store.setProfiles(profiles)
}

module.exports = {
  setProfile,
  setGitProfile,
  listProfiles,
  storeProfile
}
