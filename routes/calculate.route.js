const express = require('express');
const router = express.Router();
CalculateService = require('../services/calculate.service');
router.use(express.urlencoded({ extended: true }));
const { Worker } = require("worker_threads");


router.post('/', async (req, res, next) => {
    try {
      const worker = new Worker('./workers/worker.js', {
        workerData: {
          value: req.body.int,
        }
      });

      worker.on('message', (result) => {
        console.log('RESULT', result);
        res.render('index', { result });
      });

      worker.on('error', (error) => {
        console.error('Worker error:', error.stack || error.message || error);
        next(error);
      });

  // let calculations = await CalculateService.canGetNeededValue(req.body.int);
    } catch (error) {
      console.error('Error creating worker:', error);
      next(error);
    }
});

module.exports = router;
