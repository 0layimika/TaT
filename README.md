# API Documentation
# Overview
This document provides an overview of the API structure and key components of the API. The API is for creating a community for tech enthusiasts where each user has a profile(note: profile has to be created for user after sign up) and can create a post, like a post and comment on a post.
# Getting Started
To run the API locally, follow these steps:
### Prerequisite:
- node.js must be installed on your system
- Refer to package.json for required dependencies</li>
## Running the API
- Run the start command : npm run server
## Folder Structure

The API project has the following folder structure. It is important to know this outlines only the vital files and folders responsible for the running of the API: 
- `config`
  - `db.js`:handles the connection to the mongo database using mongoose
- `middleware`
  - `auth.js`: this is the middleware that handles authentication and generates web token
- `models`
  - `Post.js`: This is the schema of the "Post" table of the database
  - `Profile.js`: This is the schema of the "Profile" table of the database
  - `User.js`: This is the schema of the "User" table of the database
- `routes`
  - `api`
    - `auth.js`: This contains all the endpoints for authenticating a user i.e sign up and login
    - `posts.js`: this contains all the endpoints for handling a post. Creating a new post, Deleting a post, Liking a post, removing like, aadding a comment, deleting a comment
    - `profile.js`: this contains all the endpoints for handling profile. Creating profile for a user and adding and removing several details
    - `users.js`: this contains the endpoint for creating a new user

<!-- ## `manage.py`
The `manage.py` file is the main entry point and it holds all the command to be performed on the server. It initializes the sqlite3 connection and starts the HTTP server.

## `views.py`

The `views.py` folder contains HTTP request handler functions for managing Person resources. It includes functions for creating, retrieving, updating, and deleting Person objects.

- `person_list`: Creates a new Person.
- `person_detail`: Retrieves a Person by id, updates an existing person and also deletes a person by id

The `models.py` folder defines the data structure for a Person and provides database-related functionality.

- `Person`: Represents a Person resource.

## Conclusion

This documentation provides an overview of the structure and key components of the API. For more detailed information on each component and their functions, refer to the corresponding source code files in the repository. -->
