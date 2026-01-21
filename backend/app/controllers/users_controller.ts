import UsersService from '#services/user_service'
import { createUserValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  private usersService = new UsersService()

  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    try {
      const user = await this.usersService.create(payload)
      return response.created(user)
    } catch (error) {
      return response.status(422).send({ message: error.message })
    }
  }

  async get({ params, response }: HttpContext) {
    const user = await this.usersService.findById(params.id)

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    return response.ok(user)
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator)

    try {
      const user = await this.usersService.update(params.id, payload)
      return response.ok(user)
    } catch (error) {
      return response.status(422).send({ message: error.message })
    }
  }
  async delete({ params, response }: HttpContext) {
    await this.usersService.delete(params.id)

    return response.noContent()
  }
}
