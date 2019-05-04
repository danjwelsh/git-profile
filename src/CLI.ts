import { Profile } from "./Profile";
import * as inquirer from "inquirer";
import App from "./App";

export default class CLI {
  public async getProfile(): Promise<Profile> {
    const questions = [
      {
        message: "Profile name:",
        name: "id",
        type: "input"
      },
      {
        message: "Your full name:",
        name: "name",
        type: "input"
      },
      {
        message: "Your email address:",
        name: "email",
        type: "input"
      },
      {
        message: "Your GPG key:",
        name: "key",
        type: "input"
      }
    ];

    const ans: any = await inquirer.prompt(questions);
    return ans as Profile;
  }

  public async chooseProfile(): Promise<Profile> {
    const app: App = new App();
    const profiles = await app.getProfiles();

    const questions = [
      {
        message: "Profile name:",
        name: "id",
        type: "list",
        choices: profiles.map(profile => profile.id)
      }
    ];

    const ans: any = await inquirer.prompt(questions);
    return profiles.find(profile => profile.id === ans.id);
  }
}
