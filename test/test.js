/**
 * test.js
 * Author: Daniel Welsh
 * Date: 01/04/2018
 * Desc:
 *  Unit tests for git-profile
 */

/* global describe it before after:true */

const assert = require('assert')
const store = require('./../src/store')
const profileManager = require('./../src/profile')
const path = require('path')
const fs = require('fs')

let storedUserProfiles = []

before(function (done) {
  process.env.TESTING = 'true'
  const profileStore = path.join(__dirname, '/../profiles.json')
  fs.readFile(profileStore, (err, data) => {
    if (err) throw err
    storedUserProfiles = JSON.parse(data)
    done()
  })
})

after(function (done) {
  process.env.TESTING = 'false'
  const profileStore = path.join(__dirname, '/../profiles.json')
  fs.writeFile(profileStore, JSON.stringify(storedUserProfiles, null, 2), 'utf8', () => {
    done()
  })
})

describe('Store', function () {
  before(async function () {
    const profile = {
      id: 'Home',
      name: 'Daniel Welsh',
      email: 'danjwelsh24@gmail.com',
      key: '084A842BD1752123'
    }
    await store.setProfiles([profile])
  })

  describe('Can load profiles', function () {
    it('should load all profiles from the store', async function () {
      const profiles = await store.getProfiles()
      assert(Array.isArray(profiles))
    })
  })

  describe('Can load a profile', function () {
    it('should load a profile from the store', async function () {
      const profile = await store.getProfile('Home')
      assert(profile.id === 'Home')
    })
  })

  describe('Can store a profile', function () {
    it('should store a profile', async function () {
      let profile = {
        id: 'test',
        name: 'Teser',
        email: 'test@test.com',
        key: '3444366344534534'
      }

      await store.setProfiles([profile])

      const profiles = await store.getProfiles()
      profile = undefined
      for (let i = 0; i < profiles.length; i++) {
        if (profiles[i].id === 'test') {
          profile = profiles[i]
          break
        }
      }
      assert(profile)
    })
  })
})

describe('Profile Manager', function () {
  describe('Can list profiles', function () {
    it('should list all profiles', async function () {
      await profileManager.listProfiles()
      assert(true)
    })
  })

  describe('Can store a profile', function () {
    it('should list all profiles', async function () {
      const testProfile = {
        id: 'a',
        name: 'a',
        email: 'a',
        key: 'a'
      }

      await profileManager.storeProfile(testProfile)
      const stored = await store.getProfile('a')
      assert(stored)
    })
  })

  describe('Can set a profile', function () {
    it('should set a profile', async function () {
      await profileManager.storeProfile(storedUserProfiles[0])
      const set = await profileManager.setProfile(storedUserProfiles[0].id)
      assert(set)
    })
  })

  describe('Can remove a profile', function () {
    it('should remove a profile', async function () {
      const profile = {
        id: 'removeMe',
        name: 'test',
        email: 'test',
        key: 'test'
      }
      await profileManager.storeProfile(profile)
      await profileManager.removeProfile(profile.id)

      const stored = await store.getProfile(profile.id)
      assert(!stored)
    })
  })
})
