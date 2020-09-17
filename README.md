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

A palette is made up of 16 24-bit colors (no alpha channel). This tool allows you to create new palettes, edit existing ones, and export them separately for use in other sprites. Linear color blending is included to make smooth gradients easy to create.
