#!/usr/bin/env node

import { version } from "../package.json";
import chalk from "chalk";
import App from "./App";
import { Profile } from "./Profile";
import CLI from "./CLI";

const commander = require("commander");

async function exe(): Promise<void> {
  const app: App = new App();
  const cli: CLI = new CLI();

  commander
    .version(version, "-v --version")
    .description("Git wrapper for managing git settings");

  commander
    .option("-s, --set", "set a profile")
    .option("-a, --add", "add a profile")
    .option("-l, --list", "list all profiles")
    .option("-r, --remove", "remove a profile");

  commander.parse(process.argv);
  const options = {
    add: commander.add,
    list: commander.list,
    remove: commander.remove,
    set: commander.set
  };

  if (options.add) {
    let profile: Profile;
    try {
      profile = await cli.getProfile();
    } catch (e) {
      console.error(chalk.red("Could not get your profile information"));
    }

    try {
      await app.storeProfile(profile);
    } catch (e) {
      console.error(chalk.red("Could not add your profile."));
    }
  } else if (options.list) {
    await app.listProfiles();
  } else if (options.set) {
    const profile: Profile = await cli.chooseProfile();
    try {
      await app.setProfile(profile);
    } catch (e) {
      console.error(e);
      console.error(chalk.red("Could not set your git profile."));
    }
  }
}

exe().then();
