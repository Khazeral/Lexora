import vine from '@vinejs/vine'

export const createCardValidator = vine.compile(
  vine.object({
    word: vine.string().trim().minLength(1),
    translation: vine.string().trim().minLength(1),
    deckId: vine.number().positive(),
  })
)

export const updateCardValidator = vine.compile(
  vine.object({
    word: vine.string().trim().minLength(1).optional(),
    translation: vine.string().trim().minLength(1).optional(),
    deckId: vine.number().positive().optional(),
  })
)
