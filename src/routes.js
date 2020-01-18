const { Router } = require('express');
const DeveloperController = require('./controllers/DeveloperController');
const SearchController = require('./controllers/SearchController');

const router = Router();

// Query Params: request.query (filters, order, pagination...)
// Route Params: request.params (identity resources)
// Body: request.body

router.get('/developers', DeveloperController.index);
router.post('/developers', DeveloperController.create);

router.get('/search', SearchController.index);

module.exports = router;