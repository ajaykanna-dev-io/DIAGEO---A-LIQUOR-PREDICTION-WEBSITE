Add-Type -AssemblyName System.Drawing
$sourcePath = 'C:\Users\ajaykanna.k\.gemini\antigravity-ide\brain\8db2385e-5ef6-42b1-a25b-71f4e349b0c9\.user_uploaded\media_1790253413032.jpg'
$src = [System.Drawing.Bitmap]::FromFile($sourcePath)

# Clean hero artwork without any outer elements: X: 652, Y: 165, Width: 215, Height: 185
$rect = New-Object System.Drawing.Rectangle(652, 165, 215, 185)
$cropped = $src.Clone($rect, $src.PixelFormat)
$cropped.Save('public\images\flavors\appleCooked.png', [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()
$src.Dispose()
Write-Host "Perfect hero artwork saved!"
