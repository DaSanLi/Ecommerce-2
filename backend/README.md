IMPORTANT: for the API to work correctly, a `.env` file must be created (currently located at the project root) with the following database parameters. The `secret` field is the secret key used to sign JWT tokens.

DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
secret=

------------------------------------------------------------------------------------------------------------------

Endpoints =>

(GraphQL endpoint — used to create, update, and soft-delete users and tasks)
/graphql

(REST API endpoint for hard-deleting a user using the DELETE method.
The user ID is passed as a URL parameter)
/users/hardDelete/{userId}





