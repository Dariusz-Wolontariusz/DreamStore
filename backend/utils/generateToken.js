import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
  //generates token used in authorisation

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })

  // set JWT to HTTP-only cookie

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'developement',
    sameSite: 'strict',
    // secure: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
  })
}

export default generateToken
