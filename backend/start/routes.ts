import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AchievementsController = () => import('#controllers/achievements_controller')
const ProgressController = () => import('#controllers/progresses_controller')
const DeckRecordsController = () => import('#controllers/deck_records_controller')

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

    router.get('/users/:userId/records', [DeckRecordsController, 'userRecords'])

    router.get('/decks', [DecksController, 'index'])
    router.get('/decks/home', [DecksController, 'home'])
    router.get('/decks/:deckId/training', [DecksController, 'training'])
    router.get('/decks/:id', [DecksController, 'show'])
    router.post('/decks', [DecksController, 'create'])
    router.put('/decks/:id', [DecksController, 'update'])
    router.delete('/decks/:id', [DecksController, 'delete'])
    router.get('/decks/:id/cards', [CardsController, 'byDeck'])

    router.get('/decks/:deckId/records', [DeckRecordsController, 'show'])
    router.post('/decks/:deckId/records', [DeckRecordsController, 'update'])
    router.delete('/decks/:deckId/records', [DeckRecordsController, 'destroy'])
    router.get('/decks/:deckId/leaderboard/:gameMode', [DeckRecordsController, 'leaderboard'])

    router.get('/cards/:id', [CardsController, 'show'])
    router.post('/cards', [CardsController, 'create'])
    router.put('/cards/:id', [CardsController, 'update'])
    router.delete('/cards/:id', [CardsController, 'delete'])

    router.get('/progress/:userId', [ProgressController, 'index'])
    router.get('/progress/:userId/:cardId', [ProgressController, 'show'])
    router.post('/progress/:userId/:cardId/answer', [ProgressController, 'answer'])
    router.get('/progress/:userId/decks/:deckId', [ProgressController, 'byDeck'])

    router.get('/achievements', [AchievementsController, 'index'])
    router.get('/achievements/stats', [AchievementsController, 'stats'])
  })
  .use(middleware.auth({ guards: ['api'] }))
