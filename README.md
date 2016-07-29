<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installtion](#installtion)
    - [1. Install Nodemon (File change monitoring and auto-restart/test.)](#1-install-nodemon-file-change-monitoring-and-auto-restarttest)
    - [2. Install Istanbul (Coverage analysis)](#2-install-istanbul-coverage-analysis)
    - [3. Install Mongo DB 3.2](#3-install-mongo-db-32)
    - [4. Install EsLint (JS linting utility)](#4-install-eslint-js-linting-utility)
- [Start the application from template](#start-the-application-from-template)
    - [1. Copy template from repository](#1-copy-template-from-repository)
    - [2. Install dependencies](#2-install-dependencies)
    - [3. Run scripts introduction (in *package.json*)](#3-run-scripts-introduction-in-packagejson)
    - [4. Configure run scripts in WebStorm](#4-configure-run-scripts-in-webstorm)
    - [5. Configure WebStorm JavaScript file template](#5-configure-webstorm-javascript-file-template)
    - [6. Configure ESLint in WebStorm](#6-configure-eslint-in-webstorm)
- [Development](#development)
    - [A. General](#a-general)
    - [B. Express](#b-express)
    - [C. Test case examples](#c-test-case-examples)
    - [D. Mongoose](#d-mongoose)
      - [Index](#index)
    - [E. Recommended library](#e-recommended-library)
      - [Development](#development-1)
      - [Testing (refer to ./Examples)](#testing-refer-to-examples)
- [Coding style:](#coding-style)
    - [A. Native JavaScript](#a-native-javascript)
      - [Formatting](#formatting)
      - [Logical operators](#logical-operators)
      - [Functions](#functions)
      - [Naming](#naming)
      - [OO related](#oo-related)
    - [B. Node.JS](#b-nodejs)
      - [Error handling](#error-handling)
    - [C. Testing specific](#c-testing-specific)
    - [D. Web service API](#d-web-service-api)
      - [1. Use nouns but no verbs](#1-use-nouns-but-no-verbs)
      - [2. GET method and query parameters should not alter the state](#2-get-method-and-query-parameters-should-not-alter-the-state)
      - [3. Use plural nouns](#3-use-plural-nouns)
      - [4. Use sub-resources for relations](#4-use-sub-resources-for-relations)
      - [5. Handle Errors with HTTP status codes](#5-handle-errors-with-http-status-codes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installtion
### 1. Install [Nodemon](https://github.com/remy/nodemon) (File change monitoring and auto-restart/test.)
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

### 2. Install [Istanbul](https://github.com/gotwarlost/istanbul) (Coverage analysis)
```
npm install -g istanbul
```
### 3. Install [Mongo DB 3.2](https://www.mongodb.com/download-center?jmp=docs&_ga=1.248972366.858031266.1454547591#enterprise)

Start Mongod instance on local PC. Make sure that it is accessible from shell. Your code will need it.
```
> mongo
```
### 4. Install [EsLint](http://eslint.org/) (JS linting utility)
```
npm install -g eslint
```
----

# Start the application from template
### 1. Copy template from repository
* Backend schedule task: Backend_task
* Node.Js with Express for web services: Backend_ws

### 2. Install dependencies
In terminal, go to app root folder (where *package.json* is located), run `npm install`
(Mocha is installed locally for easier setup for 'npm test'. If installed globally, the 'npm test' script will vary for every PC. Typically something like `nodemon --ext js --exec istanbul cover C:\\Users\\maoly\\AppData\\Roaming\\npm\\node_modules\\mocha\\bin\\_mocha`, where the path is relative to npm location and user Id.)


### 3. Run scripts introduction (in *package.json*)
- `npm start`: Monitor file changes for automatic server restart
- `npm test`: Monitor file changes for automatic testing all files, and generate coverage report (Do not lock the report files)
    Coverage report will be generated to ./coverage/lcov-report/index.html. You may open it with any browser.

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

### 6. Configure ESLint in WebStorm

* File > Setting

    ![](./images/autotest/eslintSetting.png)

* Languages & Frameworks > Javascript > Code Quality Tools > ESLint

    ![](./images/autotest/eslintCodeQuality.png)

* Click Enable and set ESLint package location (C:\Users\{user_id}\AppData\Roaming\npm\node_modules\eslint)

    ![](./images/autotest/eslintEnable.png)


----

# Development

### A. General
- Name your application

  - Fill in application/developer information in *package.json*
  - Name the base folder

- Follow the folder structure. Keep ./test in sync with ./src.

- During testing, nodemon will automatically test codes (npm test) or restart application (npm start) once there is any code change. Or you could utilize WebStorm to run other configurations for you, e.g. mocha test one single file.


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
#### Index

![](./images/mongoose/index.png)
```js
// Doesn't work for me
// mongoose.connect('mongodb://user:pass@localhost:port/database', { config: { autoIndex: false } });
// Didn't try
mongoose.createConnection('mongodb://user:pass@localhost:port/database', { config: { autoIndex: false } });
// Work
animalSchema.set('autoIndex', false);
// Work
new Schema({..}, { autoIndex: false });
```

During actual production cutover, request [Mongo DB](https://docs.mongodb.com/manual/tutorial/build-indexes-on-replica-sets/) password and build indexes manually on primary DB. They will be replicated to secondary DBs after primary finishes.

### E. Recommended library
#### Development
- winston       : Logger
- HTTP web service invocation
    - http      : support for the raw HTTP protocol. While it can do everything, often it's a bit clumsy to use.
    - request   : uses the http module and adds a lot of sugar to make it easier to digest: A lot of common cases can be handled with just a tiny bit of code, it supports piping request data, forwarding requests to a different server, etc.
- nodemailer: Send e-mails
- fs        : file System
- moment    : date time operation
- bcrypt    : native JS bcrypt library for NodeJS
- async     : asynchronous operations
- xml2js    : XML to JavaScript object
- Lo-Dash   : superset of Underscore
    - compare to Underscore
        + speed advantage over Underscore on a variety of operations
        + more functions
        + more frequent commits
        - large file size   (22kb vs 5kb, but not matter for backend task)

#### Testing (refer to ./Examples)
- Web Service:
  - http
    - sinon
      - need to handle stream ourselves
      - https://codeutopia.net/blog/2015/01/30/how-to-unit-test-nodejs-http-requests/
    - nock
      - easier to mock http request
      - define expected request and then verify
  - request: sinon

- Mongoose
  - sinon
  - sinon-mongoose
    - plugin for sinon
    - easier to test with chaining mongoose calls

- fs: mock-fs
- timeout: sinon (use fake timers)

----
# Coding style:
### A. Native JavaScript
#### Formatting
  - Use **4 spaces** for indentation. Avoid **tabs**.
  - Use **single quotes '** for strings, unless you are writing JSON.
  - Declare one variable per var statement. All variables/functions should be declared before use.

    It isn't always possible to initialize variables at the point of declaration, so deferred initialization is fine.
    ```js
    // Good
    var keys   = ['foo', 'bar'];
    var values = [23, 42];

    var object = {};
    while (keys.length) {
      var key = keys.pop();
      object[key] = values.pop();
    }

    // Bad
    var keys = ['foo', 'bar'],
        values = [23, 42],
        object = {},
        key;

    while (keys.length) {
      key = keys.pop();
      object[key] = values.pop();
    }
    ```

  - Limit to 80 characters per line

  - Always use semicolons at the end of statement, assignment

    Gotha point: Semicolons should be included at the end of function **expressions**, but not at the end of function **declarations**. The distinction is best illustrated with an example:
      ```js
      var foo = function() {
        return true;
      };  // semicolon here.

      function foo() {
        return true;
      }  // no semicolon here.
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


#### Logical operators
  - Use === and !== over == and !=.
  - Use isNaN() for NaN testing.
  - Use multi-line ternary operator
    ```js
    //Good
    var foo = (a === b)
      ? 1
      : 2;

    // Bad
    var foo = (a === b) ? 1 : 2;
    ```
  - Use descriptive conditions
    Any non-trivial conditions should be assigned to a descriptively named variable or function:
    ```js
    // Good
    var isValidPassword = password.length >= 4 && /^(?=.*\d).{4,}$/.test(password);

    if (isValidPassword) {
      console.log('winning');
    }

    // Bad
    if (password.length >= 4 && /^(?=.*\d).{4,}$/.test(password)) {
      console.log('losing');
    }
    ```

#### Functions
  - Do not use wrapper objects for primitive types. Declare primitive types in literal form.
    ```js
    // Good
    var x = false;

    // Bad
    var x = new Boolean(false);
    ```

  - Use Array and Object literals instead of Array and Object constructors.

    **Good**
    ```js
    // Array
    var a = [x1, x2, x3];
    var a2 = [x1, x2];
    var a3 = [x1];
    var a4 = [];

    // Object
    var o = {}; // Empty object
    var o2 = {
      a: 0,
      b: 1,
      c: 2,
      'strange key': 3
    };
    ```

    **Bad**
    ```js
    // Array
    // Length is 3.
    var a1 = new Array(x1, x2, x3);

    // Length is 2.
    var a2 = new Array(x1, x2);

    // If x1 is a number and it is a natural number the length will be x1.
    // If x1 is a number but not a natural number this will throw an exception.
    // Otherwise the array will have one element with x1 as its value.
    var a3 = new Array(x1);

    // Length is 0.
    var a4 = new Array();

    // Object
    var o = new Object(); // Empty object

    var o2 = new Object();
    o2.a = 0;
    o2.b = 1;
    o2.c = 2;
    o2['strange key'] = 3;
    ```

  - Avoid eval().
  - Avoid with.
  - Avoid JavaScript native stuff unless you are absolutely sure what you are doing.

    E.g., stuff such as Object.freeze, Object.preventExtensions, Object.seal. And avoid extending built-in prototypes.
    ```js
    // Do not do this
    Array.prototype.empty = function() {
      return !this.length;
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

#### Naming

  In general, use functionNamesLikeThis, _privateFunctionNamesLikeThis,
  variableNamesLikeThis, _privateVariableNamesLikeThis, ClassNamesLikeThis, EnumNamesLikeThis, methodNamesLikeThis, CONSTANT_VALUES_LIKE_THIS, foo.namespaceNamesLikeThis.bar, and filenamesLikeThis.js.

  In detail:
  - **variables, properties and function**: **lowerCamelCase**. (exception below). Do not use underscore (_) as the first or last character of a name. It is sometimes intended to indicate privacy, but it does not actually provide privacy.
    ```js
    // Good
    var adminUser = db.query('SELECT * FROM users ...');

    // Bad
    var admin_user = db.query('SELECT * FROM users ...');
    ```
  - **Constructor** (functions that must be used with the new prefix, you could also call it Class [if you insist]): **UpperCamelCase**
    ```js
    // Good
    function BankAccount() {
    }

    // Bad
    function bank_Account() {
    }
    ```
  - **Constants** should be declared as regular variables or static class properties, using all **UPPERCASE** letters.
    ```js
    // Good
    var SECOND = 1 * 1000;

    function File() {
    }
    File.FULL_PERMISSIONS = 0777;

    // Bad
    const SECOND = 1 * 1000;

    function File() {
    }
    File.fullPermissions = 0777;
    ```


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


#### OO related
  - Constructors

	Assign methods to the prototype object, instead of overwriting the prototype with a new object. Overwriting the prototype makes inheritance impossible: by resetting the prototype you will overwrite the base!
	```js
	function Jedi() {
	  console.log('new jedi');
	}

	// Good
	Jedi.prototype.fight = function fight() {
	  console.log('fighting');
	};

	Jedi.prototype.block = function block() {
	  console.log('blocking');
	};

	// Bad
	Jedi.prototype = {
	  fight: function fight() {
		console.log('fighting');
	  },

	  block: function block() {
		console.log('blocking');
	  }
	};
	```

    Methods can return this to help with method chaining.
    ```js
    // Good
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

    // Bad
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
    ```

### B. Node.JS
#### Error handling
    - Always check for errors in callbacks
        ```js
        // Good
        database.get('drabonballs', function(err, drabonballs) {
            if (err) {
                // handle the error somehow, maybe return with a callback
                return console.log(err);
            }
            console.log(drabonballs);
        });

        // Bad
        database.get('pokemons', function(err, pokemons) {
            console.log(pokemons);
        });
        ```

    - Return on callbacks
      ```js
      // Good
      database.get('drabonballs', function(err, drabonballs) {
        if (err) {
          // handle the error somehow, maybe return with a callback
          return console.log(err);
        }
        console.log(drabonballs);
      });

      // Bad
      database.get('drabonballs', function(err, drabonballs) {
        if (err) {
          // if not return here
          console.log(err);
        }
        // this line will be executed as well
        console.log(drabonballs);
      });
      ```

### C. Testing specific
- Test case documentation and grammar (2 approaches)

  > **Rule of thumb**
  >   - group related (functionality, situation wise) tests cases(it blocks) under the same describe block
  >   - When the number test cases within a describe block increases, try to extract the test cases into a new nested describe block

  - `describe` Class > `describe` Class method > `it` test cases
    - Individual test case to test the method
    - Better for few test cases
  - **`describe` Class > `describe` class method > `describe` scenario > `it` test cases**
    - Group test cases together tested under same scenario
    - Better structure when the number of test case increases

  ```js
    //first level describe
    //parent block for holding all nested describe block
    //usually the name of class(or js file)
    //optional, as name of the test file indicates which class/js file is under test
    describe('Class', function(){

        //individual describe block for each class.method
        describe('Class.methodA', function(){

            //1 it block for each expected behaviour under different scenario
            //better for fewer it blocks
            it('should xxx when aaa', function(){

            });

            it('should xxx when bbb', function(){

            });

            it('should xxx when ccc', function(){

            });

        });

        //individual describe block for each class.method
        describe('Class.methodB', function(){

            //individual describe block for each scenario
            describe('Scenario A/Stage A', function(){

                it('should xxx', function(){

                });
                it('should xxx', function(){

                });

            });

            describe('Scenario B/Stage B', function(){

                it('should xxx', function(){

                });
                it('should xxx', function(){

                });

            });

        });

    });

  ```


### D. Web service API
  Ref: [10 Best Practices for Better RESTful API](http://blog.mwaysolutions.com/2014/06/05/10-best-practices-for-better-restful-api/)

#### 1. Use nouns but no verbs

 Resource  | GET (Read)             | POST (Create)            | PUT (Update)              | DELETE
----------|----------------------|------------------------|-------------------------|--------------------------
 /cars     | Returns a list of cars | Create a new ticket      | Bulk update of cars       | Delete all cars
 /cars/711 | Returns a specific car | Method not allowed (405) | Updates a specific ticket | Deletes a specific ticket


  **Do not use verbs**
  ```js
    /getAllCars
    /createNewCar
    /deleteAllRedCars
  ```

#### 2. GET method and query parameters should not alter the state
  Use PUT, POST and DELETE methods  instead of the GET method to alter the state.

#### 3. Use plural nouns
  ```js
    /cars instead of /car
    /users instead of /user
    /products instead of /product
    /settings instead of /setting

  ```
#### 4. Use sub-resources for relations
  If a resource is related to another resource use subresources.
  ```js
  GET /cars/711/drivers/ Returns a list of drivers for car 711
  GET /cars/711/drivers/4 Returns driver #4 for car 711
  ```

#### 5. Handle Errors with HTTP status codes
    The HTTP standard provides over 70 status codes to describe the return values. We don’t need them all, but  there should be used at least a mount of 10.

    200 – OK – Eyerything is working
    201 – OK – New resource has been created
    204 – OK – The resource was successfully deleted

    304 – Not Modified – The client can use cached data

    400 – Bad Request – The request was invalid or cannot be served. The exact error should be explained in the error payload. E.g. „The JSON is not valid“
    401 – Unauthorized – The request requires an user authentication
    403 – Forbidden – The server understood the request, but is refusing it or the access is not allowed.
    404 – Not found – There is no resource behind the URI.
    422 – Unprocessable Entity – Should be used if the server cannot process the enitity, e.g. if an image cannot be formatted or mandatory fields are missing in the payload.

    500 – Internal Server Error – API developers should avoid this error. If an error occurs in the global catch blog, the stracktrace should be logged and not returned as response.

  **Use error payloads**

  All exceptions should be mapped in an error payload.



Reference:

1. [Node.js Style Guide](https://github.com/felixge/node-style-guide)

2. [Google JavaScript Style Guide](https://google.github.io/styleguide/javascriptguide.xml)

3. [TDD/BDD - Properly defining tests, adjusting tests, putting describe blocks inside it blocks](http://programmers.stackexchange.com/questions/298362/tdd-bdd-properly-defining-tests-adjusting-tests-putting-describe-blocks-insi)

4. [Testing Your JavaScript with Jasmine](http://code.tutsplus.com/tutorials/testing-your-javascript-with-jasmine--net-21229)

5. [10 Best Practices for Better RESTful API](http://blog.mwaysolutions.com/2014/06/05/10-best-practices-for-better-restful-api/)