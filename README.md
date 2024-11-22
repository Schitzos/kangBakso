# Project Setup Guide
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Schitzos_kangBakso&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Schitzos_kangBakso)[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Schitzos_kangBakso&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Schitzos_kangBakso)[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Schitzos_kangBakso&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Schitzos_kangBakso)[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Schitzos_kangBakso&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Schitzos_kangBakso)[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=Schitzos_kangBakso)](https://sonarcloud.io/summary/new_code?id=Schitzos_kangBakso)[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-light.svg)](https://sonarcloud.io/summary/new_code?id=Schitzos_kangBakso)

 
## Introduction

This guide will walk you through the steps to set up and run the project. The project is built using React Native v0.73.2 and requires Node.js version 18 or above, as well as Java version 17.

## Prerequisites

Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Installation

1. Clone the repository to your local machine:
2. Navigate to the project directory:
3. Now create file .env on your root folder and put this value before doing npm install
   You can get env from (https://docs.google.com/document/d/16FgAPo1a4jcE7mMYl1oGUd0R7gAAAZjMofWE8AVvvRQ/edit?usp=sharing)
4. If you are using WindowsOS, please go to package.json and comment section postinstall in script, the script will only run on linux based OS and MacOS.   
5. Install project dependencies:

    ```bash
    npm install
    ```

   Make some  ☕️ , this will take little bit long in first run
   * For linux based OS and MacOS, this will install project dependency in node_modules also generate a google-services.json and install pod dependency (pod install)GoogleService-Info.plist if you running on macOS
6. If you are using WindowsOS please run script below before run the app:

   ```bash
   npm run android:generate-google-services-json
   ```

7. If you got some error while IOS installation, kindly remove package.lock.json and Podfile.lock is root/ios/Podfile.lock then run command below
   ```bash
   npm run ios:reinstall
   ```
   
## Running the Project

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android
```

### For iOS

```bash
# using npm
npm run ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

# Have fun to pick pokemon and feed them till it evolve !!
