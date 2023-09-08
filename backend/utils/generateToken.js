//old token generator - moved to usersController

import jwt from 'jsonwebtoken'

//generates token used in authorisation
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

export default generateToken
