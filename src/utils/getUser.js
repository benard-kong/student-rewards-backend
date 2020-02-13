import jwt from 'jsonwebtoken'

export const getUser = async (authorization, User) => {
  const token = authorization.replace('Bearer ', '')
  try {
    const { id, email } = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const user = await User.findByPk(id)
    if (!user) return null
    return { id, email }
  } catch (error) {
    return null
  }
}
