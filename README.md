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
- `npm start`: Monitor file changes for automatic server restart (Whilst nodemon is running, type rs to restart Nodemon)
- `npm test`: Monitor file changes for automatic testing
- `npm coverage`: Monitor file changes for automatic testing + coverage report generation

### 4. Setup WebStorm for run scripts

![](./images/autotest/edit_config.png)

*  Add new npm config

![](./images/autotest/add_new_npm.png)

*  Update correct location for package.json and put **test** in Scripts

![](./images/autotest/npm_nodemon_webstorm.png)

*  Run npm config just created and nodemon will run with coverage test in Webstorm output window

![](./images/autotest/run_npm.png)

![](./images/autotest/report.png)

**Repeat the same steps for `npm coverage` and `npm start`.**

![](./images/autotest/npms.png)

----

# Development

### 1. Name your application
* Fill in application/developer information in *package.json*

----
# Coding style:
### A. Native JavsScript
- Syntax and grammar
  - Use single quotes for strings
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
    *Right:*

    ```js
    if (true) {
      console.log('winning');
    }
    ```

    *Wrong:*

    ```js
    if (true)
    {
      console.log('losing');
    }
    ```

  - Use === and !== over == and !=.
  - Avoid eval().
  - Avoid with.

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

- Naming
  - **Identifier** (variables and functions): **camelCase**. (exception below). Do not use underscore (_) as the first or last character of a name. It is sometimes intended to indicate privacy, but it does not actually provide privacy.
  - **Constructor** (functions that must be used with the new prefix): start with a **Capital** letter.
  - **Global** variables (in browsers): in **CAPITAL** letters.

- Declarations
  - Variable
    - All variables should be declared before used.
    - It is preferred that each variable has declarative statement (and comment). They should be listed in alphabetical order if possible.

        ```js
        var currentEntry; // currently selected table entry
        var level;        // indentation level
        var size;         // size of table
        ```
  - Function
    - All functions should be declared before they are used.

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

- No nested closures

	Use closures, but do not nest them. Otherwise your code will become a mess.
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

- B. Node.JS
  - 4 space for indentation

  - Error handling
  - Always check for errors in callbacks

  ```javascript
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

  ```javascript
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

