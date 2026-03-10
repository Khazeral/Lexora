import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)

      return response.ok({
        token: token.value!.release(),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      })
    } catch (error) {
      return response.unauthorized({
        message: 'Email ou mot de passe incorrect',
      })
    }
  }

  async signup({ request, response }: HttpContext) {
    const { username, email, password } = request.only(['username', 'email', 'password'])

    try {
      const existingUser = await User.query()
        .where('email', email)
        .orWhere('username', username)
        .first()

      if (existingUser) {
        console.log('User already exists')
        return response.badRequest({ message: 'User already exists' })
      }

      const user = await User.create({
        username,
        email,
        password,
      })

      const token = await User.accessTokens.create(user)

      return response.created({
        token: token.value!.release(),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      })
    } catch (error) {
      console.error('Signup error:', error.message)
      return response.badRequest({ message: 'Signup failed' })
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return response.ok({ message: 'Logged out' })
  }

  async me({ auth, response }: HttpContext) {
    await auth.authenticate()
    const user = auth.user!

    return response.ok({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  }
}
