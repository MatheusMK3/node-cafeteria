## Usage:
Simply download and copy Cafeteria to your server location.
Edit the 'config.json' file if you want to change ports, etc.
Add your applications to the 'app' folder.
Start the server using the `node .` command, sit back and relax.

## Supported Applications
Right now, Cafeteria supports the following application types:

### HTML
Just a plain simple HTML app consisting of folders with HTML files and resources.

### Express
Express apps that are enabled to run as Node.js modules. Just copy the application directory over to your `app` folder

### Node.js / Express Router
We also support running the app directly from an Express router. Just create a Node.js application/module with `npm init` and pass the Express router to `module.exports`.
