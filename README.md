# GdURL
Google Drive Direct Link Generator


![image](https://user-images.githubusercontent.com/31664438/222920474-b3e1b2db-a6ee-40db-8077-0d1bf9ecbadb.png)


# Install 
[![NPM](https://nodei.co/npm/gdurl.png?compact=true)](https://npmjs.org/package/gdurl)

```
npm install gdurl
```

# Usage 
```javascript
const googleDrive = require("gdurl");

async function test() {
  const docId = "drive-id";
  const result = await googleDrive.getMediaLink(docId);
  console.log(result); 
}

test();
```

# FAQ

Q : How to get drive id ?

A : you can get drive id by looking the url 
example :
```
https://drive.google.com/file/d/13xUgzPgKHvXO4JQF7Nyadci7g3Bpjbgx/view
```

this is `13xUgzPgKHvXO4JQF7Nyadci7g3Bpjbgx` the drive id


# License

[ISC](https://github.com/fdciabdul/GdURL)

# Code By
[Abdul Muttaqin](mailto:abdulmuttaqin456@gmail.com)

# CP 

abdulmuttaqin456@gmail.com
