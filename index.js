const { send, json } = require('micro')
const { router, get, post, del, put } = require('microrouter')
const cors = require('micro-cors')()

// db stuff
const db = require('monk')('mongodb://Laura:Helio1234@helio-shard-00-00-fphgm.mongodb.net:27017,helio-shard-00-01-fphgm.mongodb.net:27017,helio-shard-00-02-fphgm.mongodb.net:27017/Contacts?ssl=true&replicaSet=Helio-shard-0&authSource=admin&retryWrites=true');
const contacts = db.get('contacts');

const createContact = async (req, res) => {
  const body = await json (req)
  console.log(body) 
  const results = await contacts.insert(body);
  return send(res, 201, results)
}

const getContacts = async (req, res) => {
  const results = await contacts.find({});
  send(res, 200, results)
}

const getSingleContact = async (req, res) => {
  const results = await contacts.find({_id : req.params.id});
  send(res, 200, results)
}

const updateContact = async (req, res) => {
  const data = await json(req)
  console.log(data) // Validation might go here
  const results = await contacts.update({ _id: req.params.id }, data);
  return send(res, 200, results)
}

const deleteContact = async (req, res) => {
  const results = await contacts.remove({ _id: req.params.id });
  return send(res, 200, results)
}

const notfound = (req, res) => send(res, 404, 'Not found route')

module.exports = cors(
    router(
      get('/contacts', getContacts),
      get('/contact/:id', getSingleContact),
      post('/contact', createContact),
      put('/contact/:id', updateContact),
      del('/contact/:id', deleteContact),
      get('/*', notfound)
    )
)