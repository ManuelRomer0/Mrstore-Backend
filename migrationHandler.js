// migrationHandler.js

const { spawn } = require('child_process');

// Asegúrate de que Prisma y sus dependencias estén dentro del paquete de la Lambda
const prismaMigrate = async () => {
  return new Promise((resolve, reject) => {
    // Ejecuta el comando de migración de Prisma
    // El comando se ejecuta desde la raíz de tu proyecto.
    const migrate = spawn('npx', ['prisma', 'migrate', 'deploy']);

    migrate.stdout.on('data', (data) => {
      console.log(`Prisma STDOUT: ${data}`);
    });

    migrate.stderr.on('data', (data) => {
      console.error(`Prisma STDERR: ${data}`);
    });

    migrate.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Migraciones aplicadas con éxito.');
        resolve();
      } else {
        console.error(
          `❌ El proceso de migración falló con el código: ${code}`,
        );
        reject(new Error(`Migración fallida. Código: ${code}`));
      }
    });
  });
};

module.exports.run = async (event) => {
  console.log('Iniciando proceso de migración de base de datos...');
  try {
    await prismaMigrate();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Migración finalizada' }),
    };
  } catch (error) {
    console.error('Error durante la migración:', error);
    throw error; // Lanza el error para que GitHub Actions lo capture
  }
};
