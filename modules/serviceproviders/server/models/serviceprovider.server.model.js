'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Serviceprovider Schema
 */
var ServiceproviderSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Serviceprovider name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Serviceprovider', ServiceproviderSchema);
