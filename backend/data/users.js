import bcryptjs from 'bcryptjs'

const users = [
  {
    name: 'Admin user',
    email: 'admin@dreamshop.com',
    isAdmin: true,
    password: bcryptjs.hashSync('123456', 10),
  },
  {
    name: 'Dariusz Wolontariusz',
    email: 'physiodarek@gmail.com',
    password: bcryptjs.hashSync('123456', 10),
  },
  {
    name: 'Raquel Antigua',
    email: 'pelo_loco@gmail.com',
    password: bcryptjs.hashSync('123456', 10),
  },
]

export default users
