
## Project Setup Instructions

### Node.js and npm Versions

This project requires the following versions:

- **Node.js**: v22.7.0
- **Docker**: 27.1.2
- **Postgres**: 16.3
- **Node Package Manager**: 10.8.2

To ensure compatibility, please use these specific versions.

### Setting Up Your Environment

Prior to setting up the enviornment, if you are not familiar with Node.js and NPM go through this awsome [blog post](https://medium.com/@oroz.askarov/all-you-need-to-know-about-npm-and-packages-as-a-beginner-b6fcea8b3519).

1. **Install Node Version Manager (nvm)**:
   If you don't already have `nvm` installed, you can install it by following the instructions [here](https://github.com/nvm-sh/nvm#installing-and-updating).
2. **Navigate to the server directory**
   ```bash
   cd server/
   ```
3. **Switch to the required Node.js version**:
   Once `nvm` is installed, navigate to the project directory and run:
   ```bash
   nvm use
   ```
4. **Install the environment incase if it's not already available (optional)**
   If step 2 prompts you to install the environment then run:
   ```bash
   nvm install
   ```
5. **Install the correct npm**:
   Install node package manager with this specific version:
   ```bash
   npm install npm@10.8.2
   ```

### Installing dependencies

1. **Install dependencies by running**
   ```bash
   npm install
   ```
   ### Installing database
   
   To host the database locally we are going to use docker, please make sure that you have docker desktop installed in your PC.

- Once you do, if you have cloned the repo for the first time then type this command in the root directory of the project
```
docker compose up --build
```
- If you are trying to run the database for development run
```
docker compose up
```
