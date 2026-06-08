import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';

dotenv.config();

// Load dynamic Firebase configurations to connect servers smoothly
let firebaseProject: string | undefined;
try {
  const configFile = fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8');
  const firebaseConfig = JSON.parse(configFile);
  firebaseProject = firebaseConfig.projectId;
} catch (configErr) {
  console.warn('[FIREBASE SERVER] Failed to read firebase-applet-config.json:', configErr);
}

// Lazy initialize Firebase Admin SDK
let firestoreAdmin: any = null;
if (firebaseProject && !firebaseProject.includes('Dummy')) {
  try {
    admin.initializeApp({
      projectId: firebaseProject
    });
    firestoreAdmin = admin.firestore();
    console.log(`[FIREBASE ADMIN] Native client initialized dynamically for project: ${firebaseProject}`);
  } catch (initErr) {
    console.error('[FIREBASE ADMIN ERROR] Initialization failed:', initErr);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Crucial parse middlewares
  app.use(express.json());

  // API router for server-side passcode verification
  app.post('/api/verify-passcode', async (req, res) => {
    try {
      const { passcode } = req.body;
      if (!passcode) {
        return res.status(400).json({ success: false, message: 'Passcode is required.' });
      }

      const providedCode = passcode.trim().toUpperCase();

      // 1. Try querying Firestore dynamically using firebase-admin SDK if initialized
      if (firestoreAdmin) {
        try {
          // Check if a document with ID of the provided passcode exists in 'passcodes'
          const docRef = firestoreAdmin.collection('passcodes').doc(providedCode);
          const docSnap = await docRef.get();

          if (docSnap.exists) {
            const data = docSnap.data();
            console.log(`[FIRESTORE SYNC] Verified user role "${data?.role}" dynamically from database.`);
            return res.json({
              success: true,
              role: data?.role || 'contributor',
              message: 'Verified successfully via dynamic Sairam collection.'
            });
          }
        } catch (dbErr: any) {
          console.warn('[FIRESTORE CLIENT WARNING] Fallback triggered to local env rules:', dbErr.message);
        }
      }

      // 2. Default / Fallback to local environment variables and static defaults
      const secureAdminCode = (process.env.ADMIN_PASSCODE || 'SAIRAM-ADMIN').trim().toUpperCase();
      const secureContribCode = (process.env.CONTRIBUTOR_PASSCODE || 'SAIRAM-CONTRIB').trim().toUpperCase();

      // Define static fallback emergency codes
      const fallbackCodes = ['SAIRAM2026', 'SSEC', 'SIT'];

      const isValid = (providedCode === secureAdminCode) || 
                      (providedCode === secureContribCode) || 
                      fallbackCodes.includes(providedCode);

      if (isValid) {
        const isSupervisor = (providedCode === secureAdminCode);
        return res.json({ 
          success: true, 
          role: isSupervisor ? 'admin' : 'contributor',
          message: 'Passcode verified successfully via server defaults.'
        });
      }

      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect Passcode. Access is denied.' 
      });
    } catch (err) {
      console.error('Server passcode verification failure:', err);
      return res.status(500).json({ success: false, message: 'An internal error occurred.' });
    }
  });


  // Serve Vite in development mode, or serve static assets in production mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[STUDIO MASTER DEV ENVIRONMENT] Server running seamlessly at http://localhost:${PORT}`);
  });
}

startServer();
