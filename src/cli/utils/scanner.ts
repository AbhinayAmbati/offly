import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { ProjectScanResults, ApiEndpoint } from '../../types/index.js';

export async function scanProject(projectDir: string): Promise<ProjectScanResults> {
  console.log(`Scanning project directory: ${projectDir}`);
  
  const results: ProjectScanResults = {
    assets: [],
    endpoints: [],
    apiBaseUrl: null,
    framework: 'unknown'
  };

  try {
    // Scan for static assets
    results.assets = await scanAssets(projectDir);
    
    // Detect framework
    results.framework = await detectFramework(projectDir);
    
    // Scan for API calls (basic pattern matching)
    results.endpoints = await scanApiEndpoints(projectDir);
    
    // Try to detect API base URL
    results.apiBaseUrl = await detectApiBaseUrl(projectDir);
    
  } catch (error) {
    console.warn('Warning during project scan:', error);
  }

  return results;
}

async function scanAssets(projectDir: string): Promise<string[]> {
  const assetPatterns = [
    '**/*.js',
    '**/*.css',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
    '**/*.woff',
    '**/*.woff2',
    '**/*.ttf',
    '**/*.eot',
    '**/*.ico'
  ];

  const assets: string[] = [];

  for (const pattern of assetPatterns) {
    try {
      const files = await glob(pattern, {
        cwd: projectDir,
        ignore: ['**/node_modules/**', '**/.*/**']
      });
      assets.push(...files.map(file => `/${file}`));
    } catch (error) {
      console.warn(`Error scanning pattern ${pattern}:`, error);
    }
  }

  return [...new Set(assets)]; // Remove duplicates
}

async function detectFramework(projectDir: string): Promise<'react' | 'vue' | 'vanilla' | 'unknown'> {
  try {
    const packageJsonPath = path.join(projectDir, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    if (dependencies.react || dependencies['@types/react']) {
      return 'react';
    }
    
    if (dependencies.vue || dependencies['@vue/core']) {
      return 'vue';
    }

    return 'vanilla';
  } catch {
    return 'unknown';
  }
}

async function scanApiEndpoints(projectDir: string): Promise<ApiEndpoint[]> {
  const endpoints: ApiEndpoint[] = [];
  
  try {
    // Scan JavaScript/TypeScript files for API patterns
    const codeFiles = await glob('**/*.{js,ts,jsx,tsx}', {
      cwd: projectDir,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });

    for (const file of codeFiles.slice(0, 20)) { // Limit to avoid performance issues
      try {
        const content = await fs.readFile(path.join(projectDir, file), 'utf-8');
        
        // Look for fetch() calls
        const fetchMatches = content.match(/fetch\s*\(['"`](.*?)['"`]\s*,?\s*\{[^}]*method\s*:\s*['"`]([^'"`]+)['"`][^}]*\}/g);
        if (fetchMatches) {
          for (const match of fetchMatches) {
            const urlMatch = match.match(/['"`](.*?)['"`]/);
            const methodMatch = match.match(/method\s*:\s*['"`]([^'"`]+)['"`]/);
            
            if (urlMatch && methodMatch) {
              const url = urlMatch[1];
              const method = methodMatch[1].toUpperCase();
              
              endpoints.push({
                path: url,
                method: method as any,
                cache: method === 'GET',
                syncOnFailure: ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
              });
            }
          }
        }

        // Look for axios calls
        const axiosMatches = content.match(/axios\.(get|post|put|patch|delete)\s*\(['"`](.*?)['"`]\)/g);
        if (axiosMatches) {
          for (const match of axiosMatches) {
            const parts = match.match(/axios\.(\w+)\s*\(['"`](.*?)['"`]\)/);
            if (parts) {
              const method = parts[1].toUpperCase();
              const url = parts[2];
              
              endpoints.push({
                path: url,
                method: method as any,
                cache: method === 'GET',
                syncOnFailure: ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
              });
            }
          }
        }
      } catch (error) {
        // Skip files that can't be read
        continue;
      }
    }
  } catch (error) {
    console.warn('Error scanning API endpoints:', error);
  }

  // Remove duplicates and return
  const uniqueEndpoints = endpoints.filter((endpoint, index, self) =>
    index === self.findIndex(e => e.path === endpoint.path && e.method === endpoint.method)
  );

  return uniqueEndpoints.slice(0, 50); // Limit to avoid config bloat
}

async function detectApiBaseUrl(projectDir: string): Promise<string | null> {
  try {
    // Look for common API base URL patterns in config files
    const configFiles = [
      'package.json',
      '.env',
      '.env.local',
      'config.js',
      'config.json'
    ];

    for (const configFile of configFiles) {
      try {
        const configPath = path.join(projectDir, configFile);
        const content = await fs.readFile(configPath, 'utf-8');
        
        // Look for API URL patterns
        const apiUrlMatch = content.match(/(?:API_URL|REACT_APP_API_URL|VUE_APP_API_URL|apiUrl)\s*[:=]\s*['"`](.*?)['"`]/);
        if (apiUrlMatch) {
          return apiUrlMatch[1];
        }
      } catch {
        continue;
      }
    }

    // Default patterns
    return '/api';
  } catch {
    return '/api';
  }
}