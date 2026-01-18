import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    console.log('=== LOGIN ATTEMPT ===')
    console.log('Email:', email)
    console.log('Password:', password)

    try {
      const user = await User.verifyCredentials(email, password)
      console.log('User verified:', user.email)

      const token = await User.accessTokens.create(user)
      console.log('Token created')

      return response.ok({
        token: token.value!.release(),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      })
    } catch (error) {
      console.error('Login error:', error.message)
      return response.unauthorized({ message: 'Invalid credentials' })
    }
  }

  async signup({ request, response }: HttpContext) {
    const { username, email, password } = request.only(['username', 'email', 'password'])

    console.log('=== SIGNUP ATTEMPT ===')
    console.log('Username:', username)
    console.log('Email:', email)

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
      console.log('User created:', user.email)

      const token = await User.accessTokens.create(user)
      console.log('Token created')

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
    const user = auth.user as unknown as User
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return response.ok({ message: 'Logged out' })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.user as unknown as User

    return response.ok({
      id: user.id,
      username: user.username,
      email: user.email,
    })
  }
}
