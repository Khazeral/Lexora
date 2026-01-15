/*
|--------------------------------------------------------------------------
| routers file
|--------------------------------------------------------------------------
|
| The routers file is used for defining the HTTP routers.
|
*/

import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/', 'UsersController.create')
    router.get('/:id', 'UsersController.show')
    router.put('/:id', 'UsersController.update')
    router.delete('/:id', 'UsersController.delete')
  })
  .prefix('/users')

router
  .group(() => {
    router.get('/', 'DecksController.index')
    router.get('/:id', 'DecksController.show')
    router.post('/', 'DecksController.create')
    router.put('/:id', 'DecksController.update')
    router.delete('/:id', 'DecksController.delete')
    router.get('/:id/cards', 'DecksController.cards')
  })
  .prefix('/decks')

router
  .group(() => {
    router.get('/:id', 'CardsController.show')
    router.post('/', 'CardsController.create')
    router.put('/:id', 'CardsController.update')
    router.delete('/:id', 'CardsController.delete')
  })
  .prefix('/cards')

router
  .group(() => {
    router.get('/:userId', 'ProgressController.index')
    router.get('/:userId/:cardId', 'ProgressController.show')
    router.patch('/:userId/:cardId', 'ProgressController.update')
    router.get('/:userId/decks/:deckId', 'ProgressController.byDeck')
  })
  .prefix('/progress')

router
  .group(() => {
    router.get('/users/:userId', 'SecretsController.index')
  })
  .prefix('/secrets')

router.get('/leaderboard', 'LeaderboardController.index')
