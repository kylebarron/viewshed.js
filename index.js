var require = require("esm")(module /*, options*/);
var Martini = require("@mapbox/martini").default;
var getPixels = require("get-pixels");

function main() {
  // Tuolumne meadows
  x = 690;
  y = 1581;
  z = 12;

  var path = `/Users/kyle/github/mapping/nst-guide/hillshade/data/terrain_png/${z}/${x}/${y}.png`;
  getPixels(path, function(err, pixels) {
    if (err) {
      console.log("Bad image path");
      return;
    }
    tileSize = pixels.shape[0];
    var mesh = generateMesh(pixels, tileSize);
    testVisibility(mesh, source, dest);
  });
}

function generateMesh(pixels, tileSize) {
  gridSize = tileSize + 1;
  var terrain = new Float32Array(gridSize * gridSize);
  let R, G, B;
  for (let x = 0; x < tileSize; x++) {
    for (let y = 0; y < tileSize; y++) {
      R = pixels.get(x, y, 0);
      G = pixels.get(x, y, 1);
      B = pixels.get(x, y, 2);
      height = -10000 + (R * 256 * 256 + G * 256 + B) * 0.1;
      terrain[y * gridSize + x] = height;
    }
  }

  // backfill right and bottom borders
  for (let x = 0; x < gridSize - 1; x++) {
    terrain[gridSize * (gridSize - 1) + x] =
      terrain[gridSize * (gridSize - 2) + x];
  }
  for (let y = 0; y < gridSize; y++) {
    terrain[gridSize * y + gridSize - 1] = terrain[gridSize * y + gridSize - 2];
  }

  // set up mesh generator for a certain 2^k+1 grid size
  var martini = new Martini(gridSize);

  // generate RTIN hierarchy from terrain data (an array of size^2 length)
  var tile = martini.createTile(terrain);

  // get a mesh (vertices and triangles indices) for a 10m error
  var mesh = tile.getMesh(10);

  return mesh;
}

function testVisibility(mesh, source, dest) {
  mesh;

  mesh.vertices;
  mesh.triangles;
}
