# CSS Styles
In this folder you can edit all the website styles.

### Snowplow
Under **snowplow** folder you can edit all the custom styles. Please consider maintaing the same folder and files structure based on the modules the interface creates - ex: header, footer, tabs, buttons, etc.

### Page specific styles
For each page specific styles create a folder with the prefix **snowplow-page-** and add the page title (lowercase and "-" allowed only). If the page requires dependencies place them under the same folder. Check to see if these dependencies are already pack with **snowplow.scss** pointing to **src/css/vendors/common** folder.

### Dependencies

#### Vendors
Under **vendors** folder you can place all css dependencies. If any of the dependencies becomes common through pages, then place it under the **vendors/common** folder in order to get concatenated with the main file **snowplow/snowplow.scss**.

#### Icons
We use [Icomoon](https://icomoon.io/app) to create a font with custom icons. Use the Icomoon **selection.json** file to import the project on the web app. Once you're done with editing export icons and replace the folder content with the newly downloaded. Remember to pass all fonts to the **fonts** folder under **src**.