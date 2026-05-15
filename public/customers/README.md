# Customer assets

Two subdirectories, one per asset class:

- `photos/` - square portrait of the person (one face per file), referenced by
  `lib/content.ts → customerStories.caseStudies[].avatar.photo`
- `logos/` - company mark, referenced by `caseStudies[].logo.src`

Assets here were copied/downloaded from the main eachlabs-web repo. To refresh
or replace a single file, drop it in at the matching path; the card component
falls back to the initials block if a photo fails to load.

## Photos

| File                       | Person          | Source                                            |
| -------------------------- | --------------- | ------------------------------------------------- |
| `aziz-gundogdu.jpg`        | Aziz Gündoğdu   | storage.googleapis.com/magicpoint                 |
| `osman-bahar.png`          | Osman Bahar     | storage.googleapis.com/1019uploads                |
| `furkan-sandal.png`        | Furkan Sandal   | storage.googleapis.com/1019uploads                |
| `osman-menci.png`          | Osman Menci     | storage.googleapis.com/1019uploads                |
| `ekin-dursun.jpeg`         | Ekin Dursun     | storage.googleapis.com/1019uploads                |
| `gokce-oguz.svg`           | Gökçe Oğuz      | eachlabs-web `/public/images/avatars/`            |
| `fatih-guler.svg`          | Fatih Güler     | eachlabs-web `/public/images/avatars/`            |
| `umut-gul.svg`             | Umut Gül        | eachlabs-web `/public/images/avatars/`            |
| `cihat-imamoglu.svg`       | Cihat İmamoğlu  | eachlabs-web `/public/images/avatars/`            |
| `selimhan-cakir.svg`       | Selimhan Çakır  | eachlabs-web `/public/images/avatars/`            |

## Logos

| File                | Company         |
| ------------------- | --------------- |
| `scate.svg`         | Scate           |
| `byterise.svg`      | Byterise        |
| `pixelbyte.svg`     | PixelByte       |
| `yoya.png`          | Yoya Mobile     |
| `pixelwizard.png`   | Pixel Wizard    |
| `baby.png`          | baby.ai         |
| `kata.png`          | Kata Technology |
| `wask.png`          | Wask            |
| `joyolabs.png`      | JoyoLabs        |
| `mobileocean.svg`   | MobileOcean     |
