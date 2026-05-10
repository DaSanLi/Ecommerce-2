IMPORTANTE: para el correcto funcionamiento del api se debe crear un .env (actualmente lo tengo establecido en la raiz del proyecto) con los siguientes parametros de tu db. Mientras que secret es la palabra secreta utilizada para firmar los tokens de JWT

DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
secret=

------------------------------------------------------------------------------------------------------------------

Endpoints =>

(Se utiliza para crear, actualizar, eliminar de manera blanda a usuarios y tareas)
/graphql

(Se utilizará REST API para el borrado duro del usuario, utilizando el metodo delete. 
Se pasa por parametros el id del usuario)
/users/hardDelete/id del usuario 





