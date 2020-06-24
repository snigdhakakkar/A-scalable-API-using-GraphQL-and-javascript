const humps = require('humps');
const _ = require('loadash');

module.exports = pgPool => {
  const orderedFor = (rows, collection, field) => {
    // return  the rows ordered for collection
    const data = humps.camelizeKeys(rows);
    const inGroupsOfField = _.groupBy(data, field);
    return collection.map(element => {
      const elementArray = inGroupsOfField[element];
      if (elementArray) {
        return elementArray[0];
      }
      return {};
    });
  };

  return {
    getUsersByIds (userIds){
      return pgPool.query(`
        select * from Users
        where id = ANY($1)
        `,[userIds]).then(res => {
          return orderedFor(res.rows, userIds, 'id');
        });
    },

    getUserByApiKey (apiKey){
      return pgPool.query(`
        select * from Users
        where api_key = $1
        `,[apiKey]).then(res => {
          return humps.camelizeKeys(res.rows[0]);
        });
    },
    getContests(user) {
      return pgPool.query(`
        select * from contests
        where created_by = $1,
        [user.id]`).then(res => {
          return humps.camelizeKeys(res.rows);
        });
      },

      getNames(contest) {
        return pgPool.query(`
          select * from names
          where contest_id = $1,
          [contest.id]`).then(res => {
            return humps.camelizeKeys(res.rows);
          });
       }
    };
  };
