const request = require('supertest');
const app = require('../../app');
const truncate = require('../truncate');
const { ToDo } = require('../../models');

const rootPath = '/todos';

describe('/todos', () => {

  beforeEach(() => {
    return truncate();
  });

  afterAll(() => {
    return ToDo.sequelize.close();
  });

  describe('GET /', () => {
    it('should return an empty array', () => {
      return request(app)
        .get(rootPath)
        .expect((response) => {
          return expect(response.body.todos).toEqual([]);
        });
    });

    it('should return 1 item in the array', () => {
      return ToDo.create({
        subject: 'test',
      }).then(() => {
        return request(app).get(rootPath).expect((response) => {
          return expect(response.body.todos.length).toEqual(1);
        });
      });
    });
    it('should return an error because item isnt there', () => {
      return request(app)
        .get(rootPath + '/123141')
        .expect(404)
    });
  });
  describe('DELETE /', () => {
    it('item to delete not present', () => {
      return request(app)
        .delete(rootPath + '/nonexistant')
        .expect(404)
    });
    it('delete an item immediately after creation', () => {
      return ToDo.create({
        subject: 'test',
      }).then((todo) => {
         return request(app)
          .delete(rootPath + '/'+todo.id)
          .expect(200)
      });
    });
   
  });
  describe('POST /', () => {
    it('should create one todo item', () => {
      return request(app)
        .post(rootPath)
        .send({
          subject: 'test',
        })
        .expect(200)
        .then((response) => {
          return expect(response.body.subject).toEqual('test');
        });
    });
  });
});
