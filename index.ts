#!/usr/bin/env bun

/**
 * OEJP Simple Tariff Compare CLI
 * 
 * This tool requires the following environment variables to be set:
 * - OEJP_EMAIL: Your OEJP account email
 * - OEJP_PASSWORD: Your OEJP account password
 * 
 * Create a .env file in the project root with these values.
 */

function checkEnvironmentVariables(): void {
  const requiredEnvVars = ['OEJP_EMAIL', 'OEJP_PASSWORD'];
  const missingVars: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.error('❌ Error: Missing required environment variables:');
    for (const varName of missingVars) {
      console.error(`   - ${varName}`);
    }
    console.error('\nPlease create a .env file with the following variables:');
    console.error('   OEJP_EMAIL=your-email@example.com');
    console.error('   OEJP_PASSWORD=your-password');
    console.error('\nSee .env.example for reference.');
    process.exit(1);
  }
}

async function main(): Promise<void> {
  // Check for required environment variables first
  checkEnvironmentVariables();

  console.log('✓ Environment variables validated successfully');
  console.log('OEJP Email:', process.env.OEJP_EMAIL);
  
  // The rest of the CLI logic will go here
  console.log('\n🚧 CLI logic not yet implemented - this is left for future development');
}

// Run the CLI
main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
