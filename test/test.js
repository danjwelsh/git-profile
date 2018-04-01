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
const path = require('path')
const fs = require('fs')

let storedUserProfiles = []

before(function (done) {
  const profileStore = path.join(__dirname, '/../profiles.json')
  fs.readFile(profileStore, (err, data) => {
    if (err) throw err
    storedUserProfiles = JSON.parse(data)
    done()
  })
})

after(function (done) {
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
