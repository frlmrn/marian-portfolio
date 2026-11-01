// Captura la web local a varios tamaños (para revisar el diseño).
// Uso: node scripts/foto.mjs <carpeta> <pagina: inicio|casos|...> <ancho>x<alto>[@dpr] ...
import puppeteer from 'puppeteer-core'
const [, , outDir, pageName, ...sizes] = process.argv
const route = pageName === 'inicio' ? '/' : '/' + pageName
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
  headless: true,
  args: ['--hide-scrollbars'],
})
for (const size of sizes) {
  const [wh, dpr = '1'] = size.split('@')
  const [w, h] = wh.split('x').map(Number)
  const page = await browser.newPage()
  page.on('console', m => m.type() === 'error' && console.log('consola:', m.text()))
  page.on('pageerror', e => console.log('error:', e.message))
  await page.setViewport({ width: w, height: h, deviceScaleFactor: Number(dpr), isMobile: w < 700, hasTouch: w < 700 })
  await page.goto(`http://localhost:5193${route}`, { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 600))
  await page.evaluate(() => document.getAnimations().forEach(a => { try { a.finish() } catch {} }))
  await new Promise(r => setTimeout(r, 300))
  const file = `${outDir}/${route.replace(/\W/g, '') || 'inicio'}-${w}x${h}.png`
  await page.screenshot({ path: file, fullPage: w < 700 })
  console.log(file)
  await page.close()
}
await browser.close()
