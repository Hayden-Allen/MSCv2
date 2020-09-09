class Frame
{
  constructor(w, h)
  {
    this.undoStack = [];
    this.redoStack = [];
    this.grid = new PixelGrid(w, h);
    this.selected = new PixelGrid(w, h);
  }

  Undo()
  {
    if(this.undoStack.length)
    {
      this.redoStack.push(this.grid);
      this.grid = this.undoStack.pop();
    }
  }

  Redo()
  {
    if(this.redoStack.length)
    {
      this.undoStack.push(this.grid);
      this.grid = this.redoStack.pop();
    }
  }

  SetPixel(x, y, v)
  {
    if(y < 0 || y >= this.grid.height || x < 0 || x >= this.grid.width)
      return;

    this.undoStack.push(this.grid);
    this.grid.grid[y][x] = v;
  }

  GetPixel(x, y)
  {
    if(y < 0 || y >= this.grid.height || x < 0 || x >= this.grid.width)
      return;
    return this.grid.grid[y][x];
  }

  FloodFill(x, y, v, start)
  {
    if(y < 0 || y >= this.grid.height || x < 0 || x >= this.grid.width)
      return;
    // starting point
    if(start === undefined)
    {
      start = this.grid.grid[y][x];
      this.undoStack.push(this.grid);
    }
    if(this.grid.grid[y][x] != start || this.grid.grid[y][x] == v)
      return;

    this.grid.grid[y][x] = v;
    this.FloodFill(x - 1, y, v, start);
    this.FloodFill(x, y - 1, v, start);
    this.FloodFill(x + 1, y, v, start);
    this.FloodFill(x, y + 1, v, start);
  }

  Resize(w, h)
  {
    this.grid.Resize(w, h);
    this.selected.Resize(w, h);
  }

  Merge()
  {
    for(var y = 0; y < this.grid.height; y++)
      for(var x = 0; x < this.grid.width; x++)
        if(this.grid.grid[y][x] == Constants.COLOR_CLEAR)
          this.grid.grid[y][x] = this.selected.grid[y][x];
    this.selected = new PixelGrid(w, h);
  }
}
