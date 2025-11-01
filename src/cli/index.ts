#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';
import { buildCommand } from './commands/build.js';

const program = new Command();

program
  .name('offly')
  .description('A lightweight plugin that makes any web app offline-first automatically')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize Offly configuration and service worker')
  .option('-d, --dir <directory>', 'Target directory (default: current directory)', '.')
  .option('--skip-install', 'Skip automatic installation of dependencies')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🚀 Initializing Offly...'));
      await initCommand(options);
      console.log(chalk.green('✅ Offly initialization complete!'));
    } catch (error) {
      console.error(chalk.red('❌ Error during initialization:'), error);
      process.exit(1);
    }
  });

program
  .command('build')
  .description('Build and inject service worker into your application')
  .option('-d, --dir <directory>', 'Build directory (default: dist)', 'dist')
  .option('-c, --config <file>', 'Config file path', '.offlyrc.json')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🔨 Building with Offly...'));
      await buildCommand(options);
      console.log(chalk.green('✅ Build complete with offline support!'));
    } catch (error) {
      console.error(chalk.red('❌ Error during build:'), error);
      process.exit(1);
    }
  });

program.parse();