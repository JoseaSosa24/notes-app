// backend/src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isGoogleUser?: boolean;
  googleId?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String,
    sparse: true // Permite que sea único solo cuando existe
  }
}, {
  timestamps: true
});

// Hash password before saving (solo para usuarios normales)
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // Solo hashear si no es usuario de Google o si es la primera vez
    if (!this.isGoogleUser || !this.password.startsWith('google_')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  // Los usuarios de Google no pueden hacer login con contraseña
  if (this.isGoogleUser) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);