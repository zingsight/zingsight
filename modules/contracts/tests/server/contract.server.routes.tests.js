'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Contract = mongoose.model('Contract'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  contract;

/**
 * Contract routes tests
 */
describe('Contract CRUD tests', function () {

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

    // Save a user to the test db and create new Contract
    user.save(function () {
      contract = {
        name: 'Contract name'
      };

      done();
    });
  });

  it('should be able to save a Contract if logged in', function (done) {
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

        // Save a new Contract
        agent.post('/api/contracts')
          .send(contract)
          .expect(200)
          .end(function (contractSaveErr, contractSaveRes) {
            // Handle Contract save error
            if (contractSaveErr) {
              return done(contractSaveErr);
            }

            // Get a list of Contracts
            agent.get('/api/contracts')
              .end(function (contractsGetErr, contractsGetRes) {
                // Handle Contracts save error
                if (contractsGetErr) {
                  return done(contractsGetErr);
                }

                // Get Contracts list
                var contracts = contractsGetRes.body;

                // Set assertions
                (contracts[0].user._id).should.equal(userId);
                (contracts[0].name).should.match('Contract name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Contract if not logged in', function (done) {
    agent.post('/api/contracts')
      .send(contract)
      .expect(403)
      .end(function (contractSaveErr, contractSaveRes) {
        // Call the assertion callback
        done(contractSaveErr);
      });
  });

  it('should not be able to save an Contract if no name is provided', function (done) {
    // Invalidate name field
    contract.name = '';

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

        // Save a new Contract
        agent.post('/api/contracts')
          .send(contract)
          .expect(400)
          .end(function (contractSaveErr, contractSaveRes) {
            // Set message assertion
            (contractSaveRes.body.message).should.match('Please fill Contract name');

            // Handle Contract save error
            done(contractSaveErr);
          });
      });
  });

  it('should be able to update an Contract if signed in', function (done) {
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

        // Save a new Contract
        agent.post('/api/contracts')
          .send(contract)
          .expect(200)
          .end(function (contractSaveErr, contractSaveRes) {
            // Handle Contract save error
            if (contractSaveErr) {
              return done(contractSaveErr);
            }

            // Update Contract name
            contract.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Contract
            agent.put('/api/contracts/' + contractSaveRes.body._id)
              .send(contract)
              .expect(200)
              .end(function (contractUpdateErr, contractUpdateRes) {
                // Handle Contract update error
                if (contractUpdateErr) {
                  return done(contractUpdateErr);
                }

                // Set assertions
                (contractUpdateRes.body._id).should.equal(contractSaveRes.body._id);
                (contractUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Contracts if not signed in', function (done) {
    // Create new Contract model instance
    var contractObj = new Contract(contract);

    // Save the contract
    contractObj.save(function () {
      // Request Contracts
      request(app).get('/api/contracts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Contract if not signed in', function (done) {
    // Create new Contract model instance
    var contractObj = new Contract(contract);

    // Save the Contract
    contractObj.save(function () {
      request(app).get('/api/contracts/' + contractObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', contract.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Contract with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/contracts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Contract is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Contract which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Contract
    request(app).get('/api/contracts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Contract with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Contract if signed in', function (done) {
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

        // Save a new Contract
        agent.post('/api/contracts')
          .send(contract)
          .expect(200)
          .end(function (contractSaveErr, contractSaveRes) {
            // Handle Contract save error
            if (contractSaveErr) {
              return done(contractSaveErr);
            }

            // Delete an existing Contract
            agent.delete('/api/contracts/' + contractSaveRes.body._id)
              .send(contract)
              .expect(200)
              .end(function (contractDeleteErr, contractDeleteRes) {
                // Handle contract error error
                if (contractDeleteErr) {
                  return done(contractDeleteErr);
                }

                // Set assertions
                (contractDeleteRes.body._id).should.equal(contractSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Contract if not signed in', function (done) {
    // Set Contract user
    contract.user = user;

    // Create new Contract model instance
    var contractObj = new Contract(contract);

    // Save the Contract
    contractObj.save(function () {
      // Try deleting Contract
      request(app).delete('/api/contracts/' + contractObj._id)
        .expect(403)
        .end(function (contractDeleteErr, contractDeleteRes) {
          // Set message assertion
          (contractDeleteRes.body.message).should.match('User is not authorized');

          // Handle Contract error error
          done(contractDeleteErr);
        });

    });
  });

  it('should be able to get a single Contract that has an orphaned user reference', function (done) {
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

          // Save a new Contract
          agent.post('/api/contracts')
            .send(contract)
            .expect(200)
            .end(function (contractSaveErr, contractSaveRes) {
              // Handle Contract save error
              if (contractSaveErr) {
                return done(contractSaveErr);
              }

              // Set assertions on new Contract
              (contractSaveRes.body.name).should.equal(contract.name);
              should.exist(contractSaveRes.body.user);
              should.equal(contractSaveRes.body.user._id, orphanId);

              // force the Contract to have an orphaned user reference
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

                    // Get the Contract
                    agent.get('/api/contracts/' + contractSaveRes.body._id)
                      .expect(200)
                      .end(function (contractInfoErr, contractInfoRes) {
                        // Handle Contract error
                        if (contractInfoErr) {
                          return done(contractInfoErr);
                        }

                        // Set assertions
                        (contractInfoRes.body._id).should.equal(contractSaveRes.body._id);
                        (contractInfoRes.body.name).should.equal(contract.name);
                        should.equal(contractInfoRes.body.user, undefined);

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
      Contract.remove().exec(done);
    });
  });
});
