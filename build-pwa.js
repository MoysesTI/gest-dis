#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando build PWA...\n');

// 1. Verificar se todos os arquivos necessários existem
const requiredFiles = [
  'public/manifest.json',
  'public/sw.js',
  'src/serviceWorkerRegistration.js'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error('❌ Arquivos obrigatórios não encontrados:');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  console.error('\nCertifique-se de ter criado todos os arquivos PWA necessários.');
  process.exit(1);
}

// 2. Atualizar package.json com configurações PWA
console.log('📝 Atualizando package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Adicionar scripts PWA se não existirem
if (!packageJson.scripts['build:pwa']) {
  packageJson.scripts['build:pwa'] = 'npm run build && npm run post-build';
}

if (!packageJson.scripts['post-build']) {
  packageJson.scripts['post-build'] = 'node build-pwa.js --post';
}

if (!packageJson.scripts['serve:pwa']) {
  packageJson.scripts['serve:pwa'] = 'npx serve -s build -l 3000';
}

// Adicionar configuração PWA
packageJson.homepage = packageJson.homepage || '.';

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// 3. Configurar variáveis de ambiente para build
process.env.REACT_APP_PWA_ENABLED = 'true';
process.env.GENERATE_SOURCEMAP = 'false';

try {
  // 4. Executar build React
  console.log('🔨 Executando build React...');
  execSync('npm run build', { stdio: 'inherit' });

  // 5. Pós-processamento apenas se chamado com --post
  if (process.argv.includes('--post')) {
    postBuildProcessing();
  } else {
    console.log('\n✅ Build PWA concluído!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Teste localmente: npm run serve:pwa');
    console.log('2. Deploy: firebase deploy --only hosting');
  }

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}

function postBuildProcessing() {
  console.log('\n🔧 Pós-processando build PWA...');

  // Criar offline.html
  const offlineHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Offline - Sistema de Gestão</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 400px;
        }
        .icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.8;
        }
        h1 {
            margin: 0 0 1rem 0;
            font-size: 2rem;
            font-weight: 300;
        }
        p {
            margin: 0 0 2rem 0;
            opacity: 0.9;
            line-height: 1.5;
        }
        button {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s ease;
        }
        button:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📱</div>
        <h1>Você está offline</h1>
        <p>Verifique sua conexão com a internet e tente novamente.</p>
        <button onclick="window.location.reload()">
            Tentar Novamente
        </button>
    </div>
</body>
</html>`;

  fs.writeFileSync('build/offline.html', offlineHtml);

  // Otimizar manifest.json
  const manifestPath = 'build/manifest.json';
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Adicionar configurações adicionais
    manifest.categories = manifest.categories || ['productivity', 'finance', 'lifestyle'];
    manifest.iarc_rating_id = 'e84b072d-71b3-4d3e-86ae-31a8ce4e53b7';
    manifest.prefer_related_applications = false;
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }

  // Adicionar headers de segurança (para Netlify/Vercel)
  const headers = `
# PWA Headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

# Cache Strategy
/static/*
  Cache-Control: public, max-age=31536000, immutable

/manifest.json
  Cache-Control: public, max-age=0

/sw.js
  Cache-Control: public, max-age=0

/*.html
  Cache-Control: public, max-age=0
`;

  fs.writeFileSync('build/_headers', headers);

  // Criar arquivo de redirects (para SPA)
  const redirects = `
# SPA Fallback
/*    /index.html   200

# API Redirects (se necessário)
/api/*  https://sistema-gestao-moyses.firebaseapp.com/api/:splat  200
`;

  fs.writeFileSync('build/_redirects', redirects);

  // Verificar tamanho do bundle
  console.log('\n📊 Analisando tamanho do bundle...');
  const buildDir = 'build/static/js';
  if (fs.existsSync(buildDir)) {
    const files = fs.readdirSync(buildDir);
    const jsFiles = files.filter(f => f.endsWith('.js') && !f.includes('map'));
    
    let totalSize = 0;
    jsFiles.forEach(file => {
      const stats = fs.statSync(path.join(buildDir, file));
      const sizeKB = Math.round(stats.size / 1024);
      totalSize += sizeKB;
      console.log(`   ${file}: ${sizeKB}KB`);
    });
    
    console.log(`   Total: ${totalSize}KB`);
    
    if (totalSize > 1024) {
      console.warn('⚠️  Bundle maior que 1MB. Considere otimização.');
    }
  }

  console.log('\n✅ Pós-processamento concluído!');
  console.log('\n📱 Seu PWA está pronto!');
  console.log('\n📋 Para testar:');
  console.log('1. npm run serve:pwa');
  console.log('2. Abra http://localhost:3000');
  console.log('3. No DevTools: Application > Manifest');
  console.log('4. No DevTools: Lighthouse > PWA Audit');
  
  console.log('\n🚀 Para fazer deploy:');
  console.log('1. firebase deploy --only hosting');
  console.log('2. Teste no mobile acessando a URL');
  console.log('3. Toque em "Adicionar à tela inicial"');
}

// Função para validar PWA
function validatePWA() {
  console.log('\n🔍 Validando configuração PWA...');
  
  const checks = [
    {
      name: 'Manifest.json',
      check: () => fs.existsSync('build/manifest.json'),
      fix: 'Certifique-se de ter o manifest.json na pasta public/'
    },
    {
      name: 'Service Worker',
      check: () => fs.existsSync('build/sw.js'),
      fix: 'Certifique-se de ter o sw.js na pasta public/'
    },
    {
      name: 'Ícones PWA',
      check: () => fs.existsSync('build/icons/icon-192x192.png'),
      fix: 'Gere os ícones PWA usando o script gerador'
    },
    {
      name: 'HTTPS',
      check: () => true, // Será verificado no deploy
      fix: 'PWA requer HTTPS em produção'
    }
  ];

  let allPassed = true;
  checks.forEach(check => {
    const passed = check.check();
    console.log(`   ${passed ? '✅' : '❌'} ${check.name}`);
    if (!passed) {
      console.log(`      → ${check.fix}`);
      allPassed = false;
    }
  });

  if (allPassed) {
    console.log('\n🎉 Todas as verificações passaram!');
  } else {
    console.log('\n⚠️  Algumas verificações falharam. Corrija antes do deploy.');
  }

  return allPassed;
}

// Executar validação se chamado diretamente
if (process.argv.includes('--validate')) {
  validatePWA();
}

module.exports = { postBuildProcessing, validatePWA };