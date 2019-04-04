# git-profile
A tool to help manage switching git profiles.

## Installation
```bash
git clone https://github.com/danjwelsh/git-profile.git
cd git-profile && echo "alias git-profile='node $(pwd)/index.js'" >> ~/.bash_profile
```

## Use
### Add a Profile
git-profile requires a gpg key. To create one install gpg (`brew install gpg` MacOS).
Generate a key, then make a note of the identifier. See this guide for instructions.
Copy the key identifier when prompted.
```bash
git-profile add
```
Then follow the instructions in the tool

### List Profiles
To list your profiles, run:
```bash
git-profile list
```

### Set a Profile
Set a git profile using the name you gave it.
```bash
git-profile set <your-profile-name>
```

### Remove a Profile
Remove a profile using the name you gave it.
```bash
git-profile remove <your-profile-name>
```
