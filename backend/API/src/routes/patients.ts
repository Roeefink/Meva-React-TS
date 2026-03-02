import express from 'express';
import type { Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../config/db.js';

const router = express.Router();

// GET /api/v1/patients - List all patients for the authenticated user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const patients = await prisma.patient.findMany({
            where: { user_id: req.user!.id },
            orderBy: { created_at: 'desc' }
        });

        // Map to frontend-friendly format if needed
        const formattedPatients = patients.map(patient => ({
            id: patient.id,
            user_id: patient.user_id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email,
            address: patient.address,
            city: patient.city,
            state: patient.state,
            zip: patient.zip,
            country: patient.country,
            notes: patient.notes,
            created_at: patient.created_at
        }));

        res.json({ patients: formattedPatients });
    } catch (error: any) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});

export default router;
