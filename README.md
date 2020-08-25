for registration and email confiramtion

for login:

- checi if user is trying to signin but havent signup yet
  *check if password match with hased_password that is saved in db
  *if yes, generate token woth expriy
  *the token will be send to client/react
  *it will be used as jwt based authentication system
  *we can allow user to access protected routes later if they have valid token
  *so jwt token is like password with expriy
- in successfull signin we will send user info and valid token
- this token will be send back to server from client/react to access protect

Login with google
console.cloud.google.com

on top blue menu bar click to create a nwe project
on left sidebar menu > API & Serivice > credenyials
create credentials > OAuth client id

...if the options are greyed out?
click on configure consent screem > blue button on top right
Go with forms.. domain name... type anything... workd

In create OAUth client id page
just enter javascript origins > http://localhost:3000
