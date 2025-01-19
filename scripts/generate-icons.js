const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const ICONS_DIR = path.join(__dirname, '../public/images')

// Ensure the directory exists
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true })
}

// Convert SVG to PNG with different sizes
async function generateIcons () {
  const svgBuffer = fs.readFileSync(path.join(ICONS_DIR, 'icon.svg'))

  // Generate PNG icons
  const sizes = [16, 32, 180, 192, 512]
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(ICONS_DIR, `icon-${size}.png`))

    console.log(`Generated ${size}x${size} icon`)
  }

  // Generate maskable icon with padding
  await sharp(svgBuffer)
    .resize(512, 512, { fit: 'contain', background: { r: 26, g: 26, b: 26 } })
    .png()
    .toFile(path.join(ICONS_DIR, 'icon-maskable.png'))

  console.log('Generated maskable icon')

  // Copy files with new names
  fs.copyFileSync(
    path.join(ICONS_DIR, 'icon-180.png'),
    path.join(ICONS_DIR, 'apple-icon.png')
  )

  console.log('Generated all icons successfully!')
}

generateIcons().catch(console.error) 