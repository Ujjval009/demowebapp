const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projects = [
  { name: 'BillingFernway', dir: 'BillingFernway', buildScript: 'build' },
  { name: 'PortsideWholesale', dir: 'PortsideWholesale', buildScript: 'build' },
  { name: 'RAGSYSTEM', dir: 'RAGSYSTEM', buildScript: 'build' },
  { name: 'HMS/Wardline', dir: 'HMS/wardline', buildScript: 'build' },
  { name: 'toystorePOS', dir: 'toystorePOS/toystore-billing', buildScript: 'build' },
];

console.log('🚀 Building all projects...\n');

projects.forEach(proj => {
  const projectPath = path.join(__dirname, proj.dir);
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`⏭️  ${proj.name}: No package.json, skipping`);
    return;
  }
  
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (!pkg.scripts || !pkg.scripts[proj.buildScript]) {
    console.log(`⏭️  ${proj.name}: No "${proj.buildScript}" script, skipping`);
    return;
  }
  
  try {
    console.log(`🔨 Building ${proj.name}...`);
    execSync(`npm run ${proj.buildScript}`, { 
      cwd: projectPath, 
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    console.log(`✅ ${proj.name} built successfully\n`);
  } catch (err) {
    console.error(`❌ ${proj.name} build failed`);
    process.exit(1);
  }
});

console.log('🎉 All projects built successfully!');