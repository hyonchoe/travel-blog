## Project Name & Description
Travel Blog

Web application (frontend) to document user's travels and serve as space where user can easily reflect back on the memories and impact each travel provided.

Current published features:
- Create, view, edit, and delete trip information
- Trip information supports
  - Journal entry
  - Locations
  - Photos
- Public or private trip to control privacy
- Splash page displays public trips, and private trips (and trip creation) available upon login

For backend, visit https://github.com/hyonchoe/travel-blog-backend

## Live Demo / Deployed Application
Live website: https://notemytravels.netlify.app/
(Note: if heroku dyno that hosts the backend needs to spin up to start serving requests, it may take a while for the first load)

### Screenshot examples
Splash page / Public Trips
<>

Add/Edit Trip
<>

## Reflection
I developed this project:
- to learn React and Node.js (for backend piece) as it was my first time working with both of them
- to give myself a tool to track my travels and reflect back on experiences.

I made use of Create React App to bootstrap the project and have it handle setup and environment configuration to more efficiently spend my time working and learning React development.

Common challenge I experienced during this project development was time-consuming nature of the initial learning and research phase.
Some examples include:
- getting familiar with React
- file uploads (and specficially AWS S3 direct upload)
- Google Map integration
- user authentication
- unit testing tools

Another specific challenge was an attempt to implement virtualized list (provided via npm package) to provide better performance when loading many public trips.
Due to how Trip card element (the main display element for trip information) currently changes its height often based on the content displayed, it resulted in need of performance degrading height re-calculation often and showed unsightly scrollbar height changes with virtualzied list implementation.
Instead of using virtualized list, I took a different and simpler approach of loading public trip data incrementally via "Load more" button and removing old trip data (i.e, those that have displayed earlier in time) once a threshold limit has reached for performance consideration.
I plan on re-visiting virtualized list implementation after Trip card improvements are made.

The tools/technology used to build this project include: React, React Router, Ant Design, Auth0, axios, history, react-google-autocomplete, react-google-maps, JavaScript, JSX, CSS.
Jest, Enzyme, and react-test-renderer were used for testing needs.

## Create React App details

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

#### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

#### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

#### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

#### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

#### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

#### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
