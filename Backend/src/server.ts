import app from './app.js';
import { envVars } from './app/config/env.js';
import { seedSuperAdmin } from './app/utils/seed.js';

const bootstrap = async () => {
  try {
    await seedSuperAdmin();
    app.listen(parseInt(envVars.PORT), () => {
      console.log(`🚀 Audit-X Backend running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

bootstrap();
