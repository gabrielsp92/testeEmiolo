# teste_emiolo
Atividade teste para Emiolo, Servidor REST, Node.js, MongoDB, 

public Endpoints:
POST/user = create user
POST/login = authenticate credentials and returns token(x-auth) in header.
GET/user/:id = find user by id

Private Endpoints:
GET/user : get all users registered
GET/me : get user information by token;
DELETE/user/me/token: delete current token and logout;
