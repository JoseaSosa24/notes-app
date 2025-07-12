import express from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User';

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Create new user
    const user = new User(validatedData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: error.errors
      });
    }

    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: error.errors
      });
    }

    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// POST /api/auth/google - Authenticate Google user
router.post('/google', async (req, res) => {
  try {
    const { name, email, googleId } = req.body;

    if (!name || !email || !googleId) {
      return res.status(400).json({ message: 'Datos de Google incompletos' });
    }

    // Buscar usuario existente por email
    let user = await User.findOne({ email });

    if (!user) {
      // Crear nuevo usuario de Google
      user = new User({
        name,
        email,
        password: `google_${googleId}_${Date.now()}`, // Password dummy para usuarios de Google
        isGoogleUser: true,
        googleId
      });
      await user.save();
      console.log('✅ Nuevo usuario de Google creado:', email);
    } else {
      // Actualizar usuario existente para marcarlo como usuario de Google
      if (!user.isGoogleUser) {
        user.isGoogleUser = true;
        user.googleId = googleId;
        await user.save();
        console.log('✅ Usuario existente actualizado para Google:', email);
      }
    }

    // Generar JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Autenticación con Google exitosa',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isGoogleUser: true
      }
    });
  } catch (error) {
    console.error('Error en autenticación Google:', error);
    res.status(500).json({ message: 'Error al autenticar con Google' });
  }
});

export default router;