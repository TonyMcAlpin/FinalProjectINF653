const express = require('express');
const router = express.Router();
const path = require('path');
const statesController = require('../../controllers/statesController');


// Define route handlers
router.route('/')
    .get(statesController.getAllStates)
    //Used to add state to mongoDB only
    .post(statesController.addState);

router.get('/:state/capital', statesController.getStateCapital);
router.get('/:state/nickname', statesController.getNickName);
router.get('/:state/population', statesController.getPopulation);
router.get('/:state/admission', statesController.getAdmission);
router.get('/:state', statesController.getState);
router.get('/:state/funfact', statesController.getRandomFunFact);

router.post('/:state/funfact', statesController.addFunFacts);
router.delete('/:state/funfact', statesController.deleteFunFact);

// Middleware for unmatched routes
router.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

module.exports = router;
