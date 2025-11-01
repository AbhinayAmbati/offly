import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import { generateServiceWorker } from '../utils/generator.js';
import { scanProject } from '../utils/scanner.js';
import { OfflyConfig } from '../../types/index.js';

export interface InitOptions {
  dir: string;
  skipInstall?: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  const { dir } = options;
  const targetDir = path.resolve(dir);

  console.log(chalk.cyan(`ðŸ“ Working in: ${targetDir}`));

  // Check if already initialized
  const configPath = path.join(targetDir, '.offlyrc.json');
  try {
    await fs.access(configPath);
    console.log(chalk.yellow('âš ï¸  Offly is already initialized. Updating configuration...'));
  } catch {
    console.log(chalk.green('ðŸ†• Creating new Offly configuration...'));
  }

  // Scan the project for assets and API calls
  console.log(chalk.cyan('ðŸ” Scanning project...'));
  const scanResults = await scanProject(targetDir);

  // Generate default configuration
  const config: OfflyConfig = {
    version: '0.1.0',
    assets: {
      patterns: scanResults.assets,
      strategy: 'cache-first',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    api: {
      baseUrl: scanResults.apiBaseUrl || '',
      endpoints: scanResults.endpoints,
      strategy: 'network-first',
      maxAge: 5 * 60, // 5 minutes
    },
    sync: {
      enabled: true,
      maxRetries: 3,
      retryDelay: 1000,
    },
    debug: false,
  };

  // Write configuration file
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  console.log(chalk.green(`âœ… Created ${configPath}`));

  // Generate service worker
  console.log(chalk.cyan('âš™ï¸  Generating service worker...'));
  const swPath = path.join(targetDir, 'offly-sw.js');
  const swContent = await generateServiceWorker(config);
  await fs.writeFile(swPath, swContent);
  console.log(chalk.green(`âœ… Created ${swPath}`));

  // Create registration script
  const registrationPath = path.join(targetDir, 'offly-register.js');
  const registrationContent = `
// Offly Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/offly-sw.js')
      .then((registration) => {
        console.log('Offly SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('Offly SW registration failed: ', registrationError);
      });
  });
}
`.trim();

  await fs.writeFile(registrationPath, registrationContent);
  console.log(chalk.green(`âœ… Created ${registrationPath}`));

  // Display next steps
  console.log(chalk.blue('\nðŸ“‹ Next steps:'));
  console.log(chalk.white('1. Include offly-register.js in your HTML:'));
  console.log(chalk.gray('   <script src="/offly-register.js"></script>'));
  console.log(chalk.white('2. Import Offly in your app:'));
  console.log(chalk.gray('   import { useOfflineData } from "Offly";'));
  console.log(chalk.white('3. Run your build process:'));
  console.log(chalk.gray('   npx Offly build'));
}
