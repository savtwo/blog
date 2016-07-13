var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");
var uuid = require("node-uuid");

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "E-mail is required"],
    lowercase: true,
    unique: [true, "{VALUE} is already a registered e-mail"],
    validate: {
      validator: function(v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: "{VALUE} is not a valid e-mail"
    }
  },
  password: {
    type: String,
    minlength: [8, "Minimum password length is 8 characters"]
  },
  emailVerified: {
    type: Date
  },
  emailVerificationToken: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpiration: {
    type: Date
  }
});

userSchema.methods.clearPasswordResetToken = clearPasswordResetToken;
userSchema.methods.generateEmailVerificationToken = generateEmailVerificationToken;
userSchema.methods.generatePasswordResetToken = generatePasswordResetToken;
userSchema.methods.getClientSafe = getClientSafe;
userSchema.methods.hashPassword = hashPassword;
userSchema.methods.isValidPassword = isValidPassword;
userSchema.methods.isValidPasswordResetToken = isValidPasswordResetToken;
userSchema.methods.isVerified = isVerified;
userSchema.methods.verifyEmail = verifyEmail;
userSchema.methods._preSave = _preSave;
userSchema.pre("save", userSchema.methods._preSave);

module.exports = mongoose.model("User", userSchema);

/**
 * Remove the password reset token and expiration from the model
 */
function clearPasswordResetToken() {
  this.passwordResetExpiration = undefined;
  this.passwordResetToken = undefined;
}

/**
 * Generate a unqiue e-mail verification token
 *
 * @returns e-mail verification token
 */
function generateEmailVerificationToken() {
  return this.emailVerificationToken = uuid.v4();
}

/**
 * Generate a password reset token for this user
 * 604800000 = 1 week
 *
 * @returns password reset token
 */
function generatePasswordResetToken() {
  this.passwordResetExpiration = Date.now() + 604800000;
  return this.passwordResetToken = uuid.v4();
}

/**
 * Hides user properties and returns them in a new object
 *
 * @returns a client-safe version of the user model
 */
function getClientSafe() {
  return {
    _id: this._id,
    email: this.email
  };
}

/**
 * Hash a plaintext password using node-bcrypt
 *
 * @param password plaintext password string
 * @returns hashed password string
 */
function hashPassword(password) {
  return this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

/**
 * Compare a plaintext password with a hashed password
 *
 * @param password plaintext password string
 * @returns true if password matches hashed password
 */
function isValidPassword(password) {
  return typeof password === "string" && bcrypt.compareSync(password, this.password);
}

/**
 * Compare a token to the password reset token, and ensure it's before the expiration date
 *
 * @param password reset token
 * @returns true if token is valid before expiration
 */
function isValidPasswordResetToken(token) {
  return this.passwordResetToken === token && this.passwordResetExpiration > Date.now();
}

/**
 * Check if user account is verified
 *
 * @returns true if emailVerified is defined
 */
function isVerified() {
  return this.emailVerified;
}

/**
 * Set the user's account to verified
 *
 * @returns Date.now()
 */
function verifyEmail() {
  return this.emailVerified = Date.now();
}

/**
 * Perform pre-save functions
 *
 * @param next callback
 */
function _preSave(next) {
  if (this.isModified("password"))
    this.hashPassword(this.password);
    
  if (this.isNew)
    this.generateEmailVerificationToken();
    
  next();
}
