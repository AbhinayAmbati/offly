import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import { glob } from 'glob';
import { OfflyConfig } from '../../types/index.js';

export interface BuildOptions {
  dir: string;
  config: string;
}

export async function buildCommand(options: BuildOptions): Promise<void> {
  const { dir, config: configFile } = options;
  const buildDir = path.resolve(dir);
  const configPath = path.resolve(configFile);

  console.log(chalk.cyan(`ðŸ“ Build directory: ${buildDir}`));
  console.log(chalk.cyan(`âš™ï¸  Config file: ${configPath}`));

  // Load configuration
  let config: OfflyConfig;
  try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    config = JSON.parse(configContent);
    console.log(chalk.green('âœ… Configuration loaded'));
  } catch (error) {
    throw new Error(`Failed to load configuration from ${configPath}. Run 'Offly init' first.`);
  }

  // Check if build directory exists
  try {
    await fs.access(buildDir);
  } catch {
    throw new Error(`Build directory ${buildDir} does not exist. Build your project first.`);
  }

  // Copy service worker to build directory
  const swSource = path.resolve('offly-sw.js');
  const swDestination = path.join(buildDir, 'offly-sw.js');
  
  try {
    await fs.copyFile(swSource, swDestination);
    console.log(chalk.green('âœ… Service worker copied to build directory'));
  } catch {
    throw new Error('Service worker not found. Run Offly init first.');
  }

  // Inject service worker registration into HTML files
  const htmlFiles = await glob('**/*.html', { cwd: buildDir });
  
  for (const htmlFile of htmlFiles) {
    const htmlPath = path.join(buildDir, htmlFile);
    let htmlContent = await fs.readFile(htmlPath, 'utf-8');
    
    // Check if already injected
    if (htmlContent.includes('offly-sw.js')) {
      console.log(chalk.yellow(`âš ï¸  ${htmlFile} already has Offly registration`));
      continue;
    }

    // Inject service worker registration before closing body tag
    const registration = `
<script>
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
</script>
</body>`;

    htmlContent = htmlContent.replace('</body>', registration);
    await fs.writeFile(htmlPath, htmlContent);
    console.log(chalk.green(`âœ… Injected Offly into ${htmlFile}`));
  }

  // Generate cache manifest
  const manifestPath = path.join(buildDir, 'offly-manifest.json');
  const assets = await glob(config.assets.patterns.join('|'), { cwd: buildDir });
  
  const manifest = {
    version: config.version,
    timestamp: new Date().toISOString(),
    assets: assets,
    config: config
  };

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(chalk.green(`âœ… Generated cache manifest`));

  console.log(chalk.blue('\nðŸŽ‰ Your app is now offline-first!'));
  console.log(chalk.white(`ðŸ“¦ ${assets.length} assets will be cached`));
  console.log(chalk.white(`ðŸ”— ${config.api.endpoints.length} API endpoints configured`));
}
