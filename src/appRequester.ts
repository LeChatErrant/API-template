/*  eslint-disable  import/no-extraneous-dependencies */
/*  eslint-disable  @typescript-eslint/no-explicit-any  */

import supertest from 'supertest';
import httpStatus from 'http-status-codes';

import app from './app';

/**
 * Class used to make API call to the API itself
 * Primarily used for testing purpose
 *
 * When testing API routes, requests shall only be made from this request
 * It enables
 *  - Reusability for other tests (for example, testing Posts needs Users routes)
 *  - Cookies shared between requests (login, etc)
 */
export default class Requester {
  request: supertest.SuperAgentTest;

  /**
   * Construct a new Requester, ready to use
   *
   * @constructor
   */
  constructor() {
    this.request = supertest.agent(app);
  }

  /**
   * Reset the session and clear cookies
   */
  resetSession() {
    this.request = supertest.agent(app);
  }

  async signup(user: any, statusCodeExpected = httpStatus.CREATED) {
    const { body } = await this.request
      .post('/users/signup')
      .send(user)
      .expect(statusCodeExpected);

    return body;
  }

  async signin(user: any, statusCodeExpected = httpStatus.OK) {
    const { body } = await this.request
      .post('/users/signin')
      .send(user)
      .expect(statusCodeExpected);

    return body;
  }

  async signout(statusCodeExpected = httpStatus.NO_CONTENT) {
    await this.request
      .post('/users/signout')
      .expect(statusCodeExpected);
  }

  async listUsers(statusCodeExpected = httpStatus.OK) {
    const { body } = await this.request
      .get('/users')
      .expect(statusCodeExpected);

    return body;
  }

  async getUser(userId: string, statusCodeExpected = httpStatus.OK) {
    const { body } = await this.request
      .get(`/users/${userId}`)
      .expect(statusCodeExpected);

    return body;
  }

  async updateUser(userId: string, payload: any, statusCodeExpected = httpStatus.OK) {
    const { body } = await this.request
      .patch(`/users/${userId}`)
      .send(payload)
      .expect(statusCodeExpected);

    return body;
  }

  async deleteUser(userId: string, statusCodeExpected = httpStatus.NO_CONTENT) {
    await this.request
      .delete(`/users/${userId}`)
      .expect(statusCodeExpected);
  }

  async createPost(userId: string, payload: any, statusCodeExpected = httpStatus.CREATED) {
    const { body } = await this.request
      .post(`/users/${userId}/posts`)
      .send(payload)
      .expect(statusCodeExpected);

    return body;
  }

  async listPosts(userId: string, statusCodeExpected = httpStatus.OK) {
    const { body } = await this.request
      .get(`/users/${userId}/posts`)
      .expect(statusCodeExpected);

    return body;
  }
}
