import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const DecksController = () => import('#controllers/decks_controller')
const CardsController = () => import('#controllers/cards_controller')

router.post('/login', [AuthController, 'login'])
router.post('/signup', [AuthController, 'signup'])

router
  .group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.get('/me', [AuthController, 'me'])

    router.get('/users/:id', [UsersController, 'get'])
    router.put('/users/:id', [UsersController, 'update'])
    router.delete('/users/:id', [UsersController, 'delete'])

    // Decks
    router.get('/decks', [DecksController, 'index'])
    router.get('/decks/home', [DecksController, 'home'])
    router.get('/decks/:deckId/training', [DecksController, 'training'])
    router.get('/decks/:id', [DecksController, 'show'])
    router.post('/decks', [DecksController, 'create'])
    router.put('/decks/:id', [DecksController, 'update'])
    router.delete('/decks/:id', [DecksController, 'delete'])
    router.get('/decks/:id/cards', [CardsController, 'byDeck'])

    router.get('/cards/:id', [CardsController, 'show'])
    router.post('/cards', [CardsController, 'create'])
    router.put('/cards/:id', [CardsController, 'update'])
    router.delete('/cards/:id', [CardsController, 'delete'])
  })
  .use(middleware.auth({ guards: ['api'] }))
