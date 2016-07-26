<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installtion](#installtion)
    - [1. Install Nodemon](#1-install-nodemon)
    - [2. Install Mocha](#2-install-mocha)
    - [3. Install Istanbul](#3-install-istanbul)
- [Start the application from template](#start-the-application-from-template)
    - [1. Copy template from repository](#1-copy-template-from-repository)
    - [2. Install dependencies](#2-install-dependencies)
    - [3. Run scripts introduction (in *package.json*)](#3-run-scripts-introduction-in-packagejson)
    - [4. Configure run scripts in WebStorm](#4-configure-run-scripts-in-webstorm)
    - [5. Configure WebStorm JavaScript file template](#5-configure-webstorm-javascript-file-template)
- [Development](#development)
    - [A. General](#a-general)
    - [B. Express](#b-express)
    - [C. Test case examples](#c-test-case-examples)
    - [D. Mongoose](#d-mongoose)
- [Coding style:](#coding-style)
    - [A. Native JavaScript](#a-native-javascript)
    - [B. Node.JS](#b-nodejs)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installtion
### 1. Install [Nodemon](https://github.com/remy/nodemon)
```
npm install -g nodemon
```
In case you got below error: 
```
nodemon is not recognized as an internal or external command, program or batch file
```
Since node prefix is not in the PATH ENV variable, any of the globally installed modules are not getting recognized. Try:
```
C:\>npm config get prefix
C:\Users\username\AppData\Roaming\npm
C:\>set PATH=%PATH%;C:\Users\username\AppData\Roaming\npm;
```

### 2. Install [Mocha](https://mochajs.org/)
```
npm install -g mocha
```
### 3. Install [Istanbul](https://github.com/gotwarlost/istanbul)
```
npm install -g istanbul
```

----

# Start the application from template
### 1. Copy template from repository
* Backend schedule task: Backend_task
* Node.Js with Express for web services: Backend_ws

### 2. Install dependencies
In terminal, go to app root folder (where *package.json* is located), run `npm install`

### 3. Run scripts introduction (in *package.json*)
- `npm start`: Monitor file changes for automatic server restart
- `npm test`: Monitor file changes for automatic testing + coverage report generation (Do not lock the report files)

### 4. Configure run scripts in WebStorm

* Run > Edit Configurations

    ![](./images/autotest/edit_config.png)

*  Add new npm config

    ![](./images/autotest/add_new_npm.png)

*  Update correct location for *package.json* and fill in **test** in Scripts

    ![](./images/autotest/npm_nodemon_webstorm.png)

*  Run npm config just created and nodemon will run with coverage test in Webstorm output window

    ![](./images/autotest/run_npm.png)

    ![](./images/autotest/report.png)

**Repeat the same steps for `npm start`.**

### 5. Configure WebStorm JavaScript file template

- File > New > Edit File Templates

    ![](./images/fileTemplate/edit_file_templates.png)

- Add 'use strict;' to JavaScript template. Save.

    ![](./images/fileTemplate/js_template.png)

----

# Development

### A. General
- Name your application

  - Fill in application/developer information in *package.json*
  - Name the base folder

- Follow the folder structure. Keep ./test in sync with ./src.
- Put external dependencies setup/initialization codes in ./src/assets. This folder is excluded for coverage report (defined in .istanbul.yml)


### B. Express
- Put route files in ./src/routes. They will be loaded by index.js.
- Put controller files in ./src/controllers. They will be loaded by routes.
- Create one file per Mongoose model.

### C. Test case examples
| Test purpose | Example folder    |
|:----|:----|
| Express middleware |./Examples/express  |
| fs |./Examples/fs  |
| Mongoose |./Examples/mongoose  |
| Fake timeout |./Examples/timeout  |
| Web service |./Examples/webservice  |
| Private function |./Examples/private  |

### D. [Mongoose](http://mongoosejs.com/docs/guide.html)
- Index

![](./images/mongoose/index.png)
```js
//Prefer to use this without changing all the schema files.
mongoose.connect('mongodb://user:pass@localhost:port/database', { config: { autoIndex: false } });
// or
mongoose.createConnection('mongodb://user:pass@localhost:port/database', { config: { autoIndex: false } });
// or
animalSchema.set('autoIndex', false);
// or
new Schema({..}, { autoIndex: false });
```

During actual production cutover, request [Mongo DB](https://docs.mongodb.com/manual/tutorial/build-indexes-on-replica-sets/) password and build indexes manually on primary DB. They will be replicated to secondary DBs after primary finishes.


----
# Coding style:
### A. Native JavaScript
- Syntax and grammar
  - Use **4 spaces** for indentation. Avoid **tabs**.
  - Use **single quotes '** for strings
  - Limit to 80 characters per line
  - Use semicolons at the end of statement, assignment
      ```
      var a = 1; // This is an assignment, has semicolon ;
      var fn = function(a) {
          ...
      }; // This is also an assignment, has semicolon ;

      function foo(a) {
          ...
      } //This is not an assignment. No semicolon ;
      ```
  - Opening braces go on the same line
    ```js
    // Good
    if (true) {
      console.log('winning');
    }

    // Bad
    if (true)
    {
      console.log('losing');
    }
    ```

  - Use === and !== over == and !=.
  - Avoid eval().
  - Avoid with.
  - All variables/functions should be declared before used.

  - Whitespace
    - Every **comma (,)** should be followed by a space or a **line break**.
    - Each **semicolon (;)** at the end of a statement should be followed with a **line break**.
    - Each **semicolon (;)** in the control part of a for statement should be followed with a **space**.
    - No space between nameOfFunction and **left parenthesis (**. One space between **right parenthesis )** and the **left curly brace {**. Example:
      ```js
      function nameOfFunction(a, b) {
        // nameOfFunction[no space here](
        // a, b)[one space here]{
      }
      ```
  - No nested closures
	```js
	// Good
	setTimeout(function() {
	  client.connect(afterConnect);
	}, 1000);

	function afterConnect() {
	  console.log('winning');
	}

	// Bad
	setTimeout(function() {
	  client.connect(function() {
		console.log('losing');
	  });
	}, 1000);
	```

- Naming
  - **Identifier** (variables and functions): **camelCase**. (exception below). Do not use underscore (_) as the first or last character of a name. It is sometimes intended to indicate privacy, but it does not actually provide privacy.
  - **Constructor** (functions that must be used with the new prefix): start with a **Capital** letter.
  - **Global** variables (in browsers): in **CAPITAL** letters.

  - Name your closures

	Feel free to give your closures a name. It shows that you care about them, and will produce better stack traces, heap and cpu profiles.
	```js
	// Good
	req.on('end', function onEnd() {
	  console.log('winning');
	});

	// Bad
	req.on('end', function() {
	  console.log('losing');
	});
	```


- OO related
  - Constructors

	Assign methods to the prototype object, instead of overwriting the prototype with a new object. Overwriting the prototype makes inheritance impossible: by resetting the prototype you will overwrite the base!
	```
	function Jedi() {
	  console.log('new jedi');
	}

	// bad
	Jedi.prototype = {
	  fight: function fight() {
		console.log('fighting');
	  },

	  block: function block() {
		console.log('blocking');
	  }
	};

	// good
	Jedi.prototype.fight = function fight() {
	  console.log('fighting');
	};

	Jedi.prototype.block = function block() {
	  console.log('blocking');
	};
	```

    Methods can return this to help with method chaining.
    ```
    // bad
    Jedi.prototype.jump = function() {
      this.jumping = true;
      return true;
    };

    Jedi.prototype.setHeight = function(height) {
      this.height = height;
    };

    var luke = new Jedi();
    luke.jump(); // => true
    luke.setHeight(20) // => undefined

    // good
    Jedi.prototype.jump = function() {
      this.jumping = true;
      return this;
    };

    Jedi.prototype.setHeight = function(height) {
      this.height = height;
      return this;
    };

    var luke = new Jedi();

    luke.jump()
      .setHeight(20);
    ```

### B. Node.JS
  - Error handling
    - Always check for errors in callbacks
        ```js
        //bad
        database.get('pokemons', function(err, pokemons) {
            console.log(pokemons);
        });

        //good
        database.get('drabonballs', function(err, drabonballs) {
            if (err) {
                // handle the error somehow, maybe return with a callback
                return console.log(err);
            }
            console.log(drabonballs);
        });
        ```

    - Return on callbacks
      ```js
      //bad
      database.get('drabonballs', function(err, drabonballs) {
        if (err) {
          // if not return here
          console.log(err);
        }
        // this line will be executed as well
        console.log(drabonballs);
      });

      //good
      database.get('drabonballs', function(err, drabonballs) {
        if (err) {
          // handle the error somehow, maybe return with a callback
          return console.log(err);
        }
        console.log(drabonballs);
      });
      ```

