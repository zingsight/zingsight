'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Serviceprovider = mongoose.model('Serviceprovider'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  serviceprovider;

/**
 * Serviceprovider routes tests
 */
describe('Serviceprovider CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Serviceprovider
    user.save(function () {
      serviceprovider = {
        name: 'Serviceprovider name'
      };

      done();
    });
  });

  it('should be able to save a Serviceprovider if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Serviceprovider
        agent.post('/api/serviceproviders')
          .send(serviceprovider)
          .expect(200)
          .end(function (serviceproviderSaveErr, serviceproviderSaveRes) {
            // Handle Serviceprovider save error
            if (serviceproviderSaveErr) {
              return done(serviceproviderSaveErr);
            }

            // Get a list of Serviceproviders
            agent.get('/api/serviceproviders')
              .end(function (serviceprovidersGetErr, serviceprovidersGetRes) {
                // Handle Serviceproviders save error
                if (serviceprovidersGetErr) {
                  return done(serviceprovidersGetErr);
                }

                // Get Serviceproviders list
                var serviceproviders = serviceprovidersGetRes.body;

                // Set assertions
                (serviceproviders[0].user._id).should.equal(userId);
                (serviceproviders[0].name).should.match('Serviceprovider name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Serviceprovider if not logged in', function (done) {
    agent.post('/api/serviceproviders')
      .send(serviceprovider)
      .expect(403)
      .end(function (serviceproviderSaveErr, serviceproviderSaveRes) {
        // Call the assertion callback
        done(serviceproviderSaveErr);
      });
  });

  it('should not be able to save an Serviceprovider if no name is provided', function (done) {
    // Invalidate name field
    serviceprovider.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Serviceprovider
        agent.post('/api/serviceproviders')
          .send(serviceprovider)
          .expect(400)
          .end(function (serviceproviderSaveErr, serviceproviderSaveRes) {
            // Set message assertion
            (serviceproviderSaveRes.body.message).should.match('Please fill Serviceprovider name');

            // Handle Serviceprovider save error
            done(serviceproviderSaveErr);
          });
      });
  });

  it('should be able to update an Serviceprovider if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Serviceprovider
        agent.post('/api/serviceproviders')
          .send(serviceprovider)
          .expect(200)
          .end(function (serviceproviderSaveErr, serviceproviderSaveRes) {
            // Handle Serviceprovider save error
            if (serviceproviderSaveErr) {
              return done(serviceproviderSaveErr);
            }

            // Update Serviceprovider name
            serviceprovider.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Serviceprovider
            agent.put('/api/serviceproviders/' + serviceproviderSaveRes.body._id)
              .send(serviceprovider)
              .expect(200)
              .end(function (serviceproviderUpdateErr, serviceproviderUpdateRes) {
                // Handle Serviceprovider update error
                if (serviceproviderUpdateErr) {
                  return done(serviceproviderUpdateErr);
                }

                // Set assertions
                (serviceproviderUpdateRes.body._id).should.equal(serviceproviderSaveRes.body._id);
                (serviceproviderUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Serviceproviders if not signed in', function (done) {
    // Create new Serviceprovider model instance
    var serviceproviderObj = new Serviceprovider(serviceprovider);

    // Save the serviceprovider
    serviceproviderObj.save(function () {
      // Request Serviceproviders
      request(app).get('/api/serviceproviders')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Serviceprovider if not signed in', function (done) {
    // Create new Serviceprovider model instance
    var serviceproviderObj = new Serviceprovider(serviceprovider);

    // Save the Serviceprovider
    serviceproviderObj.save(function () {
      request(app).get('/api/serviceproviders/' + serviceproviderObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', serviceprovider.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Serviceprovider with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/serviceproviders/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Serviceprovider is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Serviceprovider which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Serviceprovider
    request(app).get('/api/serviceproviders/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Serviceprovider with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Serviceprovider if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Serviceprovider
        agent.post('/api/serviceproviders')
          .send(serviceprovider)
          .expect(200)
          .end(function (serviceproviderSaveErr, serviceproviderSaveRes) {
            // Handle Serviceprovider save error
            if (serviceproviderSaveErr) {
              return done(serviceproviderSaveErr);
            }

            // Delete an existing Serviceprovider
            agent.delete('/api/serviceproviders/' + serviceproviderSaveRes.body._id)
              .send(serviceprovider)
              .expect(200)
              .end(function (serviceproviderDeleteErr, serviceproviderDeleteRes) {
                // Handle serviceprovider error error
                if (serviceproviderDeleteErr) {
                  return done(serviceproviderDeleteErr);
                }

                // Set assertions
                (serviceproviderDeleteRes.body._id).should.equal(serviceproviderSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Serviceprovider if not signed in', function (done) {
    // Set Serviceprovider user
    serviceprovider.user = user;

    // Create new Serviceprovider model instance
    var serviceproviderObj = new Serviceprovider(serviceprovider);

    // Save the Serviceprovider
    serviceproviderObj.save(function () {
      // Try deleting Serviceprovider
      request(app).delete('/api/serviceproviders/' + serviceproviderObj._id)
        .expect(403)
        .end(function (serviceproviderDeleteErr, serviceproviderDeleteRes) {
          // Set message assertion
          (serviceproviderDeleteRes.body.message).should.match('User is not authorized');

          // Handle Serviceprovider error error
          done(serviceproviderDeleteErr);
        });

    });
  });

  it('should be able to get a single Serviceprovider that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Serviceprovider
          agent.post('/api/serviceproviders')
            .send(serviceprovider)
            .expect(200)
            .end(function (serviceproviderSaveErr, serviceproviderSaveRes) {
              // Handle Serviceprovider save error
              if (serviceproviderSaveErr) {
                return done(serviceproviderSaveErr);
              }

              // Set assertions on new Serviceprovider
              (serviceproviderSaveRes.body.name).should.equal(serviceprovider.name);
              should.exist(serviceproviderSaveRes.body.user);
              should.equal(serviceproviderSaveRes.body.user._id, orphanId);

              // force the Serviceprovider to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Serviceprovider
                    agent.get('/api/serviceproviders/' + serviceproviderSaveRes.body._id)
                      .expect(200)
                      .end(function (serviceproviderInfoErr, serviceproviderInfoRes) {
                        // Handle Serviceprovider error
                        if (serviceproviderInfoErr) {
                          return done(serviceproviderInfoErr);
                        }

                        // Set assertions
                        (serviceproviderInfoRes.body._id).should.equal(serviceproviderSaveRes.body._id);
                        (serviceproviderInfoRes.body.name).should.equal(serviceprovider.name);
                        should.equal(serviceproviderInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Serviceprovider.remove().exec(done);
    });
  });
});
