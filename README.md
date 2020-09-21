# MAGE Sprite Creator 2

This is the second iteration of the tool used to create sprites and palettes for the MAGE engine.

## Overview

A MAGE sprite is made up of an integer multiple of 16 pixels in both width and height, multiple frames (if desired), and a 16-color palette. This tool includes the features necessary to create, edit, and save palettes and sprites.

Palettes can be exported for later use as a .palette file, while sprites can be saved with an embedded palette as .sprite files. Both of these formats are proprietary and used by the MAGE engine for compact graphical storage.

## Controls

|Key|Action|
|--------------|------------------------------------|
| 0-9 / A-F   | Change current color               |
| G            | Toggle grid                        |
| , / .       | Toggle x- and y-axis mirroring     |
| R / T       | Toggle rectangular/pixel selection |
| Ctrl         | Select color being hovered over    |
| W / Q       | Switch current frame               |
| Y            | Redo                               |
| Z            | Undo                               |
| Arrow Keys   | Move selection                     |
| Left Mouse   | Draw with current color            |
| Right Mouse  | Erase                              |
| Middle Mouse | Fill with current color            |

## Palettes

### Overview

A palette is made up of 16 24-bit colors (no alpha channel). This tool allows you to create new palettes, edit existing ones, and export them separately for use in other sprites. Linear color blending is included to make smooth gradients easy to create.

### In the Editor

#### IO

A new palette is created automatically upon loading the page. You can change the name of this palette and also save it to disk. You can load palettes from disk to bring them into your current sprite. The dropdown menu allows you to choose which loaded palette is currently being used.

#### Blend

There are two color pickers labeled "Blend Color 1" and "Blend Color 2". The hex code of the currently selected color in each one is displayed in the adjacent textbox. You can also change the color by altering the hex code directly. When either of these pickers' values is changed, the canvas under them will automatically update to display a 16-step gradient between the two selected colors.

An outline will appear around these colors if you mouse over them, and left-clicking while hovering over a color will copy that color's hex code to your clipboard, so you can easily paste it into the palette.

#### Palette

Beneath the blending section is the current palette section. Another color picker that functions as described above is included for convenience. There is an additional button next to it labeled "Copy", which simply copies the color in the textbox to your clipboard in order to save you some precious milliseconds.

The "Palette Colors" canvas also functions like the "Blend Colors" canvas, with one addition. Left-clicking on a color not only copies its hex code to your clipboard, but it also sets it as the current selected color, which is what will appear on the canvas when you left click it.

The colors displayed on the palette canvas are controlled by the 16 textboxes beneath it, each of which contains a hex code. The first row of textboxes control colors 0-7 and the second row controls 8-F. 

## Sprites

### Overview

A sprite is a picture drawn with the colors in a palette. A sprite's width and height are integer multiples of 16. Sprites can have multiple frames. The amount of time each frame takes up (in milliseconds) is considered a part of the sprite and is part of the file saved to disk.

### In the Editor

#### IO

Similarly to the palette IO section, you can rename, save, and load sprites here. However, you cannot have multiple sprites loaded at the same time as you can with palettes.

#### Size & Tiling

This section contains three properties: pixel size, sprite size, and tile size.

Pixel size **is not** a property of the sprite. It is only used in the editor to determine the size of the canvas. Let the value of this input be x. Each "pixel" in the sprite will appear as a square of x by x pixels on your screen. The "Real" checkbox is useful in that it allows you to quickly toggle between the current pixel size and the pixel size in the MAGE engine.

Sprite size has two components: width and height. These **are** properties of the sprite. These control the number of groups of 16 pixels on the sprites x- and y-axes, respectively. For example, if width = 3 and height = 5, the sprite will be 48 pixels wide and 80 pixels tall.

Tile size has two components: width and height. These **are not** properties of the sprites. These control how many times along each axis the current sprite is repeated on the canvas. This tool is designed to assist in the creation of sprites that are meant to "tile" well; that is, sprites that are contiguous when laid side-by-side in a grid.

#### Grid & Background

The "Draw Grid" checkbox toggles the pixel grid on and off. When designing a pattern for a sprite, it is recommended to leave this on as it helps prevent mistakes by allowing you to count the number of pixels between any two locations. However, when doing more detailed work like shading, it is best to turn it off.

