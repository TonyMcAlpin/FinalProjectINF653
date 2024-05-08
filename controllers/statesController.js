const State = require('../model/State');
const path = require('path');
const fs = require('fs'); 
const filePath = path.resolve(__dirname, '../model/states.json');



const getAllStates = async (req, res) => {
  try {
        
    const statesData = await fs.promises.readFile(path.resolve(__dirname, '../model/states.json'), 'utf8');
    let states = JSON.parse(statesData);
    
    if (req.query.contig === 'true') {
      states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
    }
    
    if (req.query.contig === 'false') {
      states = states.filter(state => state.code === 'AK' || state.code === 'HI');
    }
    
    const statesFromDB = await State.find();
    statesFromDB.forEach(stateFromDB => {
      const stateIndex = states.findIndex(state => state.code === stateFromDB.stateCode);
      if (stateIndex !== -1) {
        states[stateIndex].funfacts = stateFromDB.funfacts;
      }
    });
    res.json(states); 
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const getState = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();

  try {
    const statesData = await fs.promises.readFile(path.resolve(__dirname, '../model/states.json'), 'utf8');
    const states = JSON.parse(statesData);

    const state = states.find(state => state.code === stateCode);

        
    if (!state) {
      return res.status(404).json({ "message": `Invalid state abbreviation parameter` });
    }

  
    const statesFromDB = await State.findOne({ stateCode });

    
    if (statesFromDB) {
      state.funfacts = statesFromDB.funfacts;
    }

    res.json(state);
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getStateCapital = (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Error reading states.json file.' });
    }
    try {
      const statesData = JSON.parse(data);
      console.log("States Data:", statesData);
      const state = statesData.find(state => state.code === stateCode);

      if (!state) {
        return res.status(404).json({ "message": 'Invalid state abbreviation parameter' });
      }

        
      res.json({ 'state': state.state, 'capital': state.capital_city });
    } 
    catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ 'message': 'Error parsing states.json file.' });
    }
  });
}

const getNickName = (req, res) => {
  const stateCode = req.params.state.toUpperCase(); 
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ 'message': 'Error reading states.json file.' });
    }
    try {
  
      const statesData = JSON.parse(data);
      console.log("States Data:", statesData);
      const state = statesData.find(state => state.code === stateCode);

      if (!state) {
          return res.status(404).json({ "message": 'Invalid state abbreviation parameter' });
      }
      res.json({ 'state': state.state, 'nickname': state.nickname });
    } 
    catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ 'message': 'Error parsing states.json file.' });
    }
  });
}

const getPopulation = (req, res) => {
    const stateCode = req.params.state.toUpperCase(); 

    //Read states.json
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Error reading states.json file.' });
      }
      try {
        const statesData = JSON.parse(data);
        const state = statesData.find(state => state.code === stateCode);
        
        if (!state) {
          return res.status(404).json({ "message": `Invalid state abbreviation parameter` });
        }
        const formattedPopulation = state.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        res.json({ 'state': state.state, 'population': formattedPopulation });
      } 
      catch (parseError) {
        console.error(parseError);
        return res.status(500).json({ 'message': 'Error parsing states.json file.' });
      }
    });
}


const getAdmission = (req, res) => {
    const stateCode = req.params.state.toUpperCase(); 
    console.log("State Code:", stateCode);
    

    //Read states.json
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Error reading states.json file.' });
      }

      try {
           
        const statesData = JSON.parse(data);
        console.log("States Data:", statesData);
        const state = statesData.find(state => state.code === stateCode);
        
        if (!state) {
          return res.status(404).json({ "message": `Invalid state abbreviation parameter` });
        }

            
        res.json({ 'state': state.state, 'admitted': state.admission_date  });
      } 
      catch (parseError) {
        console.error(parseError);
        return res.status(500).json({ 'message': 'Error parsing states.json file.' });
      }
    });
}



const getRandomFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
  
    
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Error reading states.json file.' });
      }

      try {
        const statesData = JSON.parse(data);
        const stateInJSON = statesData.find(state => state.code === stateCode);

        if (!stateInJSON) {
          return res.status(404).json({ "message": 'Invalid state abbreviation parameter' });
        }
        
        const state = await State.findOne({ stateCode });

        if (!state || !state.funfacts || state.funfacts.length === 0) {
          return res.status(404).json({ message: `No Fun Facts found for ${stateInJSON.state}` });
        }

        const randomIndex = Math.floor(Math.random() * state.funfacts.length);
        const randomFunFact = state.funfacts[randomIndex];

        res.json({ state: state.state, funfact: randomFunFact });
      } 
      catch (parseError) {
            console.error(parseError);
            return res.status(500).json({ 'message': 'Error parsing states.json file.' });
      }
  });
};


//Post

//This was used to add states to mongoDB from VS code
const addState = async (req, res) => {
    try {
        const newState = await State.create({
            stateCode: req.body.stateCode,
            funfacts: req.body.funfacts
        });
        res.status(201).json(newState);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const addFunFacts = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const funFacts = req.body.funfacts; 

  try {
    if (!funFacts) {
      return res.status(400).json({ message: 'State fun facts value required' });
    }
    
    if (!Array.isArray(funFacts)) {
      return res.status(400).json({ message: 'State fun facts value must be an array' });
    }
    if (funFacts.length === 0) {
      return res.status(400).json({ message: 'State fun facts value required' });
    }
    let state = await State.findOne({ stateCode });
    
    if (!state) {
      return res.status(404).json({ message: `State with code ${stateCode} not found.` });
    }

    const mergedFunFacts = [...new Set([...(state.funfacts || []), ...funFacts])];
    state.funfacts = mergedFunFacts;
    
    await state.save()
    
    res.status(200).json({ funfacts: state.funfacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const deleteFunFact = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const index = req.body.index;
  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ 'message': 'Error reading states.json file.' });
    }

    try {
      const statesData = JSON.parse(data);
      const stateInJSON = statesData.find(state => state.code === stateCode);
      if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
      }


      let state = await State.findOne({ stateCode });

      if (!state) {
        return res.status(404).json({ message: `State with code ${stateCode} not found.` });
      }
      if (!state.funfacts){
        return res.status(400).json({ message: `No Fun Facts found for ${stateInJSON.state}` });
      }
      
      if (index < 0 || index >= state.funfacts.length) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${stateInJSON.state}` });
      }
      
      

      state.funfacts.splice(index, 1);
      await state.save();

      res.status(200).json({ message: 'Fun fact removed successfully', funfacts: state.funfacts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};



module.exports = {
  getAllStates,
  getState,
  getStateCapital,
  getNickName,
  getPopulation,
  getAdmission,
  addFunFacts,
  addState,
  getRandomFunFact,
  deleteFunFact
}
