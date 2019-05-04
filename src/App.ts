//
import chalk from "chalk";
import { exec } from "child_process";
import { Profile } from "./Profile";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const stat = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);

export default class App {
  profilesPath = path.join(__dirname, "../../profiles.json");

  public async setProfile(profile: Profile): Promise<void> {
    const commands = [
      `git config --global user.name "${profile.name}"`,
      `git config --global user.email "${profile.email}"`,
      `git config --global user.signingkey ${profile.key}`
    ];

    // Join into a single command
    const command = commands.join(" && ");

    await this.executeCommand(command);
    // tslint:disable-next-line:no-console
    console.log(chalk.green("Profile set"));
  }

  public async storeProfile(profile: Profile): Promise<void> {
    const profiles: Profile[] = await this.getProfiles();
    profiles.push(profile);

    await writeFile(
      this.profilesPath,
      JSON.stringify(profiles, null, 2),
      "utf8"
    );
  }

  public async listProfiles() {
    const profiles: Profile[] = await this.getProfiles();
    profiles.forEach(profile => {
      console.log(profile.name);
      console.log(profile.email);
      console.log(profile.key);
      console.log("\n");
    });
  }

  private executeCommand(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        resolve(stdout.trim());
      });
    });
  }

  async getProfiles(): Promise<Profile[]> {
    let fileInf: fs.Stats;
    try {
      fileInf = await stat(this.profilesPath);
      if (fileInf === null) {
        return;
      }
      return require(this.profilesPath);
    } catch (e) {
      // create file if it doesn't exist
      if (e.code === "ENOENT") {
        const profiles: Profile[] = [];
        await writeFile(
          this.profilesPath,
          JSON.stringify(profiles, null, 2),
          "utf8"
        );
        return profiles;
      } else {
        throw e;
      }
    }
  }
}
