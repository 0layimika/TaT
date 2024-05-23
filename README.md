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
- `package.json` : This file contains the scripts and list of dependencies
- `server.js`: This is the main entry point of the program and it initiates the connection with the server

## What the Model looks like
### UserSchema: This creates the User table and defines user attribute
#### User attribute and data type: 
- `name`: String
- `email`: String
- `password`: String
- `avatar`: String
- `date`:Date

### ProfileSchema: This creates the Profile table and defines Profile attribute
#### Profile attribute and data type:
- `User`: Object
- `website`: String
- `Location`: String
- `company`: String
- `status`: String
- `website`: String
- `skills`: Array[String]
- `bio`: String
- `githubusername`: String
- `date`: Date
- `social`: {
  - `Instagram`: String
  - `Twiter`: String
  - `Youtube`: String
  - `Linkedin`: String
  - `Facebook` : String
}
- `Education` : [{
  - `school`: String
  - `degree`: String
  - `fieldofstudy`: String
  - `from`: Date
  - `to`: Date
  - `current`: Boolean
  - `description`: String
}]
- `Experience` : [{
  - `title`: String
  - `company`: String
  - `location`: String
  - `from`: Date
  - `to`: Date
  - `current`: Boolean
  - `description`: String
}]

### PostSchema: This creates the Post table and defines Post attribute
#### Post attribute and data type:
<!-- user, text, avatar, name, likes, comments -->
- `user`: Object
- `text`: String
- `avatar`: String
- `name`: String
- `date`: Date
- `likes`:[{
  - `user`: Object
}]
- `comments`:[{
  - `user`: Object
  - `text`: String
  - `avatar`: String
  - `name`: String
  - `date`: Date
}]


## Conclusion

This documentation provides an overview of the structure and key components of the API. For more detailed information on each component and their functions, refer to the corresponding source code files in the repository. -->