The "Grid Color" and "Grid Alpha" inputs change the color and transparency of the grid. If you are tiling your sprite in the editor (i.e. one or both of the "Tile (w, h) inputs is > 1), the inverse color of the selected grid color is used to demarcate the actual sprite.

The "Background Color" color picker simply changes the color of all empty pixels in the sprite. This has no effect on the sprite itself.

#### Selection

The dropdown menu allows you to choose between the two selection modes: **pixel** and **rect**. The "Enable" checkbox enables the currently selected selection mode. Selected pixels will be temporarily drawn in the inverse of their real color in order to make your selection stand out from the rest of the sprite. Pressing the arrow keys will move only your selection instead of the whole sprite, so it is useful for making minor adjustments to large areas of your sprites. When you are done moving your selection, uncheck the "Enable" checkbox to return to draw mode.

**Pixel** selection allows you to left-click on each individual pixel that you want to select. Only pixels that are part of the sprite can be selected (you cannot move blank pixels). This is useful for smaller selections, as it allows you to be very efficient with regards to which pixels you move. For larger selections, the **rect** mode is preferred.

**Rect** selection allows you to left-click on an arbitrary pixel (it can be empty) to choose one corner of a rectangle. Then, you can either hold left-click and drag or simply left-click again to establish the opposite corner. All (non-empty) pixels within the boundaries of the created rectangle will become selected. This is useful for moving large chunks of your sprite at once because it allows you to select lots of pixels much faster than **pixel** mode.

You can copy a selection by pressing Z (undo) before returning to draw mode. This will replace your selected pixels into their original position, but maintain your selection. After this, you can disable selection mode and your selected pixels will appear on the sprite wherever your selection was (as usual).

#### Flip & Mirror

"Flip X" and "Flip Y" will perform horizontal and vertical flipping operations on your entire sprite.

"Mirror X" and "Mirror Y" will mirror any pixels you draw across the corresponding axes (they can also be used together to draw in all four quadrants of your sprite at once). Pixels will always mirror across the horizontal and vertical centers of your sprite, respectively. There is no way to change the line about which they are mirrored.

#### Frame Control

One of the most important sections of the editor, the frame controls allow you to create, delete, clear, and move frames within your sprite as well as animate them and change the speed of the animation in real time.

The "Move frame" interface is primitive but functional. The two textboxes take in the indices of which frames are to be moved. For example, if you have a 3 frame animation, putting "0" in the first textbox and "2" in the second then clicking "Move" will move the first frame to be after the last frame. It is important to note that this does **not** swap frames. The first index is always moved **after** the last one, and all frames in between maintain their relative positions. **NOTE**: currently, the frame previews will not update correctly when you move frames. You will have to select each frame to reset the preview for it. This does not affect the frames themselves and is a purely graphical bug.

The "Time per Frame" input takes the amount of time (in milliseconds) to display each frame. Each frame is displayed for the same amount of time. Pressing "Play" will begin the animation, starting from the current frame. While the animation is running, you can change the time per frame and even edit each frame. This will also change the text of the button to "Pause", and pressing it again will stop the animation on the current frame.

The "Add Frame" button creates a copy of the current frame and places it after the current frame. This is useful for character animations, which often involve subtle movements of limbs while maintaining large portions of the sprite.

The "Delete Frame" button simply deletes the current frame. This operation cannot be undone, and your browser will prompt you upon clicking to confirm that you want to do this.

The "Clear Frame" button erases all pixels in the current frame. This operation cannot be undone, and your browser will prompt you upon clicking to confirm that you want to do this.

#### Other

There is a "New Tab" button at the bottom which is a convenient way to open another instance of the editor in a new tab.

The palette display at the very bottom of this section contains one button for each color in the current palette. Each button's color is that of the color in the current palette that it represents. The index of that color (in hexadecimal) is displayed as the button text, and is the inverse color of the button. The currently selected color will have a blue outline around it.

Underneath the palette section is the frame previews section. Each button contains an image of the frame it represents. The current frame is outlined in blue. Clicking on a preview will both select that frame and copy its index to your clipboard (for easy interfacing with the "Move frame" feature).
