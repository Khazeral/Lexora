import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3).optional(),
    email: vine
      .string()
      .email()
      .unique(async (db, value, field) => {
        const userId = field.meta?.userId

        const user = await db.from('users').where('email', value).whereNot('id', userId).first()

        return !user
      }),
  })
)
