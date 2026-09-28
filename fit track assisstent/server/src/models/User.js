const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Please add a valid email address'] },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number, min: 13, max: 100 },
  heightCm: { type: Number, min: 80, max: 250 },
  weightKg: { type: Number, min: 25, max: 300 },
  fitnessGoal: { type: String, enum: ['Weight Loss','Muscle Gain','General Fitness','Endurance','Strength'], default: 'General Fitness' },
  experience: { type: String, enum: ['Beginner','Intermediate','Advanced'], default: 'Beginner' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.matchPassword = function(enteredPassword) { return bcrypt.compare(enteredPassword, this.password); };
userSchema.methods.publicProfile = function() {
  return { id: this._id, name: this.name, email: this.email, age: this.age, heightCm: this.heightCm, weightKg: this.weightKg, fitnessGoal: this.fitnessGoal, experience: this.experience };
};
module.exports = mongoose.model('User', userSchema);
