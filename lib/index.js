const { nodeEnv } = require('./util');
console.log(`Running in ${nodeEnv} mode...`);

const DataLoader = require('dataloader');
const pg = require('pg');
const pgConfig = require('../config/pg')[nodeEnv];
const pgPool = new pg.Pool(pgConfig);
const pgdb = require('../database/pgdb')(pgPool);

const app = require('express')();

const nSchema = require('/Users/snigdhakakkar/name-contests/schema');
var graphqlHTTP = require('express-graphql');

const {MongoClient} = require('mongodb');
const assert = require('assert');
const mConfig = require('../config/mongo')[nodeEnv];

MongoClient.connect(mConfig.url, (err,mPool) =>{
  assert.equal(err, null);

  app.use('/graphql', (req, res) => {

    const loaders = {
      usersByIds: new DataLoader(pgdb.getUsersByIds)
    };
    graphqlHTTP({schema: nSchema,
    graphiql: true,
    context: {pgPool, mPool, loaders}
  })(req, res);
  });



  const PORT = process.env.PORT || 4000;
   app.listen(PORT, () =>{
   console.log('Server is listening on port ${PORT}');
   });
});
