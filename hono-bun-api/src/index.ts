import { Hono } from 'hono'
import { TUser, User } from './database.service'

const app = new Hono()
const UserObj = new User()

app.get('/users', (c) => {
  const foundUsers = UserObj.getAllUsers()
  if (!foundUsers) return c.json({ error: 'No users found' }, 404)
  return c.json(foundUsers)
})

app.get('/users/:id', async (c) => {
  const foundUser = await UserObj.getUserById((c.req.param('id')))
  if (!foundUser) return c.json({ error: 'User not found' }, 404)
  return c.json(foundUser)
})

app.post('/users', async (c) => {
  const body: TUser = await c.req.json()
  return c.json(UserObj.insertUser(body))
})

app.get('/fake-users/:number', async (c) => {
  const count = parseInt(c.req.param('number'))
  UserObj.generateFakeUsers(count)
  return c.json({ message: `Inserted ${count} fake users` })
})

app.delete('/users/:id', async (c) => {
  return c.json(UserObj.deleteUser(c.req.param('id')))
})

app.delete('/users', async (c) => {
  UserObj.clearUsers()
  return c.json({ message: 'All users deleted' })
})

app.get('/print-users', async (c) => {  
  UserObj.printAllUsers()
  return c.json({ message: 'Printed all users' })
})

export default app
