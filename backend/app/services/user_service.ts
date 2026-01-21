import User from '#models/user'

export default class UsersService {
  async create(payload: { username: string; email: string }) {
    const existing = await User.query().where('email', payload.email).first()
    if (existing) {
      throw new Error('Email already in use')
    }
    return User.create(payload)
  }

  async update(id: number, payload: { username?: string; email?: string }) {
    const user = await User.findOrFail(id)

    if (payload.email) {
      const existing = await User.query().where('email', payload.email).whereNot('id', id).first()
      if (existing) {
        throw new Error('Email already in use')
      }
    }

    user.merge(payload)
    await user.save()

    return user
  }

  async findById(id: number) {
    return User.find(id)
  }

  async delete(id: number) {
    const user = await User.findOrFail(id)
    await user.delete()
  }
}
