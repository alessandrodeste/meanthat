// app/models/user.js

//------------------------------------------------------------------
// Declaration time
//------------------------------------------------------------------
var mongoose            = require('mongoose');
var Schema              = mongoose.Schema;
var bcrypt			    = require('bcryptjs');
var SALT_WORK_FACTOR 	= 10;
var MAX_LOGIN_ATTEMPTS 	= 5;
var LOCK_TIME 			= 2 * 60 * 60 * 1000;

//------------------------------------------------------------------
// User Schema
//------------------------------------------------------------------
var UserSchema   = new Schema({
	
	// Identifiers
	email: { type: String, required: true, index: { unique: true } },
	username:  { type: String, required: true, index: { unique: true } }, // default equal email
	first_name: String,
	family_name: String,
	
	// Credentials
	local            : {
      email        : String,
      password     : String
    },
   
    google           : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
    },
	
	// Security
	loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number },
	role: Number, // 0: none, 1: disabled, 2: user, 5: admin, 10: su
	
	// Applicational attributes
	favorite_tags: [String]
	
}, {
    collection: 'users'
});

//------------------------------------------------------------------
// Pre-Save action (add salt in password)
//------------------------------------------------------------------
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('local.password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.local.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.local.password = hash;
            next();
        });
    });
});

//------------------------------------------------------------------
// method: generating a hash
//------------------------------------------------------------------
//UserSchema.methods.generateHash = function(password) {
//    return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_WORK_FACTOR), null);
//};

//------------------------------------------------------------------
// method: compare password
//------------------------------------------------------------------
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.local.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//------------------------------------------------------------------
// property: isLocked (boolean)
//------------------------------------------------------------------
UserSchema.virtual('isLocked').get(function() {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

//------------------------------------------------------------------
// method: checking if password is valid (used by scotch.io)
//------------------------------------------------------------------
//UserSchema.methods.validPassword = function(password) {
//    return bcrypt.compareSync(password, this.local.password);
//};

//------------------------------------------------------------------
// method: increment login attempts
//------------------------------------------------------------------
UserSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};

//------------------------------------------------------------------
// enum: expose enum on the model, and provide an internal convenience reference 
//------------------------------------------------------------------
var reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

//------------------------------------------------------------------
// Authenticate user (local strategies) and increment login attempts
//------------------------------------------------------------------
UserSchema.statics.getAuthenticated = function(email, password, cb) {
    this.findOne({ 'local.email': email }, function(err, user) {
        if (err) return cb(err);

        // make sure the user exists
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if (user.isLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

//------------------------------------------------------------------
// return cleanup user (no sensible information)
//------------------------------------------------------------------
UserSchema.statics.filterOutputUser = function(user) {
  if ( user ) {
    return {
      user : {
        id: user._id.$oid,
        username: user.username,
        email: user.email
      }
    };
  } else {
    return { user: null };
  }
};

module.exports = mongoose.model('User', UserSchema);
