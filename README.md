This project uses several scripts to help with development, building, linting, previewing, and running a server. Here's a brief explanation of each script:

*  dev: This script runs the Vite development server. You can start the server by running npm run dev.

*  build: This script first runs the TypeScript compiler (tsc) to check for any type errors and then builds the project for production using Vite. You can build the project by running npm run build.

*  lint: This script runs ESLint on all TypeScript files in the project. It reports unused ESLint disable directives and fails on any warnings. You can lint your project by running npm run lint.

*  preview: This script runs the Vite preview server, which lets you preview your production build. You can start the preview server by running npm run preview.

*  server: This script runs a JSON server with the database file located at src/server/db.json. The server runs on port 3001. You can start the server by running npm run server.

*  Please ensure you have Node.js and npm installed on your machine before running these scripts. If you don't have these installed, you can download and install them from the official Node.js website.


Installation
To install the project dependencies, run the following command:

```bash
pnpm install
```
or
```bash
npm install
```

* first run server
```bash
pnpm run server 
```
or

```bash
npm run server 
```

* second run project in development
```bash
pnpm run dev 
```
or
```bash
npm run dev 
```
To build the project for production, run the following command:

```bash
pnpm run lint 
```
or
```bash
npm run lint 
```

To preview the production build, run the following command:
```bash
pnpm run preview 
```
or
```bash
npm run preview 
```

Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.