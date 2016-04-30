# Taking the Router Challenge
If you want to show what your favourite Router can do then you've come to the right place. The Challenge involves using your Router to implement a Music Catalog SPA in React. You can see the SPA in action using the [reference implementation](http://grahammendick.github.io/router-challenge/examples/navigation/) I built with my [Navigation router](http://grahammendick.github.io/navigation/). This example together with the following guidelines should be enough to get you up and running, but if you have any questions don't hesitate to [get in touch](../../issues).

## Structure
Create a folder in the `examples` directory named after the npm package of your Router, e.g., `examples/your-router`. The contents of this folder should look like:
```
dist/
└── catalog.js
src/
index.html
package.json
```
## Build and Run
The only npm package dependencies you should have are the three React packages (the addons package is needed for the animation) and your Router package. If your Router consists of multiple packages then you can include them all but, as a guide, don't include any packages that aren't listed on your Router's download documentation page.
```
"dependencies": {
  "react": "^15.0.1",
  "react-addons-css-transition-group": "^15.0.1",
  "react-dom": "^15.0.1",
  "your-router": "^1.0.0"
}
```
There are no such limitations on your devDependencies, although the simpler the better. Running the command `npm run build` should build your source into a single JavaScript file named `catalog.js` inside the `dist` folder (avoid minification to aid in-browser debugging). 

Your SPA should be runnable by opening up `index.html`, without requiring any build step. That means you should check in `catalog.js` and that the contents of `index.html` should be as shown below. The [catalog.css](catalog.css) and [albums.js](albums.js) files are shared across all examples.
```
<html>
  <head>
    <link rel="stylesheet" href="../../catalog.css">
  </head>
  <body>
    <div id="catalog"></div>
    <script src="../../albums.js"></script>
    <script src="dist/catalog.js"></script>
  </body>
</html>
```
## HTML
Keep within the following HTML bounds because the ids and class names point to styles in the the shared [catalog.css](catalog.css) file.

```
<div id="catalog">
  <div id="search">
    <label for="field" class="hidden">Search</label>
    <input id="field" placeholder="Search">
  </div>
  <div id="albums">
    <ul>
      <li>
        <a href="#/hunky-dory">
          <img src="../../sleeves/hunky-dory.jpg" alt="Hunky Dory">
          <div>Hunky Dory</div>
          <div>David Bowie</div>
        </a>
      </li>
      …
    </ul>
  </div>
  <div id="tracks">
    <h1>Hunky Dory</h1>
    <h2>David Bowie</h2>
    <a href="#/hunky-dory" class="selected">Side 1</a>
    <a href="#/hunky-dory/side/2">Side 2</a>
    <span>
      <ol>
        <li>Changes</li>
        ...
      </ol>
    </span>
  </div>
</div>
```
## Functionality
The shared [albums.js](albums.js) file adds the array of albums as a global variable called `ALBUMS`. Each album in the array has a title, slug, band, side1 and side2 properties, for example:
```
{
  title:'Hunky Dory',
  slug:'hunky-dory',
  band:'David Bowie',
  side1: ['Changes','Oh! You Pretty Things','Eight Line Poem','Life on Mars?','Kooks','Quicksand'],
  side2: ['Fill Your Heart','Andy Warhol','Song for Bob Dylan','Queen Bitch','The Bewlay Brothers']
}
```
When the page loads display the list of albums along with information about your router and set the document title to "Catalog".

### Selecting an Album
An album is selected by activating a Hyperlink from the album list. The Hyperlink must have its href populated so it's keyboard accessible and can be opened in a new tab. Set the album's slug as the route parameter, e.g., /hunky-dory. On selecting an album:
* Display the tracks from the first side of the selected album
* Assign the "selected" class name to the "SIDE 1" Hyperlink
* Create a new browser history record
* Set the document title to {album.title}, {album.band}, e.g., Hunky Dory, David Bowie

### Selecting a Side
A side is selected by activating either the "SIDE 1" or "SIDE 2" Hyperlink. The Hyperlink must have its href populated so it's keyboard accessible and can be opened in a new tab. The Url to select the second side is {slug}/side/2, e.g., /hunky-dory/side/2. Side 1 is the default value and must not appear in the Url. On selecting a side:
* Display the tracks from the selected side
* Assign the "selected" class name to the Hyperlink of the selected side
* Replace the existing browser history record

### Flipping Sides
Animate the track list to indicate when changing between sides of a given album. Use the `ReactCSSTransitionGroup` with a `transitionName` of "flip" to perform the animation. The animation must run regardless of what triggered the flip, e.g., re-selecting the album from the list can flip sides, as can navigating through browser history. The animation must not run if either the side doesn't change and/or the album does change.

### Filtering Albums
On entering text in the search box:
* Filter the album list by doing a case insensitive match against the album's title or band
* Add the search text to the query string of all Hyperlinks, e.g., /hunky-dory?search=bowie
* Convert occurrences of space to + in the query string, e.g., /hunky-dory?search=david+bowie
* Create a browser history record, but only after 1 second of inactivity to avoid cluttering up the history on every key press
