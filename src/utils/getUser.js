import jwt from 'jsonwebtoken'

export const getUser = async (authorization, User) => {
  const token = authorization.replace('Bearer ', '')
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const user = await User.findByPk(id)
    if (!user) return null

    // Extract password and other misc info so that they do not exist in the `me` object in context.
    const { password, createdAt, updatedAt, tokensBlacklist, ...userProps } = user.dataValues

    // If token is in the blacklist, do not pass `me` into context. User will be unauthorized to do anything that requires authorization.
    if (tokensBlacklist.includes(token)) return null

    return { ...userProps }
  } catch (error) {
    return null
  }
}
