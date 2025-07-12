import express from 'express';
import { z } from 'zod';
import Note from '../models/Note';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const createNoteSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'El título es muy largo'),
  content: z.string().min(1, 'El contenido es requerido').max(10000, 'El contenido es muy largo')
});

const updateNoteSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'El título es muy largo').optional(),
  content: z.string().min(1, 'El contenido es requerido').max(10000, 'El contenido es muy largo').optional()
});

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/notes - Get all notes for user
router.get('/', async (req: any, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .select('title content createdAt updatedAt');
    
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Error al obtener las notas' });
  }
});

// GET /api/notes/:id - Get single note
router.get('/:id', async (req: any, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ message: 'Error al obtener la nota' });
  }
});

// POST /api/notes - Create new note
router.post('/', async (req: any, res) => {
  try {
    const validatedData = createNoteSchema.parse(req.body);
    
    const note = new Note({
      ...validatedData,
      userId: req.user.id
    });
    
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Datos inválidos',
        errors: error.errors 
      });
    }
    
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Error al crear la nota' });
  }
});

// PUT /api/notes/:id - Update note
router.put('/:id', async (req: any, res) => {
  try {
    const validatedData = updateNoteSchema.parse(req.body);
    
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    
    res.json(note);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Datos inválidos',
        errors: error.errors 
      });
    }
    
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Error al actualizar la nota' });
  }
});

// DELETE /api/notes/:id - Delete note
router.delete('/:id', async (req: any, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    
    res.json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Error al eliminar la nota' });
  }
});

export default router;