class PaletteCache
{
  constructor()
  {
    Tools.AddUILabel('inputPaletteFile', 'Load Palette:');
    // this.input = document.createElement('INPUT');
    // this.input.setAttribute('type', 'file');
    // this.input.setAttribute('accept', '.palette');
    // this.input.setAttribute('id', 'inputPaletteFile');
    // this.input.addEventListener('change', this.LoadPalette.bind(this), false);
    // Tools.AddUI(this.input);
    this.input = Tools.AddUIInput({ type: 'file', accept: '.palette', id: 'inputPaletteFile' }, { change: this.LoadPalette.bind(this) });
    Tools.AddUIBR(2);

    this.display = [];
    for(var i = 0; i < Constants.NUM_COLORS; i++)
    {
      this.display.push(
          Tools.AddUIButton(
            { class: 'color' },
            { click: this.SetCurrentColor.bind(this, i) },
            { textContent: '' + i.toString(16).toUpperCase() }
          )
      );
      if((i + 1) % (Constants.NUM_COLORS / 2) == 0)
        Tools.AddUIBR();
    }

    this.palettes = [];
    this.currentPalette = undefined;
  }

  SetCurrentColor(i)
  {
    if(this.currentPalette)
    {
      this.currentPalette.Select(i);
      this.display.forEach(b => b.setAttribute('class', 'color'));
      this.display[i].setAttribute('class', 'color-selected');
    }
  }

  UpdateDisplay()
  {
    this.display.forEach((b, i) => {
      const c = this.currentPalette.At(i);
      b.style.color = c.inverseHex;
      b.style.backgroundColor = c.hex;
    });
  }

  LoadPalette(e)
  {
    let file = e.target.files[0];
    let reader = new FileReader();
    let self = this;

    reader.onload = (e) => {
      let data = new Uint8Array(e.target.result);
      let index = 0;

      let nameLength = data[index++];
      let nameBuffer = [];
      for(var i = 0; i < nameLength; i++)
        nameBuffer.push(data[index++]);
      let name = String.fromCharCode(...nameBuffer);

      let temp = [];
      for(var i = 0; i < 16; i++){
        let cur = 0;
        cur |= (data[index++] << 16);
        cur |= (data[index++] << 8);
        cur |= data[index++];
        temp.push(new Color(cur));
      }
      const palette = new Palette(name, temp);
      self.currentPalette = palette;
      self.palettes.push(palette);
      self.UpdateDisplay();
    };
    reader.readAsArrayBuffer(file);
    this.input.value = '';
  }
}
