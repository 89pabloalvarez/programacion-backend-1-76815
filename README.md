# Proyecto Backend 1 - comisión 76815 - Products & Carts API

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