# Proyecto Backend 1 - comisión 76815 - Products & Carts API

# ¡¡SETUP!!

Se precisa crear el archivo ".env" con los siguientes datos dentro:

MONGO_USER=89pabloalvarez_db_user
MONGO_PASS=LEvq3tl9dDKeiXNM
MONGO_CLUSTER=mth3zdu.mongodb.net
MONGO_DB_NAME=db

(claramente es información sensible que no se publica! pero a fines prácticos de una entrega de un trabajo práctico, para un curso, se me puede permitir la inseguridad de este README; ".env" esta dentro del gitignore, seria peor sacarlo de ahi y subir directamente el .env a github)

## Entrega final:
Para ésta entrega tengo sentimientos encontraodos, me encanto la integración de Mongo, cuando empece a cargar productos y lo veia, me encantó, fue una alegría posta!. Pero despues me encontre con algunos problemas y me costaron un poco resolver, sobre todo la adaptación de los web-sockets, esos handlebars me resultaron muy complicados y fue lo que mas tiempo me llevo arreglar, pero funciona y funciona BIEN! Agregar al HTML los botones y controles fue un dolor de cabeza, casi como a prueba y error, hice bastantes arreglos, muchos mas de los que subí en los distintos commit, finalmente funcionó todo y viendo todo por lo que pase, puedo decir que me sirvió el curso y SI aprendí!!. Pero honestamente me quedo mas con SQL, no me gusta manejar "docs", los veo como "archivos sueltos" dentro de una carpeta que es el controller dentro del schema; no se, tal vez es mas rapido o mas optimo, pero no, realmente no me gusta, aunque yo tenga un model y se inserte correctamente y en un update tambien use el model, igual siento que no es un doc estructurado y no se, mongo APRENDI, pero NO me gusta. En fin, al igual que la entrega anterior, le dedique muchos dias y horas, espero que este aprobado. Saludos!

## Segunda entrega:
En la segunda entrega agrego a la version de la primer entrega el manejo de handlebars y de websocket, se agrega la configuración necesaria a la ya existente configuración de express.  
Se cumple con las consignas de crear las rutas de "/" y "/realtimeproducts" para las vistas HTML de handlebars y de websockets para las actualizaciones en tiempo real para la interfaz del usuario. 
Se llamaron a los métodos ya existentes de los managers de products para actualizar el .json.  
Siguiendo con el esquema que ya venia trabajando, modularicé la configuración para que sea un "server.js" limpio y las rutas quedaran alojadas a las clases que corresponden. 
Se separaron los .css a la carpeta pública (si lo dejaba en las views, el browser no lo tomaba).  
Se hizo una regresión de la collection de postman y se verifico que la api sigue funcionando igual, asi que el nuevo código no afecto a lo anterior. Adhisionalmente se agregó una nueva carpeta a la collection para probar las vistas de "Home" y "RealTimeProducts".  

## Primera entrega:
Ésta primera entrega del proyecto me llevó bastante esfuerzo, pero como consecuencia, también me llevo mucho conocimiento aprendido.  
Me costó porque tuve que pensar en cada detalle de validación, en cómo estructurar los managers y en cómo devolver respuestas claras y consistentes para el usuario.  
Aprendí muchísimo sobre:
- Buenas prácticas de HTTP status codes. (cuando usar un 200, cuando un 201 o un 400, etc.)
- Validaciones de campos (faltantes, extra, tipos incorrectos).
- Cómo mantener el código DRY y modular.
- Cómo modelar datos en JSON y simular una base de datos.
- La importancia de dar feedback útil y preciso a los usuarios que consuman mi API.

En resumen: fue desafiante, pero me dejó una experiencia sólida en diseño básico de APIs en node.js y express.

---

No tengo un swagger armado, pero en la raiz del proyecto dentro de la carpeta Postman_Collection se puede encontrar el json "backend-1-76815.postman_collection" que armé para probar el proyecto.

---

Por último, "server.js" es de donde se inicia la API y éste archivo esta dentro de src, no en el root del proyecto, es por eso que en el package.json configuré el script "start" con el comando "node src/server.js"