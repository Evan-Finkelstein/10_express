const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/log');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  afterAll(() => {
    return pool.end();
  });
  it('creates a log', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
    return request(app)
      .post('/api/v1/logs/')
      .send({
        notes: 'cookies',
        rating: '8',
        recipeId: recipe.id,
        dateOfEvent: '4'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          notes: 'cookies',
          rating: '8',
          recipeId: recipe.id,
          dateOfEvent: '4'
        });
      });
  });

  it('gets all logs', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
    const logs = await Promise.all([
      {
        notes: 'cookies',
        rating: '8',
        recipeId: recipe.id,
        dateOfEvent: '4'
      },
      {
        notes: 'are',
        rating: '4',
        recipeId: recipe.id,
        dateOfEvent: '4'
      },
      {
        notes: 'good',
        rating: '1',
        recipeId: recipe.id,
        dateOfEvent: '5'
      }
    ].map(recipe => Log.insert(recipe)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

  it('updates a log by id', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    const log = await Log.insert({
      notes: 'cookies',
      rating: '8',
      recipeId: recipe.id,
      dateOfEvent: '4'
    });

    return request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send({
        notes: 'cake',
        rating: '8',
        recipeId: recipe.id,
        dateOfEvent: '4'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          notes: 'cake',
          rating: '8',
          recipeId: recipe.id,
          dateOfEvent: '4'
        });
      });
  });
  it('deletes a recipe by id', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    const log = await Log.insert({
      notes: 'cookies',
      rating: '8',
      recipeId: recipe.id,
      dateOfEvent: '4'
    });

    return request(app)
      .delete(`/api/v1/logs/${log.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          notes: 'cookies',
          rating: '8',
          recipeId: recipe.id,
          dateOfEvent: '4'
        });
      });
  });
  it('finds a log by id', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    const log = await Log.insert({
      notes: 'cookies',
      rating: '8',
      recipeId: recipe.id,
      dateOfEvent: '4'
    });

    return request(app)
      .get(`/api/v1/logs/${log.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          notes: 'cookies',
          rating: '8',
          recipeId: recipe.id,
          dateOfEvent: '4'
        });
      });
  });
  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('gets all recipes', async () => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('updates a recipe by id', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });
  it('deletes a recipe by id', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .delete(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });
  it('finds a recipe by id', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .get(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });
});
