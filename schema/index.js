const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const pgdb = require('../database/pgdb');
const UserType = require('./types/user');

//The RootQueryType is where in the data graph
//we can start asking questions.
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',

  fields: {
    //hello: {
      //type: GraphQLString,
      //description: 'The *mandatory* hello world example, GraphQL example.',
      //resolve: () => 'world'
      user: {
        type: UserType,
        description: "The current user identified by an API key.",
        args: {
          key: {type: new GraphQLNonNull(GraphQLString)}
        },
        resolve: (obj, args, {pgPool}) => {
          return pgdb(pgPool).getUserByApiKey(args.key);
          //Read user information from database.
          //using args.key as the API key.
        }
      }
    }
});


const nSchema = new GraphQLSchema({
  query: RootQueryType
  //mutation:
});

module.exports = nSchema;
