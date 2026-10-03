// scripts/patch-next.js
// Safe guard against Next.js 14.0.4 App Router-only edge case where
// hasCustomGetInitialProps attempts to inspect non-existent pages/_document.

const fs = require('fs');
const path = require('path');

const utilsPath = path.join(process.cwd(), 'node_modules/next/dist/build/utils.js');
if (fs.existsSync(utilsPath)) {
  let code = fs.readFileSync(utilsPath, 'utf8');
  let changed = false;

  const target1 = `async function hasCustomGetInitialProps(page, distDir, runtimeEnvConfig, checkingApp) {
    require("../shared/lib/runtime-config.external").setConfig(runtimeEnvConfig);
    const components = await (0, _loadcomponents.loadComponents)({
        distDir,
        page: page,
        isAppPath: false
    });
    let mod = components.ComponentMod;
    if (checkingApp) {
        mod = await mod._app || mod.default || mod;
    } else {
        mod = mod.default || mod;
    }
    mod = await mod;
    return mod.getInitialProps !== mod.origGetInitialProps;
}`;

  const replacement1 = `async function hasCustomGetInitialProps(page, distDir, runtimeEnvConfig, checkingApp) {
    require("../shared/lib/runtime-config.external").setConfig(runtimeEnvConfig);
    try {
        const components = await (0, _loadcomponents.loadComponents)({
            distDir,
            page: page,
            isAppPath: false
        });
        let mod = components.ComponentMod;
        if (checkingApp) {
            mod = await mod._app || mod.default || mod;
        } else {
            mod = mod.default || mod;
        }
        mod = await mod;
        return mod.getInitialProps !== mod.origGetInitialProps;
    } catch (err) {
        return false;
    }
}`;

  const target2 = `async function getDefinedNamedExports(page, distDir, runtimeEnvConfig) {
    require("../shared/lib/runtime-config.external").setConfig(runtimeEnvConfig);
    const components = await (0, _loadcomponents.loadComponents)({
        distDir,
        page: page,
        isAppPath: false
    });
    return Object.keys(components.ComponentMod).filter((key)=>{
        return typeof components.ComponentMod[key] !== "undefined";
    });
}`;

  const replacement2 = `async function getDefinedNamedExports(page, distDir, runtimeEnvConfig) {
    require("../shared/lib/runtime-config.external").setConfig(runtimeEnvConfig);
    try {
        const components = await (0, _loadcomponents.loadComponents)({
            distDir,
            page: page,
            isAppPath: false
        });
        return Object.keys(components.ComponentMod).filter((key)=>{
            return typeof components.ComponentMod[key] !== "undefined";
        });
    } catch (err) {
        return [];
    }
}`;

  if (code.includes(target1)) {
    code = code.replace(target1, replacement1);
    changed = true;
  }
  if (code.includes(target2)) {
    code = code.replace(target2, replacement2);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(utilsPath, code, 'utf8');
    console.log('[patch-next] Successfully patched Next.js 14.0.4 build utils for App Router.');
  } else {
    console.log('[patch-next] Next.js build utils already patched or safe.');
  }
}
