# Cloud & Fog Project

## Introduction

This project is a two-part exercise for the Services in Cloud and Fog Computing course at the Technical University of Crete.

### Part 1 Summary

For the first part of the project, we were asked to create a web application that connects to and manages a MySQL database. The application resembles a simple e-shop, where users can register, login and perform certain actions based on their role:

- **Admins** can manage users.
- **Sellers** can add and manage products.
- **Users** can view products and add them to their cart.

A detailed description of the first part can be found [here](part-1.pdf).

We were allowed to use any programming language and framework we wanted, so I chose to use **Node.js** with **Express** for the backend and **Bootstrap** for the frontend.

### Part 2 Summary

For the second part of the project, we were asked to use Docker to containerize the application and deploy it to Google Cloud Platform (GCP). We were also asked to use MongoDB to store the application's non-user data instead of MySQL and access it through a REST data storage service. Additionally, we had to make changes to our pages so that they update dynamically instead of requiring a page refresh and, finally, we were asked to extend the application's functionality with the following FIWARE services:

- **Orion Context Broker** (pub/sub service).
- **Keyrock Identity Manager** (authentication and authorization service).
- **Wilma** (PEP proxy).

A detailed description of the second part can be found [here](part-2.pdf).

## Application Structure

The application is structured as follows:

- **`/controllers`**: Contains the application's router-level middleware.
- **`/models`**: Contains the application's models.
- **`/public`**: Contains the application's static files.
  - **`/images`**: Contains the application's images.
  - **`/scripts`**: Contains the application's JavaScript files.
  - **`/styles`**: Contains the application's CSS files.
- **`/routes`**: Contains the application's routes.
- **`/utils`**: Contains the application's utility functions.
- **`/views`**: Contains the application's views.
- **`app.js`**: The application's main file.
- **`config.js`**: The application's dotenv configuration file.
- **`docker-compose.yml`** and **`Dockerfile`**: The application's Docker configuration files.
- **`middleware.js`**: The application's app-level middleware.
- **`package.json`**: The application's dependencies.
- **`schemas.js`**: The application's Joi validation schemas.

## Application Setup

[Docker](https://www.docker.com/) is required to run the application. Once you have Docker installed, you can run `docker-compose up -d` to build and start the application, Keyrock and the databases. Then, you will need to connect to Keyrock at <http://localhost:3005> with the following credentials:

- **Email**: `admin@tuc.gr`
- **Password**: `admin`

and create a new application. Once you have created the application, you will need to copy its ID and secret to the `docker-compose.yml` file in the `app` service's environment variables `KEYROCK_ID` and `KEYROCK_SECRET` respectively.

Finally, you can run `docker-compose up -d` again to rebuild the application with the new environment variables and start it. The application will be available at <http://localhost>. You can run `docker-compose down` to stop and remove the application and its containers.

If you want to run the application locally, you will also need to install [Node.js](https://nodejs.org/) and create a `.env` file in the root directory with the following variables:

- `NODE_ENV`: The environment the application will run on (development or production).
- `PORT`: The port the application will run on.
- `DB_HOST`: The host of the MySQL database.
- `DB_PORT`: The port of the MySQL database.
- `DB_USER`: The user of the MySQL database.
- `DB_PASS`: The password of the MySQL database.
- `DB_NAME`: The name of the MySQL database.
- `KEYROCK_HOST`: The URL of the Keyrock Identity Manager.
- `KEYROCK_ID`: The ID of the Keyrock application.
- `KEYROCK_SECRET`: The secret of the Keyrock application.
- `KEYROCK_ADMIN`: The admin username of the Keyrock application.
- `KEYROCK_PASS`: The admin password of the Keyrock application.

Then, you can run `npm install` to install the application's dependencies and `npm start` to start the application. By default, the application will be available at <http://localhost:3000> (or the port you specified in the `.env` file).

## Notes

The application's frontend is a bit barebones as it served mostly as an interface to the backend. Also, due to time constraints, certain features were not implemented, such as the pub/sub service and the proxy.

## License

This project is licensed under the terms of the [ISC License](https://opensource.org/licenses/ISC).
