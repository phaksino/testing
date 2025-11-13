const request = require('supertest');
const app = require('../../server');
const { bugs, clearBugs, initializeSampleData } = require('../../data/store');

describe('Bug Routes Integration Tests', () => {
  beforeEach(() => {
    // Clear and reinitialize data before each test
    clearBugs();
    initializeSampleData();
  });

  it('GET /api/bugs - should return all bugs', async () => {
    const response = await request(app)
      .get('/api/bugs')
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe('Login button not working');
    expect(response.body[1].title).toBe('Mobile responsive issues');
  });

  it('POST /api/bugs - should create a new bug', async () => {
    const newBug = {
      title: 'New Test Bug',
      description: 'New bug description',
      reporter: 'Test User'
    };

    const response = await request(app)
      .post('/api/bugs')
      .send(newBug)
      .expect(201);

    expect(response.body.title).toBe('New Test Bug');
    expect(response.body.status).toBe('open');
    expect(response.body.id).toBeDefined();

    // Verify the bug was added to the store
    const allBugsResponse = await request(app).get('/api/bugs');
    expect(allBugsResponse.body).toHaveLength(3);
  });

  it('PUT /api/bugs/:id - should update bug status', async () => {
    const response = await request(app)
      .put('/api/bugs/1')
      .send({ status: 'in-progress' })
      .expect(200);

    expect(response.body.status).toBe('in-progress');
    expect(response.body.id).toBe(1);
  });

  it('DELETE /api/bugs/:id - should delete a bug', async () => {
    await request(app)
      .delete('/api/bugs/1')
      .expect(200);

    const response = await request(app).get('/api/bugs');
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toBe(2);
  });

  it('should return 404 for non-existent bug', async () => {
    await request(app)
      .get('/api/bugs/999')
      .expect(404);
  });
});